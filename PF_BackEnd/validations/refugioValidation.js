const { body, validationResult } = require('express-validator');

const refugioValidation = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
  body('nombreCompania').notEmpty().withMessage('El nombre de refugio es obligatorio'),
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('telefono').matches(/^(\+54|54)?\d{8,15}$/).withMessage('El teléfono debe tener entre 8 y 15 dígitos, con o sin +54'),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('localidad').notEmpty().withMessage('La localidad es obligatoria'),
  body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
  body('tipoMascota').isArray({ min: 1 }).withMessage('El tipo de mascota debe ser un arreglo y contener al menos un tipo'),
  body('tarifaAdopcion').notEmpty().withMessage('La tarifa de adopción es obligatoria'),
  body('seguimientoAdopcion').notEmpty().withMessage('El seguimiento de adopción es obligatorio'),
  body('necesidadesRefugio').notEmpty().withMessage('Las necesidades del refugio son obligatorias')
];

module.exports = refugioValidation;
