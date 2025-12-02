// server/routes/deliveries.js
const express = require("express");
const requireAuth = require("../middleware/auth");
const supabase = require("../supabaseClient");

const router = express.Router();

// ========================
//  DELIVERY TYPES & STATUS
// ========================
const VALID_DELIVERY_STATUS = [
  "PENDING",
  "SHIPPED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELAYED",
  "RETURNED"
];

const VALID_DELIVERY_TYPES = [
  "HOME_DELIVERY",
  "PICKUP_POINT",
  "LOCKER",
  "STORE_PICKUP",
  "EXPRESS",
  "STANDARD",
  "INTERNATIONAL"
];

// ========================
//  UTIL FUNCTION
// ========================
async function isUserDeleted(userId) {
  const { data: user } = await supabase
    .from("users")
    .select("deleted_at")
    .eq("id", userId)
    .single();

  return user && user.deleted_at !== null;
}

// ========================
//  CRÉER UNE LIVRAISON
// ========================
router.post("/", requireAuth, async (req, res) => {
  const userId = req.user.id;
  let {
    order_id,
    delivery_type,
    pickup_point_id,
    tracking_number,
    statut,
    estimated_date
  } = req.body;

  if (await isUserDeleted(userId)) {
    return res.status(403).json({ message: "Ce compte a été désactivé." });
  }

  if (!order_id) {
    return res.status(400).json({ message: "order_id est requis." });
  }

  // 1) vérifier commande
const { data: order } = await supabase
  .from("orders")
  .select("id, user_id, payment_status, statut")
  .eq("id", order_id)
  .single();

if (!order) return res.status(404).json({ message: "Commande introuvable." });

if (order.user_id !== userId)
  return res.status(403).json({ message: "Accès interdit." });

if (order.payment_status !== "PAID" || 
  order.statut === "CANCELLED" ||
  order.statut === "FAILED" ||
  order.statut === "REFUNDED") {

  return res.status(400).json({
      message: "Impossible de créer une livraison pour une commande invalide."
  });
}



  // 2) valider delivery_type
  const finalType = delivery_type || "HOME_DELIVERY";
  if (!VALID_DELIVERY_TYPES.includes(finalType)) {
    return res.status(400).json({ message: `Type de livraison invalide: ${finalType}` });
  }

  // 3) valider statut
  const finalStatus = statut || "PENDING";
  if (!VALID_DELIVERY_STATUS.includes(finalStatus)) {
    return res.status(400).json({ message: `Statut invalide: ${finalStatus}` });
  }

  // 4) règles pickup points
  if (finalType !== "PICKUP_POINT") {
    pickup_point_id = null;
  }

  if (finalType === "PICKUP_POINT" && !pickup_point_id) {
    return res.status(400).json({
      message: "pickup_point_id est requis pour une livraison PICKUP_POINT."
    });
  }

  // 5) créer livraison
  const { data: delivery, error } = await supabase
    .from("deliveries")
    .insert({
      order_id,
      user_id: userId,
      delivery_type: finalType,
      pickup_point_id,
      statut: finalStatus,
      tracking_number: tracking_number || null,
      estimated_date: estimated_date || null,
      updated_at: new Date()
    })
    .select()
    .single();

  if (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur création livraison." });
  }

  return res.json({ message: "Livraison créée.", delivery });
});

// ========================
//  SUIVRE LIVRAISON
// ========================
router.get("/order/:order_id", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const order_id = req.params.order_id;

  if (await isUserDeleted(userId)) {
    return res.status(403).json({ message: "Ce compte a été désactivé." });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id")
    .eq("id", order_id)
    .single();

  if (!order)
    return res.status(404).json({ message: "Commande introuvable." });

  if (order.user_id !== userId)
    return res.status(403).json({ message: "Accès interdit." });

  const { data: deliveries, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("order_id", order_id)
    .order("updated_at", { ascending: false });

  if (error)
    return res.status(500).json({ message: "Erreur récupération livraison." });

  return res.json({ deliveries });
});

// ========================
//  METTRE À JOUR UNE LIVRAISON
// ========================
router.patch("/:delivery_id", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const delivery_id = req.params.delivery_id;

  const {
    statut,
    tracking_number,
    estimated_date,
    delivery_type,
    pickup_point_id
  } = req.body;

  if (await isUserDeleted(userId)) {
    return res.status(403).json({ message: "Ce compte a été désactivé." });
  }

  // vérifier ownership
  const { data: delivery } = await supabase
    .from("deliveries")
    .select("id, user_id")
    .eq("id", delivery_id)
    .single();

  if (!delivery)
    return res.status(404).json({ message: "Livraison introuvable." });

  if (delivery.user_id !== userId)
    return res.status(403).json({ message: "Accès interdit." });

  // construire la mise à jour
  const updateData = {};

  // ======= STATUT ========
  if (statut) {
    if (!VALID_DELIVERY_STATUS.includes(statut)) {
      return res.status(400).json({ message: `Statut invalide: ${statut}` });
    }
    updateData.statut = statut;

    if (statut === "DELIVERED") {
      updateData.delivered_at = new Date();
    } else {
      updateData.delivered_at = null;
    }
  }

  if (tracking_number) updateData.tracking_number = tracking_number;
  if (estimated_date) updateData.estimated_date = estimated_date;

  // ===== Delivery Type =====
  if (delivery_type) {
    if (!VALID_DELIVERY_TYPES.includes(delivery_type)) {
      return res.status(400).json({ message: `Type invalide: ${delivery_type}` });
    }
    updateData.delivery_type = delivery_type;

    if (delivery_type === "PICKUP_POINT") {
      if (!pickup_point_id) {
        return res.status(400).json({
          message: "pickup_point_id est requis pour PICKUP_POINT."
        });
      }

      const { data: point } = await supabase
        .from("pickup_points")
        .select("id")
        .eq("id", pickup_point_id)
        .single();

      if (!point) {
        return res.status(404).json({
          message: `Le pickup_point_id ${pickup_point_id} n'existe pas.`
        });
      }

      updateData.pickup_point_id = pickup_point_id;
    } else {
      updateData.pickup_point_id = null;
    }
  }

  updateData.updated_at = new Date();

  const { data: updated, error } = await supabase
    .from("deliveries")
    .update(updateData)
    .eq("id", delivery_id)
    .select()
    .single();

  if (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur mise à jour." });
  }

  return res.json({
    message: "Livraison mise à jour.",
    delivery: updated
  });
});


module.exports = router;
