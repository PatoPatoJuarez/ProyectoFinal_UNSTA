const mongoose = require('mongoose');

const refugioSchema = new mongoose.Schema({
  nombre: String,            // Nombre del dueño o responsable
  apellido: String,
  nombreCompania: String,    // NUEVO: Nombre del refugio o compañía
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
