// routers/publicacionRoutes.js
const express = require('express');
const router = express.Router();
const { crearPublicacion } = require('../controllers/publicacionesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Crear una nueva publicación (solo refugio)
router.post('/', authMiddleware, crearPublicacion);

module.exports = router;
