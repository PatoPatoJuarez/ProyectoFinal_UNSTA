// controllers/adoptanteController.js
const Adoptante = require('../models/Adoptante');
const { validationResult } = require('express-validator');

const registrarAdoptante = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const {
      nombre, apellido, email, telefono, contrasena, localidad,
      tieneMascota, viveEn, disponeDeHorarios, tuvoMascota,
      motivoAdopcion, cuidadosVeterinarios, cuidadoAlternativo
    } = req.body;

    const nuevoAdoptante = new Adoptante({
      nombre,
      apellido,
      email,
      telefono,
      contrasena,
      localidad,
      tieneMascota,
      viveEn,
      disponeDeHorarios,
      tuvoMascota,
      motivoAdopcion,
      cuidadosVeterinarios,
      cuidadoAlternativo,
    });

    await nuevoAdoptante.save();
    res.status(201).json({ mensaje: 'Adoptante registrado con éxito', adoptante: nuevoAdoptante });
  } catch (error) {
    console.error('Error al registrar adoptante:', error);
    res.status(500).json({ mensaje: 'Error al registrar el adoptante', error });
  }
};

module.exports = { registrarAdoptante };
