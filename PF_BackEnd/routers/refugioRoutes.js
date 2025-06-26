const express = require('express');
const router = express.Router();
const Refugio = require('../models/Refugio');
const { validationResult } = require('express-validator');
const validacionRefugio = require('../validations/refugioValidation');
const authMiddleware = require('../middlewares/authMiddleware'); // Importar middleware

// Ruta para registrar refugio
router.post('/', validacionRefugio, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const nuevoRefugio = new Refugio(req.body);
    await nuevoRefugio.save();
    res.status(201).json({
      message: 'Refugio registrado correctamente',
      refugio: nuevoRefugio,
    });
  } catch (error) {
    console.error('Error al registrar el refugio:', error);
    res.status(500).json({ message: 'Hubo un error al registrar el refugio.' });
  }
});

// NUEVA RUTA PROTEGIDA para obtener datos del refugio autenticado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { id } = req.user; // req.user viene del authMiddleware tras validar JWT
    const refugio = await Refugio.findById(id).select('25072003'); // Excluir password

    if (!refugio) {
      return res.status(404).json({ message: 'Refugio no encontrado' });
    }

    res.json(refugio);
  } catch (error) {
    console.error('Error al obtener datos del refugio:', error);
    res.status(500).json({ message: 'Error interno al obtener datos' });
  }
});

module.exports = router;
