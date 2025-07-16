const Solicitud = require('../models/Solicitud');
const Publicacion = require('../models/Publicacion');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

// Crear solicitud + conversación + primer mensaje
const crearSolicitud = async (req, res) => {
  try {
    const { rol, id } = req.user;
    if (rol !== 'adoptante') {
      return res.status(403).json({ message: 'Solo adoptantes pueden enviar solicitudes' });
    }

    const { publicacion, mensaje } = req.body;

    const pub = await Publicacion.findById(publicacion);
    if (!pub) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const nuevaSolicitud = new Solicitud({
      adoptante: id,
      publicacion,
      mensaje,
      estado: 'pendiente',
      fecha: new Date(),
    });
    await nuevaSolicitud.save();

    let conversation = await Conversation.findOne({
      adoptanteId: id,
      refugioId: pub.refugio
    });

    if (!conversation) {
      conversation = new Conversation({
        adoptanteId: id,
        refugioId: pub.refugio
      });
      await conversation.save();
    }

    const textoMensaje = mensaje || `Hola, estoy interesado/a en adoptar a ${pub.titulo}.`;
    const newMessage = new Message({
      conversationId: conversation._id,
      senderId: id,
      senderRole: 'adoptante', // <----- Esto es obligatorio, lo agregamos aquí
      text: textoMensaje
    });
    await newMessage.save();

    conversation.lastMessage = textoMensaje;
    conversation.updatedAt = new Date();
    await conversation.save();

    await new Notification({
      userId: pub.refugio, // id del refugio dueño de la publicación
      type: 'adoption_request',
      message: `Tienes una nueva solicitud de adopción de un adoptante interesado en ${pub.titulo}`
    }).save();
    
    res.status(201).json({
      message: 'Solicitud y mensaje enviados con éxito',
      solicitud: nuevaSolicitud,
      conversationId: conversation._id
    });
 
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ message: 'Error al crear solicitud' });
  }
};

// =======================
// Funciones restantes del controlador
// =======================

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

const actualizarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    if (req.user.rol !== 'refugio') {
      return res.status(403).json({ message: 'Solo refugios pueden actualizar solicitudes' });
    }

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

const eliminarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, id: userId } = req.user;

    const solicitud = await Solicitud.findById(id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    if (rol === 'adoptante') {
      if (solicitud.adoptante.toString() !== userId) {
        return res.status(403).json({ message: 'No autorizado para eliminar esta solicitud' });
      }
    } else if (rol === 'refugio') {
      const publicacion = await Publicacion.findById(solicitud.publicacion);
      if (!publicacion || publicacion.refugio.toString() !== userId) {
        return res.status(403).json({ message: 'No autorizado para eliminar esta solicitud' });
      }
    } else {
      return res.status(403).json({ message: 'No autorizado para eliminar esta solicitud' });
    }

    await Solicitud.findByIdAndDelete(id);

    res.json({ message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    res.status(500).json({ message: 'Error al eliminar solicitud' });
  }
};

module.exports = {
  crearSolicitud,
  obtenerSolicitudesRefugio,
  actualizarSolicitud,
  eliminarSolicitud,
};
