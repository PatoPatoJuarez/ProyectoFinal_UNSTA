const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
  adoptante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adoptante',
    required: true
  },
  publicacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publicacion',
    required: true
  },
  mensaje: { type: String },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada'],
    default: 'pendiente'
  },
  fecha: { type: Date, default: Date.now }
});

const Solicitud = mongoose.model('Solicitud', solicitudSchema);
module.exports = Solicitud;
