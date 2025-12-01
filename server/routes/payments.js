// server/routes/payments.js
const express = require("express");
const requireAuth = require("../middleware/auth");
const supabase = require("../supabaseClient");

const router = express.Router();

// ========================
//  LISTE DES VALEURS AUTORISÉES
// ========================
const VALID_PAYMENT_STATUS = [
  "SUCCESS",
  "FAILED",
  "PENDING",
  "CANCELLED",
  "EXPIRED",
  "REFUNDED",
  "PARTIAL",
  "MANUAL_REVIEW"
];

const VALID_PAYMENT_METHODS = [
  "CARD",
  "PAYPAL",
  "APPLE_PAY",
  "GOOGLE_PAY",
  "BANK_TRANSFER",
  "CASH",
  "INSTALMENT" // paiements en plusieurs fois
];

// ========================
//  UTIL FUNCTIONS
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
//  ENREGISTRER UN PAIEMENT
// ========================
router.post("/", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { order_id, amount, method, status } = req.body;

  if (!order_id || !amount) {
    return res.status(400).json({ message: "order_id et amount sont requis." });
  }

  if (await isUserDeleted(userId)) {
    return res.status(403).json({ message: "Votre compte est désactivé." });
  }

  // 1) vérifier commande
  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id, total_amount, statut, payment_status")
    .eq("id", order_id)
    .single();

  if (!order) {
    return res.status(404).json({ message: "Commande introuvable." });
  }

  // 2) vérifier ownership
  if (order.user_id !== userId) {
    return res.status(403).json({ message: "Accès interdit à cette commande." });
  }

  // 3) valider METHOD
  if (method && !VALID_PAYMENT_METHODS.includes(method)) {
    return res.status(400).json({ message: `Méthode de paiement invalide: ${method}` });
  }

  // 4) valider STATUS
  const finalStatus = status || "SUCCESS";
  if (!VALID_PAYMENT_STATUS.includes(finalStatus)) {
    return res.status(400).json({ message: `Statut de paiement invalide: ${status}` });
  }

  // 5) vérifier montant
  if (Number(order.total_amount) !== Number(amount)) {
    return res.status(400).json({
      message: "Montant incohérent par rapport au total de la commande.",
    });
  }

  // 6) créer transaction
  const fakeTransactionId = `TX-${Date.now()}`;

  const { data: payment, error: payError } = await supabase
    .from("payments")
    .insert({
      order_id,
      transaction_id: fakeTransactionId,
      amount,
      statut: finalStatus,
      payment_method: method || "CARD",
      user_id: userId
    })
    .select()
    .single();

  if (payError) {
    console.log(payError);
    return res.status(500).json({ message: "Erreur lors de l'enregistrement du paiement." });
  }


  // ========================
  // 7) update order selon le status
  // ========================

  let orderUpdate = {};

  switch (finalStatus) {
    case "SUCCESS":
      orderUpdate.payment_status = "PAID";
      orderUpdate.statut = "PAID";
      break;

    case "PENDING":
      orderUpdate.payment_status = "PENDING";
      orderUpdate.statut = "PENDING";
      break;

    case "FAILED":
    case "CANCELLED":
    case "EXPIRED":
      orderUpdate.payment_status = "FAILED";
      orderUpdate.statut = "FAILED";
      break;

    case "REFUNDED":
      orderUpdate.payment_status = "REFUNDED";
      orderUpdate.statut = "REFUNDED";
      break;

    case "PARTIAL":
      orderUpdate.payment_status = "PARTIAL";
      orderUpdate.statut = "PARTIAL";
      break;

    case "MANUAL_REVIEW":
      orderUpdate.payment_status = "REVIEW";
      orderUpdate.statut = "REVIEW";
      break;
  }

  await supabase
    .from("orders")
    .update(orderUpdate)
    .eq("id", order_id);

  return res.json({
    message: "Paiement traité.",
    payment,
    order_status_after_payment: orderUpdate
  });
});
// ========================
//  LISTER LES PAIEMENTS D'UNE COMMANDE
// ========================
router.get("/order/:order_id", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const order_id = req.params.order_id;

  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id")
    .eq("id", order_id)
    .single();

  if (!order) {
    return res.status(404).json({ message: "Commande introuvable." });
  }

  if (order.user_id !== userId) {
    return res.status(403).json({ message: "Accès interdit à cette commande." });
  }

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", order_id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ message: "Erreur récupération des paiements." });
  }

  return res.json({ payments });
});

module.exports = router;
