const mongoose = require('mongoose');

const refugioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: String,
  telefono: String,
  contrasena: String,
  localidad: String,
  direccion: String,
  tipoMascota: [String],
  procesoAdopcion: String,
  tarifaAdopcion: String,
  seguimientoAdopcion: String,
  necesidadesRefugio: String,
  rol: {
  type: String,
  default: 'refugio',
  enum: ['refugio']
  },
});

const Refugio = mongoose.model('Refugio', refugioSchema);
module.exports = Refugio;
