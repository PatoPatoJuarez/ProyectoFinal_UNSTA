// controllers/publicacionesController.js
const Publicacion = require('../models/Publicacion');

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

module.exports = { crearPublicacion };
