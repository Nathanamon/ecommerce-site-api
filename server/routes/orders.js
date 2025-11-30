// server/routes/orders.js
const express = require("express")
const requireAuth = require("../middleware/auth")
const supabase = require("../supabaseClient")

const router = express.Router()

// -------------------------------------------------------------
// Helper — check if user is deleted
// -------------------------------------------------------------
async function isUserDeleted(userId) {
  const { data: user } = await supabase
    .from("users")
    .select("deleted_at")
    .eq("id", userId)
    .single()

  return user && user.deleted_at !== null
}

// -------------------------------------------------------------
// CRÉATION COMMANDE
// -------------------------------------------------------------
router.post("/", requireAuth, async (req, res) => {
  const userId = req.user.id
  const { total_amount, delivery_address } = req.body

  if (await isUserDeleted(userId)) {
    return res.status(403).json({ message: "Votre compte est désactivé." })
  }

  if (!total_amount) {
    return res.status(400).json({ message: "Le montant total est requis." })
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount,
      delivery_address: delivery_address || "",
      statut: "PENDING"
    })
    .select()

  if (error) {
    console.log(error)
    return res.status(500).json({ message: "Erreur création commande Supabase." })
  }

  return res.status(201).json({
    message: "Commande créée avec succès.",
    order: data[0]
  })
})

// -------------------------------------------------------------
// LISTER COMMANDES UTILISATEUR
// -------------------------------------------------------------
router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.id

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)

  if (error) {
    console.log(error)
    return res.status(500).json({ message: "Erreur récupération commandes." })
  }

  return res.json({ orders: data })
})

// -------------------------------------------------------------
// MODIFIER UNE COMMANDE
// -------------------------------------------------------------
router.put("/update/:order_id", requireAuth, async (req, res) => {
  const user_id = req.user.id;
  const order_id = req.params.order_id;
  const { statut, delivery_address } = req.body;

  if (await isUserDeleted(user_id)) {
    return res.status(403).json({ message: "Votre compte est désactivé." })
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", order_id)
    .single();

  if (!order) {
    return res.status(404).json({ message: "Commande introuvable." });
  }

  if (order.user_id !== user_id) {
    return res.status(403).json({ message: "Accès interdit." });
  }

  if (order.statut === "CANCELLED" || order.statut === "DELIVERED") {
    return res.status(400).json({ message: "Impossible de modifier cette commande." });
  }

  const updates = {};
  if (statut) updates.statut = statut;
  if (delivery_address) updates.delivery_address = delivery_address;

  await supabase
    .from("orders")
    .update(updates)
    .eq("id", order_id);

  return res.json({ message: "Commande mise à jour avec succès." });
});

// -------------------------------------------------------------
// ANNULER UNE COMMANDE
// -------------------------------------------------------------
router.put("/cancel/:order_id", requireAuth, async (req, res) => {
  const user_id = req.user.id;
  const order_id = req.params.order_id;

  if (await isUserDeleted(user_id)) {
    return res.status(403).json({ message: "Votre compte est désactivé." })
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", order_id)
    .single();

  if (!order) {
    return res.status(404).json({ message: "Commande introuvable." });
  }

  if (order.user_id !== user_id) {
    return res.status(403).json({ message: "Accès interdit." });
  }

  if (order.statut !== "PENDING" && order.statut !== "PAID") {
    return res.status(400).json({ message: "Impossible d'annuler — commande déjà expédiée ou livrée." });
  }

  await supabase
    .from("orders")
    .update({ statut: "CANCELLED" })
    .eq("id", order_id);

  return res.json({ message: "Commande annulée avec succès." });
})

module.exports = router;
