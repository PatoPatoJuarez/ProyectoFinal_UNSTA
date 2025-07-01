const { body } = require('express-validator');

const validacionAdoptante = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
  body('email').isEmail().withMessage('Email no válido'),
  body('telefono').matches(/^(\+54|54)?\d{8,15}$/).withMessage('El teléfono debe tener entre 8 y 15 dígitos, con o sin +54'),
  body('contrasena').isLength({ min: 6 }).withMessage('Contraseña muy corta'),
  body('tieneMascota').isBoolean().withMessage('Debe ser true o false')
];

module.exports = validacionAdoptante;