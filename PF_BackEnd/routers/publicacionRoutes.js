const express = require('express');
const router = express.Router();
const {
  crearPublicacion,
  obtenerPublicaciones,
  eliminarPublicacion,
  actualizarPublicacion
} = require('../controllers/publicacionesController');
const authMiddleware = require('../middlewares/authMiddleware');
const Publicacion = require('../models/Publicacion');

// Obtener todas las publicaciones (pública)
router.get('/', obtenerPublicaciones);

// Obtener publicaciones del refugio autenticado
router.get('/mias', authMiddleware, async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({ refugio: req.user.id }).sort({ fecha: -1 });
    res.json(publicaciones);
  } catch (error) {
    console.error('Error al obtener publicaciones propias:', error);
    res.status(500).json({ message: 'Error al obtener publicaciones propias' });
  }
});

// Crear publicación (refugio)
router.post('/', authMiddleware, crearPublicacion);

// Eliminar publicación por ID (refugio dueño)
router.delete('/:id', authMiddleware, eliminarPublicacion);

router.patch('/:id', authMiddleware, actualizarPublicacion);

module.exports = router;
