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
router.post("/register", async (req, res) => {
  const { name, email, password, adresse } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nom, email et mot de passe obligatoires." })
  }

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (existingUser) {
    return res.status(409).json({ message: "Cet email est déjà utilisé." })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from("users")
    .insert({
      nom: name,
      email,
      password_hash: passwordHash,
      adresse: adresse || "",
      deleted_at: null
    })
    .select()

  if (error) {
    console.log(error)
    return res.status(500).json({ message: "Erreur enregistrement supabase." })
  }

  return res.status(201).json({
    message: "Utilisateur créé avec succès.",
    user: data[0]
  })
})


// -------------------------------------------------------------
// LOGIN
// -------------------------------------------------------------
router.post("/login", async (req, res) => {
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
router.put("/profile", requireAuth, async (req, res) => {
  const userId = req.user.id
  const { nom, adresse } = req.body

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

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)

  if (error) {
    console.log(error)
    return res.status(500).json({ message: "Erreur modification profil." })
  }

  return res.json({ message: "Profil mis à jour avec succès." })
})


// -------------------------------------------------------------
// DELETE ACCOUNT
// -------------------------------------------------------------
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
