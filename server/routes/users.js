// server/routes/users.js
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const requireAuth = require("../middleware/auth")
const supabase = require("../supabaseClient")

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

// -------------------------------------------------------------
// REGISTER
// -------------------------------------------------------------
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - mot_de_passe
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Jean Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean@example.com"
 *               mot_de_passe:
 *                 type: string
 *                 format: password
 *                 example: "MotDePasse123!"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Données manquantes
 *       409:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.post("/auth/register", async (req, res) => {
  // 1. DÉSTRUCTURATION : On extrait les variables de req.body
  const { nom, email, mot_de_passe,  } = req.body; 

  if (!nom || !email || !mot_de_passe) {
    return res.status(400).json({ message: 'Nom, email et mot de passe obligatoires.' });
  }

  try {
    // 2. On vérifie si l'utilisateur existe déjà
    const { data: existingUser } = await supabase
      .from('users') 
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    // 3. Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(mot_de_passe, salt); // <- Utilise la variable mot_de_passe

    // 4. Insérer dans Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          nom: nom, // <- Utilise la variable nom
          email: email, 
          password_hash: passwordHash 
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Compte créé avec succès !', user: data });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
});


// -------------------------------------------------------------
// LOGIN
// -------------------------------------------------------------
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "MotDePasse123!"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Identifiants incorrects
 *       403:
 *         description: Compte désactivé
 *       500:
 *         description: Erreur serveur
 */
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Vérifier si le compte a été supprimé (email d’origine)
  const { data: deletedUser } = await supabase
    .from("users")
    .select("deleted_at")
    .eq("original_email", email)
    .single();

  if (deletedUser && deletedUser.deleted_at !== null) {
    return res.status(403).json({ message: "Ce compte a été supprimé." });
  }

  // Vérifier si utilisateur existe avec cet email
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return res.status(401).json({ message: "Email incorrect." });
  }

  if (user.deleted_at !== null) {
    return res.status(403).json({ message: "Ce compte a été supprimé." });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ message: "Mot de passe incorrect." });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  delete user.password_hash;

  return res.json({
    message: "Connexion réussie.",
    token,
    user
  });
});


// -------------------------------------------------------------
// PROFILE
// -------------------------------------------------------------
/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Récupère le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Compte désactivé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get("/profile", requireAuth, async (req, res) => {
  const userId = req.user.id

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" })
  }

  if (user.deleted_at !== null) {
    return res.status(403).json({ message: "Ce compte a été supprimé." })
  }

  delete user.password_hash

  return res.json({ user })
})

// -------------------------------------------------------------
// UPDATE PROFILE
// -------------------------------------------------------------
/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Met à jour le profil utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Jean Dupont Modifié"
 *               adresse:
 *                 type: string
 *                 example: "456 Nouvelle Rue"
 *               telephone:
 *                 type: string
 *                 example: "0987654321"
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       403:
 *         description: Compte désactivé
 *       500:
 *         description: Erreur serveur
 */
router.put("/profile", requireAuth, async (req, res) => {
  const userId = req.user.id
  const { nom, adresse, telephone } = req.body

  // vérifier si compte désactivé
  const { data: user } = await supabase
    .from("users")
    .select("deleted_at")
    .eq("id", userId)
    .single()

  if (user.deleted_at !== null) {
    return res.status(403).json({ message: "Ce compte a été supprimé." })
  }

  const updates = {}
  if (nom) updates.nom = nom
  if (adresse) updates.adresse = adresse
  if (telephone) updates.telephone = telephone

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.log(error)
    return res.status(500).json({ message: "Erreur modification profil." })
  }

  return res.json({ message: "Profil mis à jour avec succès." })
})


// -------------------------------------------------------------
// DELETE ACCOUNT
// -------------------------------------------------------------
/**
 * @swagger
 * /api/delete:
 *   delete:
 *     summary: Supprime le compte utilisateur (anonymisation)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compte anonymisé et désactivé
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.delete("/delete", requireAuth, async (req, res) => {
  const userId = req.user.id

  const { data: user } = await supabase
    .from("users")
    .select("email")
    .eq("id", userId)
    .single()

  const { error } = await supabase
    .from("users")
    .update({
      nom: "Compte supprimé",
      original_email: user.email,
      email: `deleted_${userId}@deleted.com`,
      adresse: "",
      password_hash: "",
      deleted_at: new Date().toISOString()
    })
    .eq("id", userId)

  if (error) {
    console.log(error)
    return res.status(500).json({ message: "Erreur suppression compte." })
  }

  return res.json({ message: "Compte anonymisé et désactivé." })
})


// -------------------------------------------------------------
// GET USER ORDERS HISTORY
// -------------------------------------------------------------
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupère l'historique des commandes de l'utilisateur
 *     tags: [Utilisateurs]
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
 *       403:
 *         description: Compte désactivé
 *       500:
 *         description: Erreur serveur
 */
router.get("/orders", requireAuth, async (req, res) => {
  const userId = req.user.id

  const { data: user } = await supabase
    .from("users")
    .select("deleted_at")
    .eq("id", userId)
    .single()

  if (user.deleted_at !== null) {
    return res.status(403).json({ message: "Ce compte a été supprimé." })
  }

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
