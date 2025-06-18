const express = require('express');
const router = express.Router();
const Refugio = require('../models/Refugio');
const { validationResult } = require('express-validator');
const validacionRefugio = require('../validations/refugioValidation');

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

module.exports = router;
