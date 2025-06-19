const Publicacion = require('../models/Publicacion');

// Crear nueva publicación (solo refugio)
const crearPublicacion = async (req, res) => {
  try {
    const { rol, id } = req.user;

    if (rol !== 'refugio') {
      return res.status(403).json({ message: 'Solo los refugios pueden crear publicaciones' });
    }

    const nuevaPublicacion = new Publicacion({
      ...req.body,
      refugio: id
    });

    await nuevaPublicacion.save();

    res.status(201).json({
      message: '✅ Publicación creada con éxito',
      publicacion: nuevaPublicacion
    });
  } catch (error) {
    console.error('❌ Error al crear publicación:', error);
    res.status(500).json({ message: 'Error al crear publicación' });
  }
};

// Obtener todas las publicaciones (pública)
const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .populate('refugio', 'nombre email') // opcional: muestra info del refugio
      .sort({ fecha: -1 }); // ordena por fecha descendente

    res.status(200).json(publicaciones);
  } catch (error) {
    console.error('❌ Error al obtener publicaciones:', error);
    res.status(500).json({ message: 'Error al obtener publicaciones' });
  }
};

module.exports = {
  crearPublicacion,
  obtenerPublicaciones
};
