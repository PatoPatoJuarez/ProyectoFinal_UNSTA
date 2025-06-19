const Solicitud = require('../models/Solicitud');

const crearSolicitud = async (req, res) => {
  try {
    const { rol, id } = req.user;
    if (rol !== 'adoptante') {
      return res.status(403).json({ message: 'Solo adoptantes pueden enviar solicitudes' });
    }

    const { publicacion, mensaje } = req.body;

    const nuevaSolicitud = new Solicitud({
      adoptante: id,
      publicacion,
      mensaje,
      estado: 'pendiente',
      fecha: new Date(),
    });

    await nuevaSolicitud.save();

    res.status(201).json({
      message: 'Solicitud enviada con éxito',
      solicitud: nuevaSolicitud,
    });
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ message: 'Error al crear solicitud' });
  }
};

const obtenerSolicitudesRefugio = async (req, res) => {
  try {
    const { rol, id } = req.user;
    if (rol !== 'refugio') {
      return res.status(403).json({ message: 'Solo refugios pueden ver sus solicitudes' });
    }

    const solicitudes = await Solicitud.find()
      .populate({
        path: 'publicacion',
        match: { refugio: id },
        select: 'titulo tipoMascota',
      })
      .populate('adoptante', 'nombre email telefono')
      .exec();

    const solicitudesFiltradas = solicitudes.filter(s => s.publicacion !== null);

    res.json(solicitudesFiltradas);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ message: 'Error al obtener solicitudes' });
  }
};

// ** Nueva función para actualizar una solicitud **
const actualizarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const solicitudActualizada = await Solicitud.findByIdAndUpdate(id, cambios, { new: true });

    if (!solicitudActualizada) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.json(solicitudActualizada);
  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    res.status(500).json({ message: 'Error al actualizar solicitud' });
  }
};

module.exports = {
  crearSolicitud,
  obtenerSolicitudesRefugio,
  actualizarSolicitud,  // <-- exportar la función
};
