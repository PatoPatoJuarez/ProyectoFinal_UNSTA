const express = require('express');
const router = express.Router();
const {
  crearSolicitud,
  obtenerSolicitudesRefugio,
  actualizarSolicitud,
  eliminarSolicitud,
} = require('../controllers/solicitudesController');
const authMiddleware = require('../middlewares/authMiddleware');
const Solicitud = require('../models/Solicitud'); // Lo usás en el get /mias

// Crear una nueva solicitud (solo adoptantes)
router.post('/', authMiddleware, crearSolicitud);

// Obtener solicitudes para refugio autenticado
router.get('/refugio', authMiddleware, obtenerSolicitudesRefugio);

// Obtener solicitudes del adoptante autenticado
router.get('/mias', authMiddleware, async (req, res) => {
  try {
    const { rol, id } = req.user;
    if (rol !== 'adoptante') {
      return res.status(403).json({ message: 'Solo adoptantes pueden ver sus solicitudes' });
    }

    const solicitudes = await Solicitud.find({ adoptante: id })
      .populate('publicacion', 'titulo tipoMascota')
      .sort({ fecha: -1 });

    res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener solicitudes propias:', error);
    res.status(500).json({ message: 'Error al obtener solicitudes propias' });
  }
});

// Actualizar estado o datos de una solicitud (solo refugios)
router.patch('/:id', authMiddleware, actualizarSolicitud);

// Eliminar una solicitud (refugio o adoptante, según permisos)
router.delete('/:id', authMiddleware, eliminarSolicitud);

module.exports = router;
