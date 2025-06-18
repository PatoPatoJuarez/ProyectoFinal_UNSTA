const { body } = require('express-validator');

const validacionAdoptante = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
  body('email').isEmail().withMessage('Email no válido'),
  body('telefono')
    .matches(/^\+54381\d{6,7}$/).withMessage('El teléfono debe comenzar con +54381 y tener entre 9 y 10 dígitos'),
  body('contrasena').isLength({ min: 6 }).withMessage('Contraseña muy corta'),
  body('tieneMascota').isBoolean().withMessage('Debe ser true o false')
];

module.exports = validacionAdoptante;