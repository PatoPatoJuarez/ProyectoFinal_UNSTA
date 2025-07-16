// models/Publicacion.js
const mongoose = require('mongoose');

const publicacionSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipoMascota: { type: String, enum: ['perro', 'gato'], required: true },
  edad: { type: String },
  genero: { type: String, enum: ['hembra', 'macho'], required: true },
  vacunado: { type: String, enum: ['si', 'no'], required: true },
  tamaño: { type: String },
  fotos: [{ type: String }], // URL de imágenes
  fecha: { type: Date, default: Date.now },
  refugio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Refugio',
    required: true
  }
});

const Publicacion = mongoose.model('Publicacion', publicacionSchema);
module.exports = Publicacion;
