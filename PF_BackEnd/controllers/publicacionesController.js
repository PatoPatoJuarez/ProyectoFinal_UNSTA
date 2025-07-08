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
      .populate('refugio', 'nombre email')
      .sort({ fecha: -1 });

    res.status(200).json(publicaciones);
  } catch (error) {
    console.error('❌ Error al obtener publicaciones:', error);
    res.status(500).json({ message: 'Error al obtener publicaciones' });
  }
};

// Eliminar publicación (solo el refugio dueño puede hacerlo)
const eliminarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: refugioId, rol } = req.user;

    if (rol !== 'refugio') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    if (publicacion.refugio.toString() !== refugioId) {
      return res.status(403).json({ message: 'No puedes eliminar esta publicación' });
    }

    await publicacion.deleteOne();
    res.status(200).json({ message: '✅ Publicación eliminada' });
  } catch (error) {
    console.error('❌ Error al eliminar publicación:', error);
    res.status(500).json({ message: 'Error al eliminar publicación' });
  }
};

const actualizarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: refugioId, rol } = req.user;

    if (rol !== 'refugio') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    if (publicacion.refugio.toString() !== refugioId) {
      return res.status(403).json({ message: 'No puedes editar esta publicación' });
    }

    Object.assign(publicacion, req.body);
    await publicacion.save();

    res.status(200).json({ message: '✅ Publicación actualizada', publicacion });
  } catch (error) {
    console.error('❌ Error al actualizar publicación:', error);
    res.status(500).json({ message: 'Error al actualizar publicación' });
  }
};

module.exports = {
  crearPublicacion,
  obtenerPublicaciones,
  eliminarPublicacion,
  actualizarPublicacion
};
