require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Route de test
app.get('/', (req, res) => {
  res.send('API EcoMarket en ligne 🚀');
});

// --- ROUTE PRODUITS ---
app.get('/api/products', async (req, res) => {
  try {
    // 1. On récupère les produits ET on fait une "jointure" avec les Reviews pour avoir juste les notes
    // '*, Reviews(rating)' signifie : prends tout du produit, et va chercher le champ 'rating' dans la table Reviews liée
    const { data, error } = await supabase
      .from('products')
      .select('*, reviews(rating)') 
      .order('id', { ascending: true });

    if (error) throw error;

    // 2. On transforme les données pour le Frontend
    const formattedProducts = data.map(product => {
      // On récupère le tableau des avis liés à ce produit (ex: [{rating: 5}, {rating: 4}])
      const reviews = product.Reviews || [];
      const reviewCount = reviews.length;
      
      // Calcul mathématique de la moyenne
      let averageRating = 0;
      if (reviewCount > 0) {
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = total / reviewCount;
      }

      return {
        id: product.id,
        name: product.nom,             
        price: product.prix,           
        description: product.description,
        category: product.category,
        image: product.image_url,      
        stock: product.stock_level,
        
        // ICI : On envoie la vraie moyenne calculée
        rating: parseFloat(averageRating.toFixed(1)), 
        reviewCount: reviewCount
      };
    });
    
    res.json(formattedProducts);

  } catch (error) {
    console.error('Erreur:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route Détail Produit (avec la même traduction)
// Route Détail Produit (Vrai calcul de moyenne)
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Récupérer le produit
    const productQuery = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productQuery.error) throw productQuery.error;
    const productData = productQuery.data;

    // 2. Récupérer les avis liés (Table Reviews)
    const reviewsQuery = await supabase
      .from('reviews')
      .select('*') // Tu pourrais faire .select('*, Users(nom)') si tu veux le nom du client
      .eq('product_id', id)
      .order('created_at', { ascending: false });

    const reviewsData = reviewsQuery.data || [];

    // 3. Calculer la moyenne réelle (Mathématiques)
    let averageRating = 0;
    if (reviewsData.length > 0) {
      const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
      averageRating = sum / reviewsData.length;
    }

    // 4. Préparer l'objet final pour le Frontend
    const product = {
      id: productData.id,
      name: productData.nom,
      price: productData.prix,
      description: productData.description,
      category: productData.category,
      image: productData.image_url,
      stock: productData.stock_level,
      
      // La vraie note calculée !
      rating: parseFloat(averageRating.toFixed(1)), // ex: 4.5
      reviewCount: reviewsData.length,
      
      // On formate les avis pour le Frontend (commentaire -> comment)
      reviews: reviewsData.map(r => ({
        id: r.id,
        user: 'Client Anonyme', // ou r.Users.nom si tu as fait la jointure
        rating: r.rating,
        comment: r.commentaire, // Mapping important ici
        date: r.created_at
      })),
      
      images: [productData.image_url]
    };
    
    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Produit introuvable' });
  }
});

app.listen(port, () => {
  console.log(`Serveur prêt sur http://localhost:${port}`);
});