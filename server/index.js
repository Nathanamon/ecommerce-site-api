require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Autorise le frontend
app.use(express.json()); // Permet de lire les JSON envoyés par le front

// Connexion Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Route de test
app.get('/', (req, res) => {
  res.send('API E-commerce en ligne 🚀');
});

// Lancement
app.listen(port, () => {
  console.log(`Serveur écoutant sur http://localhost:${port}`);
});