// models/Adoptante.js
const mongoose = require('mongoose');

const adoptanteSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: String,
  telefono: String,
  contrasena: String,
  localidad: String,
  tieneMascota: Boolean,
  viveEn: String,
  disponeDeHorarios: Boolean,
  tuvoMascota: Boolean,
  motivoAdopcion: String,
  cuidadosVeterinarios: String,
  cuidadoAlternativo: String,
  rol: {
    type: String,
    default: 'adoptante',
    enum: ['adoptante']
  },
});

const Adoptante = mongoose.model('Adoptante', adoptanteSchema);
module.exports = Adoptante;
