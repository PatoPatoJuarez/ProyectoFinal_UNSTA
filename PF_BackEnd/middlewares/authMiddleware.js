const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
 //("👉 Headers:", req.headers); // 🔥 LOG para ver TODO
 //("👉 Authorization header:", req.headers.authorization); // 🔥 LOG para ver AUTH

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("❌ No se encontró Bearer en el header");
    return res.status(401).json({ message: 'No autorizado. Token faltante.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decodificado:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token inválido o expirado:", error.message);
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authMiddleware;
