// server/routes/orders.js
const express = require("express");
const requireAuth = require("../middleware/auth");
const supabase = require("../supabaseClient");

const router = express.Router();

// -------------------------------------------------------------
// CRÉER UNE COMMANDE (POST /api/orders)
// -------------------------------------------------------------
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crée une nouvelle commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - total_amount
 *               - delivery_address
 *             properties:
 *               total_amount:
 *                 type: number
 *                 format: float
 *                 example: 1199.99
 *               delivery_address:
 *                 type: string
 *                 example: "123 Rue de Paris, 75000 Paris"
 *     responses:
 *       201:
 *         description: Commande créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post("/", requireAuth, async (req, res) => {
  const userId = req.user.id;
  // ICI : On attend le total et l'adresse, PAS les produits
  const { total_amount, delivery_address } = req.body;

  if (!total_amount || !delivery_address) {
    return res.status(400).json({ message: "Montant total et adresse requis." });
  }

  // Si le montant est 0 (panier vide ou bug), on bloque
  if (parseFloat(total_amount) <= 0) {
     return res.status(400).json({ message: "Le montant de la commande ne peut pas être zéro." });
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          total_amount: total_amount,
          delivery_address: delivery_address,
          statut: "En attente"
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      message: "Commande créée.", 
      order: data // Le frontend a besoin de data.id
    });

  } catch (error) {
    console.error("Erreur commande:", error);
    res.status(500).json({ message: "Erreur serveur lors de la commande." });
  }
});

// -------------------------------------------------------------
// LISTER LES COMMANDES (GET /api/orders)
// -------------------------------------------------------------
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Liste toutes les commandes de l'utilisateur
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: "Erreur récupération." });
  res.json({ orders: data });
});

module.exports = router;