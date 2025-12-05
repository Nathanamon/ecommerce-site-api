const jwt = require('jsonwebtoken');

// Récupération de la clé secrète depuis le .env
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    // 1. Récupérer le token du header (Format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new Error('Token manquant');
    }

    const token = authHeader.split(' ')[1]; // On prend la partie après "Bearer"
    
    // 2. Vérifier le token
    const decodedToken = jwt.verify(token, JWT_SECRET);
    
    // 3. Ajouter l'ID utilisateur à la requête pour les routes suivantes
    req.user = { id: decodedToken.id };
    
    next(); // Passer à la suite
  } catch (error) {
    res.status(401).json({ error: 'Requête non authentifiée !' });
  }
};