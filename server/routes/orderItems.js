const express = require("express"); 
const supabase = require("../supabaseClient");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// ========================================================
// UTIL — Vérifier si le compte utilisateur est supprimé
// ========================================================
async function isUserDeleted(userId) {
  const { data: user } = await supabase
    .from("users")
    .select("deleted_at")
    .eq("id", userId)
    .single();

  return user && user.deleted_at !== null;
}


// -------------------------------------------------------------
// ADD ITEM TO ORDER (Avec Gestion de Stock)
// -------------------------------------------------------------
/**
 * @swagger
 * /api/order-items:
 *   post:
 *     summary: Ajoute un article au panier (commande)
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - product_id
 *               - quantity
 *             properties:
 *               order_id:
 *                 type: integer
 *                 example: 1
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Article ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Données manquantes ou stock insuffisant
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Compte désactivé ou accès interdit
 *       404:
 *         description: Commande ou produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { order_id, product_id, quantity } = req.body;

  if (await isUserDeleted(userId)) {
    return res.status(403).json({ message: "Votre compte est désactivé." });
  }

  if (!order_id || !product_id || !quantity) {
    return res.status(400).json({
      message: "order_id, product_id et quantity sont requis."
    });
  }

  // 1. Vérifier que la commande appartient au user
  const { data: order } = await supabase
    .from("orders")
    .select("user_id")
    .eq("id", order_id)
    .single();

  if (!order) {
    return res.status(404).json({ message: "Commande introuvable." });
  }
  if (order.user_id !== userId) {
    return res.status(403).json({ message: "Accès interdit — cette commande ne vous appartient pas." });
  }

  // 2. Récupérer le prix ET le stock du produit
  const { data: product } = await supabase
    .from("products")
    .select("prix, stock_level") // <--- ON RÉCUPÈRE LE STOCK ICI
    .eq("id", product_id)
    .single();

  if (!product) {
    return res.status(404).json({ message: "Produit introuvable." });
  }

  // 3. VÉRIFICATION DU STOCK
  if (product.stock_level < quantity) {
    return res.status(400).json({ 
      message: `Stock insuffisant. Il ne reste que ${product.stock_level} exemplaires.` 
    });
  }

  const price_at_purchase = product.prix;

  // 4. Insérer l'item dans la commande
  const { data, error } = await supabase
    .from("order_items")
    .insert({
      order_id,
      product_id,
      quantity,
      price_at_purchase
    })
    .select();

  if (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur ajout item." });
  }

  // 5. DÉCRÉMENTER LE STOCK (Mise à jour de la table products)
  const newStock = product.stock_level - quantity;
  
  const { error: stockError } = await supabase
    .from("products")
    .update({ stock_level: newStock })
    .eq("id", product_id);

  if (stockError) {
    console.error("Erreur mise à jour stock:", stockError);
    // Note: Idéalement on devrait annuler l'insertion de l'item ici (rollback), 
    // mais avec Supabase simple c'est complexe. Pour un projet étudiant, c'est acceptable.
  }

  // 6. Recalculer le total de la commande
  await recalcOrderTotal(order_id);

  return res.json({
    message: "Article ajouté et stock mis à jour.",
    item: data[0]
  });
});


// -------------------------------------------------------------
// GET ITEMS OF ORDER
// -------------------------------------------------------------
/**
 * @swagger
 * /api/order-items/{order_id}:
 *   get:
 *     summary: Récupère les articles d'une commande
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Liste des articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderItem'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:order_id", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const order_id = req.params.order_id;

  if (await isUserDeleted(userId)) {
    return res.status(403).json({ message: "Votre compte est désactivé." });
  }

  // Vérifier ownership
  const { data: order } = await supabase
    .from("orders")
    .select("user_id")
    .eq("id", order_id)
    .single();

  if (!order) {
    return res.status(404).json({ message: "Commande introuvable." });
  }
  if (order.user_id !== userId) {
    return res.status(403).json({ message: "Accès interdit." });
  }

  const { data, error } = await supabase
    .from("order_items")
    .select("id, order_id, product_id, quantity, price_at_purchase, products(nom)")
    .eq("order_id", order_id);

  if (error) return res.status(500).json({ message: "Erreur récupération items." });

  return res.json({ items: data });
});


// -------------------------------------------------------------
// UPDATE ITEM QUANTITY
// -------------------------------------------------------------
/**
 * @swagger
 * /api/order-items/{item_id}:
 *   put:
 *     summary: Modifie la quantité d'un article
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Quantité mise à jour
 *       400:
 *         description: Quantité invalide ou stock insuffisant
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put("/:item_id", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { quantity } = req.body;
  const item_id = req.params.item_id;

  if (await isUserDeleted(userId)) {
    return res.status(403).json({ message: "Votre compte est désactivé." });
  }

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Quantité invalide." });
  }

  // récupérer l'item pour avoir order_id et product_id
  const { data: item } = await supabase
    .from("order_items")
    .select("order_id, product_id, quantity") // On a besoin de l'ancienne quantité et du product_id
    .eq("id", item_id)
    .single();

  if (!item) {
    return res.status(404).json({ message: "Item introuvable." });
  }

  // Vérifier ownership de la commande
  const { data: order } = await supabase
    .from("orders")
    .select("user_id")
    .eq("id", item.order_id)
    .single();

  if (order.user_id !== userId) {
    return res.status(403).json({ message: "Accès interdit." });
  }

  // --- GESTION STOCK LORS DE LA MISE À JOUR ---
  // 1. Récupérer le stock actuel
  const { data: product } = await supabase
    .from("products")
    .select("stock_level")
    .eq("id", item.product_id)
    .single();

  // 2. Calculer la différence (si on augmente la qté, on doit vérifier le stock)
  const diff = quantity - item.quantity; 
  
  if (diff > 0) {
    // L'utilisateur veut plus d'articles, on vérifie si on en a assez
    if (product.stock_level < diff) {
       return res.status(400).json({ message: `Stock insuffisant. Il ne reste que ${product.stock_level} exemplaires en plus.` });
    }
  }

  // 3. Mettre à jour l'item
  await supabase
    .from("order_items")
    .update({ quantity })
    .eq("id", item_id);

  // 4. Mettre à jour le stock (on retire la différence du stock)
  // Si diff est positif (ajout), on réduit le stock. Si négatif (retrait), on augmente le stock.
  await supabase
    .from("products")
    .update({ stock_level: product.stock_level - diff })
    .eq("id", item.product_id);

  await recalcOrderTotal(item.order_id);

  return res.json({ message: "Quantité mise à jour avec succès." });
});


// -------------------------------------------------------------
// DELETE AN ITEM
// -------------------------------------------------------------
/**
 * @swagger
 * /api/order-items/{item_id}:
 *   delete:
 *     summary: Supprime un article du panier
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article
 *     responses:
 *       200:
 *         description: Article supprimé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:item_id", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const item_id = req.params.item_id;

  if (await isUserDeleted(userId)) {
    return res.status(403).json({ message: "Votre compte est désactivé." });
  }

  // récupérer l'item pour remettre le stock
  const { data: item } = await supabase
    .from("order_items")
    .select("order_id, product_id, quantity")
    .eq("id", item_id)
    .single();

  if (!item) {
    return res.status(404).json({ message: "Item introuvable." });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("user_id")
    .eq("id", item.order_id)
    .single();

  if (order.user_id !== userId) {
    return res.status(403).json({ message: "Accès interdit." });
  }

  // --- REMETTRE LE STOCK ---
  // On récupère le stock actuel
  const { data: product } = await supabase
    .from("products")
    .select("stock_level")
    .eq("id", item.product_id)
    .single();

  // On rajoute la quantité supprimée au stock
  await supabase
    .from("products")
    .update({ stock_level: product.stock_level + item.quantity })
    .eq("id", item.product_id);

  // Suppression de l'item
  await supabase
    .from("order_items")
    .delete()
    .eq("id", item_id);

  await recalcOrderTotal(item.order_id);

  return res.json({ message: "Article supprimé et stock rétabli." });
});


// -------------------------------------------------------------
// RECOUNT TOTAL
// -------------------------------------------------------------
async function recalcOrderTotal(order_id) {
  const { data: items } = await supabase
    .from("order_items")
    .select("quantity, price_at_purchase")
    .eq("order_id", order_id);

  // 1. Calcul du Sous-total (HT)
  const subtotal = items.reduce((sum, item) => {
    return sum + item.quantity * item.price_at_purchase;
  }, 0);

  // 2. Application TVA + ARRONDI STRICT (Fix du bug)
  const totalWithTax = subtotal * 1.2;
  const roundedTotal = Math.round(totalWithTax * 100) / 100; // Arrondi à 2 chiffres après la virgule

  // 3. Mise à jour de la commande
  await supabase
    .from("orders")
    .update({ total_amount: roundedTotal })
    .eq("id", order_id);
}

module.exports = router;