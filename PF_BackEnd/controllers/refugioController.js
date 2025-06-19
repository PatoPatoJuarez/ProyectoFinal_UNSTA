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

// NUEVO endpoint para obtener datos del refugio autenticado
const obtenerRefugioActual = async (req, res) => {
  try {
    const { id } = req.user; // req.user debe venir del middleware de autenticación

    const refugio = await Refugio.findById(id).select('-password'); // excluye password
    if (!refugio) return res.status(404).json({ message: 'Refugio no encontrado' });

    res.json(refugio);
  } catch (error) {
    console.error('Error al obtener refugio:', error);
    res.status(500).json({ message: 'Error al obtener refugio' });
  }
};

module.exports = {
  registrarRefugio,
  obtenerRefugioActual
};
