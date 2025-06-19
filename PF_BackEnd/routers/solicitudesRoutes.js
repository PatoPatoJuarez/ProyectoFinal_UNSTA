const express = require('express');
const router = express.Router();
const {
  crearSolicitud,
  obtenerSolicitudesRefugio,
  actualizarSolicitud,  // <-- agregamos esta función
} = require('../controllers/solicitudesController');
const authMiddleware = require('../middlewares/authMiddleware');
const Solicitud = require('../models/Solicitud');

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

// ** Nueva ruta PATCH para actualizar estado o datos de la solicitud **
router.patch('/:id', authMiddleware, actualizarSolicitud);

module.exports = router;
