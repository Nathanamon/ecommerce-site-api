const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET 

function requireAuth(req, res, next) {
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
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
}

module.exports = requireAuth;
