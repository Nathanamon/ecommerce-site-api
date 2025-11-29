// server/routes/orders.js
const express = require("express")
const requireAuth = require("../middleware/auth")
const supabase = require("../supabaseClient")

const router = express.Router()

// -------------------------------------------------------------
// CRÉATION COMMANDE
// -------------------------------------------------------------
router.post("/", requireAuth, async (req, res) => {
  const userId = req.user.id
  const { total_amount, delivery_address } = req.body

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

module.exports = router
