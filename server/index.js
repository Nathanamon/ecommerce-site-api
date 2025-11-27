require('dotenv').config();
const axios = require('axios');
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
      const reviews = product.reviews || [];
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

// --- ROUTE AJOUTER UN AVIS (Respect du contrat) ---
// --- ROUTE AJOUTER UN AVIS ---
app.post('/api/products/:id/reviews', async (req, res) => {
  const { id } = req.params; // L'ID du produit
  const { rating, comment } = req.body; // La note et le commentaire

  // 1. Validation : On vérifie que tout est là
  if (!rating || !comment) {
    return res.status(400).json({ error: 'Note et commentaire requis.' });
  }

  try {
    // 2. Insertion dans Supabase
    const { data, error } = await supabase
      .from('reviews') // Attention : minuscule si ta table est "reviews"
      .insert([
        { 
          product_id: id, 
          rating: rating, 
          commentaire: comment // Mapping : on reçoit 'comment', on écrit dans 'commentaire'
          // user_id: 1 // (Optionnel) Tu pourras lier un user plus tard
        }
      ])
      .select()
      .single(); // On récupère l'objet créé pour le renvoyer

    if (error) throw error;
    
    // 3. Succès
    res.status(201).json(data);

  } catch (error) {
    console.error('Erreur ajout avis:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTE RECOMMANDATION MÉTÉO ---
app.get('/api/recommendations/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Coordonnées GPS requises' });
  }

  try {
    // 1. Appel à l'API Externe (OpenWeather)
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiKey}`;
    const weatherResponse = await axios.get(weatherUrl);
    
    const temp = weatherResponse.data.main.temp;
    const description = weatherResponse.data.weather[0].description;
    
    // 2. Logique de Recommandation "EcoMarket"
    let categoryFilter;
    let message;

    // S'il fait chaud (> 20°C), on suggère de sortir (Audio portable, Téléphonie)
    if (temp > 18) { // S'il fait > 18°C (Beau temps)
      // On recommande : Audio (Enceinte plage), Mobilité (Trottinette), Photo (Drone)
      categoryFilter = ['Audio', 'Mobilité', 'Photo', 'Wearables']; 
      message = `Il fait ${Math.round(temp)}°C ☀️ ! Équipez-vous pour l'extérieur.`;
    } 
    else { // S'il fait froid / Pluie
      // On recommande : Gaming (Pack), Maison (Projecteur/Chauffage), Informatique
      categoryFilter = ['Gaming', 'Maison', 'Informatique']; 
      message = `Il fait ${Math.round(temp)}°C 🌧️... Le moment idéal pour rester chez soi !`;
    }

    // 3. Récupération des produits correspondants dans Supabase
    // On utilise .in() pour chercher dans plusieurs catégories
    const { data: products, error } = await supabase
      .from('products') // Attention majuscule/minuscule selon ta base
      .select('*, reviews(rating)')
      .in('category', categoryFilter) 
      .limit(4); // On en prend juste 4 pour l'affichage

    if (error) throw error;

    // On formate (calcul moyenne étoiles) comme d'habitude
    const formattedProducts = products.map(p => {
      const reviews = p.reviews || [];
      const avg = reviews.length > 0 
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
        : 0;
      return {
        ...p,
        name: p.nom, price: p.prix, image: p.image_url, stock: p.stock_level, // Mapping FR -> EN
        rating: parseFloat(avg.toFixed(1)), reviewCount: reviews.length
      };
    });

    // On renvoie les produits ET le message météo contextuel
    res.json({
      weather: { temp, description, city: weatherResponse.data.name },
      message,
      products: formattedProducts
    });

  } catch (error) {
    console.error('Erreur Météo:', error.message);
    res.status(500).json({ error: "Impossible de récupérer la météo" });
  }
});

app.listen(port, () => {
  console.log(`Serveur prêt sur http://localhost:${port}`);
});