require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const userRoutes = require("./routes/users")
const ordersRoutes = require("./routes/orders")
const orderItemsRoutes = require("./routes/orderItems");
const paymentsRoutes = require("./routes/payments");
const deliveriesRoutes = require("./routes/deliveries");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT ;

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes)
app.use("/api/orders", ordersRoutes)
app.use("/api/order-items", orderItemsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/deliveries", deliveriesRoutes);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn(" ATTENTION: Supabase non configuré. Les routes produits ne fonctionneront pas.");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- CONFIGURATION SWAGGER ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcoMarket API',
      version: '1.0.0',
      description: 'Documentation de l\'API E-commerce du projet EcoMarket',
      contact: {
        name: 'Support EcoMarket',
        email: 'support@ecomarket.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Serveur Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Schéma Utilisateur
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nom: { type: 'string', example: 'Jean Dupont' },
            email: { type: 'string', example: 'jean@example.com' },
            adresse: { type: 'string', example: '123 Rue de Paris' },
            telephone: { type: 'string', example: '0123456789' },
            deleted_at: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        // Schéma Produit
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'iPhone 13' },
            price: { type: 'number', format: 'float', example: 999.99 },
            description: { type: 'string', example: 'Smartphone Apple' },
            category: { type: 'string', example: 'Téléphonie' },
            image: { type: 'string', example: 'https://example.com/iphone.jpg' },
            stock: { type: 'integer', example: 50 },
            rating: { type: 'number', format: 'float', example: 4.5 },
            reviewCount: { type: 'integer', example: 120 }
          }
        },
        // Schéma Commande
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            total_amount: { type: 'number', format: 'float', example: 1199.99 },
            delivery_address: { type: 'string', example: '123 Rue de Paris' },
            statut: { 
              type: 'string', 
              enum: ['En attente', 'PAID', 'PENDING', 'FAILED', 'REFUNDED', 'CANCELLED'],
              example: 'En attente'
            },
            payment_status: { 
              type: 'string', 
              enum: ['UNPAID', 'PAID', 'PENDING', 'FAILED', 'REFUNDED'],
              example: 'UNPAID'
            },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        // Schéma Article de commande
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            order_id: { type: 'integer', example: 1 },
            product_id: { type: 'integer', example: 1 },
            quantity: { type: 'integer', example: 2 },
            price_at_purchase: { type: 'number', format: 'float', example: 999.99 },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        // Schéma Paiement
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            order_id: { type: 'integer', example: 1 },
            transaction_id: { type: 'string', example: 'TX-123456789' },
            amount: { type: 'number', format: 'float', example: 1199.99 },
            statut: { 
              type: 'string', 
              enum: ['SUCCESS', 'FAILED', 'PENDING', 'CANCELLED', 'EXPIRED', 'REFUNDED'],
              example: 'SUCCESS'
            },
            payment_method: { 
              type: 'string', 
              enum: ['CARD', 'PAYPAL', 'APPLE_PAY', 'GOOGLE_PAY', 'BANK_TRANSFER', 'CASH'],
              example: 'CARD'
            },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        // Schéma Livraison
        Delivery: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            order_id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            delivery_type: { 
              type: 'string', 
              enum: ['HOME_DELIVERY', 'PICKUP_POINT', 'LOCKER', 'STORE_PICKUP', 'EXPRESS', 'STANDARD'],
              example: 'HOME_DELIVERY'
            },
            statut: { 
              type: 'string', 
              enum: ['PENDING', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELAYED'],
              example: 'PENDING'
            },
            tracking_number: { type: 'string', example: 'TRK-123456789' },
            estimated_date: { type: 'string', format: 'date-time' },
            delivered_at: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        // Schéma Avis
        Review: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            product_id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            commentaire: { type: 'string', example: 'Excellent produit !' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        // Schéma Erreur
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Message d\'erreur' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      { name: 'Produits', description: 'Gestion des produits' },
      { name: 'Utilisateurs', description: 'Authentification et profil utilisateur' },
      { name: 'Commandes', description: 'Gestion des commandes' },
      { name: 'Panier', description: 'Gestion du panier' },
      { name: 'Paiements', description: 'Gestion des paiements' },
      { name: 'Livraisons', description: 'Gestion des livraisons' },
      { name: 'Météo', description: 'Recommandations basées sur la météo' }
    ]
  },
  apis: ['./index.js', './routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
// Route pour afficher la doc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



// Route de test
app.get('/', (req, res) => {
  res.send('API EcoMarket en ligne ');
});

// --- ROUTE PRODUITS ---
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupère tous les produits
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupère un produit spécifique
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Détails du produit avec avis
 *       404:
 *         description: Produit non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 */
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
/**
 * @swagger
 * /api/products/{id}/reviews:
 *   post:
 *     summary: Ajoute un avis à un produit
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Excellent produit !"
 *     responses:
 *       201:
 *         description: Avis ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
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
/**
 * @swagger
 * /api/recommendations/weather:
 *   get:
 *     summary: Récupère des recommandations basées sur la météo
 *     tags: [Météo]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude
 *     responses:
 *       200:
 *         description: Recommandations météo et produits
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weather:
 *                   type: object
 *                   properties:
 *                     temp:
 *                       type: number
 *                     description:
 *                       type: string
 *                     city:
 *                       type: string
 *                 message:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Coordonnées manquantes
 *       500:
 *         description: Erreur serveur
 */
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
      message = `Il fait ${Math.round(temp)}°C  ! Équipez-vous pour l'extérieur.`;
    } 
    else { // S'il fait froid / Pluie
      // On recommande : Gaming (Pack), Maison (Projecteur/Chauffage), Informatique
      categoryFilter = ['Gaming', 'Maison', 'Informatique']; 
      message = `Il fait ${Math.round(temp)}°C ... Le moment idéal pour rester chez soi !`;
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