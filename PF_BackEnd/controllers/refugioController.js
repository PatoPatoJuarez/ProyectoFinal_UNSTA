const Refugio = require('../models/Refugio');
const { validationResult } = require('express-validator');

const registrarRefugio = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const nuevoRefugio = new Refugio(req.body);
    await nuevoRefugio.save();
    res.status(201).json({
      message: 'Refugio registrado correctamente',
      refugio: nuevoRefugio
    });
  } catch (error) {
    console.error('Error al registrar el refugio:', error);
    res.status(500).json({ message: 'Error al registrar el refugio' });
  }
};

module.exports = { registrarRefugio };
