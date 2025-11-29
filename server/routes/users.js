// server/routes/users.js
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const requireAuth = require("../middleware/auth")


const router = express.Router()

// Clé secrète pour signer les JWT (en vrai : mettre dans .env)
const JWT_SECRET = process.env.JWT_SECRET 
// "Fake" base utilisateurs en mémoire (pour le projet, pas pour la prod)
const users = []   // { id, name, email, passwordHash }

/**
 * POST /api/register
 * Body: { name, email, password }
 */
//inscription
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nom, email et mot de passe sont obligatoires." })
  }

  // Vérifier si email déjà utilisé
  const existing = users.find(u => u.email === email)
  if (existing) {
    return res.status(409).json({ message: "Cet email est déjà utilisé." })
  }

  // Hash du mot de passe
  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = {
    id: Date.now(), // simple identifiant
    name,
    email,
    passwordHash
  }

  users.push(newUser)

  // On ne renvoie pas le mot de passe
  const { passwordHash: _, ...userSafe } = newUser

  return res.status(201).json({
    message: "Utilisateur créé avec succès.",
    user: userSafe
  })
})

/**
 * POST /api/login
 * Body: { email, password }
 */
//connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  const user = users.find(u => u.email === email)
  if (!user) {
    return res.status(401).json({ message: "Email incorrect." })
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    return res.status(401).json({ message: "Mot de passe incorrect." })
  }

  // Création du token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  )

  const { passwordHash: _, ...userSafe } = user

  return res.json({
    message: "Connexion réussie.",
    token,
    user: userSafe
  })
})

router.get("/profile", requireAuth, (req, res) => {
  const user = users.find(u => u.id === req.user.id)
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" })

  const { passwordHash, ...safeUser } = user
  return res.json({ user: safeUser })
})

module.exports = router
