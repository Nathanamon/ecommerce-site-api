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
 const { data: product, error: productError } = await supabase
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

  console.log("DEBUG items error:", error);
  console.log("DEBUG items data:", data);

  if (error) {
    return res.status(500).json({ message: "Erreur récupération items.", error });
  }

  return res.json({ items: data });
});

module.exports = router;
