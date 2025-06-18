const { body, validationResult } = require('express-validator');

const refugioValidation = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('telefono').matches(/^\+54381\d{6,7}$/).withMessage('El teléfono debe comenzar con +54381 y tener 9 o 10 dígitos'),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('localidad').notEmpty().withMessage('La localidad es obligatoria'),
  body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
  body('tipoMascota').isArray({ min: 1 }).withMessage('El tipo de mascota debe ser un arreglo y contener al menos un tipo'),
  body('tarifaAdopcion').notEmpty().withMessage('La tarifa de adopción es obligatoria'),
  body('seguimientoAdopcion').notEmpty().withMessage('El seguimiento de adopción es obligatorio'),
  body('necesidadesRefugio').notEmpty().withMessage('Las necesidades del refugio son obligatorias')
];

module.exports = refugioValidation;
