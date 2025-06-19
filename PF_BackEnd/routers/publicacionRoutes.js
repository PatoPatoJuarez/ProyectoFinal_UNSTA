const express = require('express');
const router = express.Router();
const { crearPublicacion, obtenerPublicaciones } = require('../controllers/publicacionesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener todas las publicaciones (pública)
router.get('/', obtenerPublicaciones);

// Crear una nueva publicación (protegida para refugios)
router.post('/', authMiddleware, crearPublicacion);

module.exports = router;
