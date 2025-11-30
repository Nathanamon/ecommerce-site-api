const jwt = require("jsonwebtoken");
const supabase = require("../supabaseClient");
const JWT_SECRET = process.env.JWT_SECRET;

async function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token manquant" });
  }

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Format de token invalide" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // 👇 NOUVEAU : Vérifier si le compte est supprimé
    const { data: user } = await supabase
      .from("users")
      .select("deleted_at")
      .eq("id", decoded.id)
      .single();

    if (!user) {
      return res.status(401).json({ message: "Utilisateur inexistant." });
    }

    if (user.deleted_at !== null) {
      return res.status(403).json({ message: "Ce compte a été supprimé." });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
}

module.exports = requireAuth;
