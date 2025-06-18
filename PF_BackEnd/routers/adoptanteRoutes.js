// routers/adoptanteRoutes.js
const express = require('express');
const router = express.Router();
const Adoptante = require('../models/Adoptante');
const validacionAdoptante = require('../validations/adoptanteValidation');
const { validationResult } = require('express-validator');

// Ruta para registrar adoptante
router.post('/', validacionAdoptante, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const nuevoAdoptante = new Adoptante(req.body);
    await nuevoAdoptante.save();
    res.status(201).json({
      message: 'Adoptante registrado correctamente',
      adoptante: nuevoAdoptante,
    });
  } catch (error) {
    console.error('Error al registrar al adoptante:', error);
    res.status(500).json({ message: 'Hubo un error al registrar al adoptante.' });
  }
});

module.exports = router;
