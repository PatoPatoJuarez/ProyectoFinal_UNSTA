// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Adoptante = require('../models/Adoptante');
const Refugio = require('../models/Refugio');

router.post('/login', async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Buscar en adoptantes
    let usuario = await Adoptante.findOne({ email });

    if (!usuario) {
      // Si no está en Adoptante, buscar en refugios
      usuario = await Refugio.findOne({ email });
      if (!usuario) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }
    }

    // Verificar contraseña (por ahora, sin hash)
    if (usuario.contrasena !== contrasena) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const payload = {
      id: usuario._id,
      rol: usuario.rol,
      nombre: usuario.nombre,
      email: usuario.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'claveSecreta', {
      expiresIn: '4h'
    });

    res.json({ token, usuario: payload });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
