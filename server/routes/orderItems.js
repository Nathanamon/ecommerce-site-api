const express = require("express"); 
const supabase = require("../supabaseClient");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// -------------------------------------------------------------
// ADD ITEM TO ORDER
// -------------------------------------------------------------
router.post("/", requireAuth, async (req, res) => {
  const { order_id, product_id, quantity } = req.body;

  if (!order_id || !product_id || !quantity) {
    return res.status(400).json({
      message: "order_id, product_id et quantity sont requis."
    });
  }

  // Récupérer le prix du produit
  const { data: product } = await supabase
    .from("products")
    .select("prix")
    .eq("id", product_id)
    .single();

  if (!product) {
    return res.status(404).json({ message: "Produit introuvable." });
  }

  const price_at_purchase = product.prix;

  const { data, error } = await supabase
    .from("order_items")
    .insert({
      order_id,
      product_id,
      quantity,
      price_at_purchase
    })
    .select();

  if (error) return res.status(500).json({ message: "Erreur ajout item." });

  await recalcOrderTotal(order_id);

  return res.json({
    message: "Article ajouté à la commande.",
    item: data[0]
  });
});


// -------------------------------------------------------------
// GET ITEMS OF ORDER
// -------------------------------------------------------------
router.get("/:order_id", requireAuth, async (req, res) => {
  const order_id = req.params.order_id;

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
router.put("/:item_id", requireAuth, async (req, res) => {
  const { quantity } = req.body;
  const item_id = req.params.item_id;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Quantité invalide." });
  }

  // récupérer l'order_id de cet item
  const { data: item } = await supabase
    .from("order_items")
    .select("order_id")
    .eq("id", item_id)
    .single();

  if (!item) {
    return res.status(404).json({ message: "Item introuvable." });
  }

  // mise à jour
  await supabase
    .from("order_items")
    .update({ quantity })
    .eq("id", item_id);

  await recalcOrderTotal(item.order_id);

  return res.json({ message: "Quantité mise à jour avec succès." });
});


// -------------------------------------------------------------
// DELETE AN ITEM
// -------------------------------------------------------------
router.delete("/:item_id", requireAuth, async (req, res) => {
  const item_id = req.params.item_id;

  // récupérer l'order_id avant suppression
  const { data: item } = await supabase
    .from("order_items")
    .select("order_id")
    .eq("id", item_id)
    .single();

  if (!item) {
    return res.status(404).json({ message: "Item introuvable." });
  }

  await supabase
    .from("order_items")
    .delete()
    .eq("id", item_id);

  await recalcOrderTotal(item.order_id);

  return res.json({ message: "Article supprimé de la commande." });
});



// -------------------------------------------------------------
// RECOUNT TOTAL
// -------------------------------------------------------------
async function recalcOrderTotal(order_id) {
  // récupérer tous les items
  const { data: items } = await supabase
    .from("order_items")
    .select("quantity, price_at_purchase")
    .eq("order_id", order_id);

  const total = items.reduce((sum, item) => {
    return sum + item.quantity * item.price_at_purchase;
  }, 0);

  await supabase
    .from("orders")
    .update({ total_amount: total })
    .eq("id", order_id);
}

module.exports = router;
