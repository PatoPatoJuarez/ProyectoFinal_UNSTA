const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ⚠️ Cabecera Authorization ausente
  if (!authHeader) {
    return res.status(401).json({ message: 'No autorizado. Cabecera Authorization faltante.' });
  }

    // ⚠️ Validación de campos vacíos
  if (!email || !contrasena || email.trim() === '' || contrasena.trim() === '') {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
  }

  // ✅ Extraer el token
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario en la request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authMiddleware;