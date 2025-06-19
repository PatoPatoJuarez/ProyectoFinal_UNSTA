// controllers/solicitudesController.js
const Solicitud = require('../models/Solucitud');

const obtenerSolicitudesDelAdoptante = async (req, res) => {
  try {
    const { id, rol } = req.user;

    if (rol !== 'adoptante') {
      return res.status(403).json({ message: 'Solo adoptantes pueden ver sus solicitudes' });
    }

    const solicitudes = await Solicitud.find({ adoptante: id })
      .populate('publicacion');

    res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener solicitudes del adoptante:', error);
    res.status(500).json({ message: 'Error al obtener solicitudes' });
  }
};

module.exports = { obtenerSolicitudesDelAdoptante };
