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

  // Vérifier email existant
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
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
      adresse: adresse || ""
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
  const { email, password } = req.body

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (!user) {
    return res.status(401).json({ message: "Email incorrect." })
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    return res.status(401).json({ message: "Mot de passe incorrect." })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  )

  delete user.password_hash

  return res.json({
    message: "Connexion réussie.",
    token,
    user
  })
})

// -------------------------------------------------------------
// PROFILE
// -------------------------------------------------------------
router.get("/profile", requireAuth, async (req, res) => {
  const userId = req.user.id

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" })
  }

  delete user.password_hash

  return res.json({ user })
})

module.exports = router
