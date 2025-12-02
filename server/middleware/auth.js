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

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    const { data: user } = await supabase
      .from("users")
      .select("deleted_at")
      .eq("id", decoded.id)
      .single();

    req.user.deleted = user && user.deleted_at !== null;

    return next();

  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
}

module.exports = requireAuth;
