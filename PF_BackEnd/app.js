// -------------------- DEPENDENCIAS --------------------
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// -------------------- CONFIGURACIONES --------------------
dotenv.config();

const app = express();

// -------------------- MIDDLEWARES GLOBALES --------------------
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // Parsear JSON

// -------------------- CONEXIÓN A BASE DE DATOS --------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));

// -------------------- IMPORTAR RUTAS --------------------
const adoptanteRoutes = require('./routers/adoptanteRoutes');
const refugioRoutes = require('./routers/refugioRoutes');
const authRoutes = require('./routers/authRoutes');
const publicacionesRoutes = require('./routers/publicacionRoutes');
const solicitudesRoutes = require('./routers/solicitudesRoutes');

// -------------------- RUTAS DE API --------------------
app.use('/api/auth', authRoutes);
app.use('/api/adoptantes', adoptanteRoutes);
app.use('/api/refugios', refugioRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/solicitudes', solicitudesRoutes); // NUEVO

// -------------------- RUTA DE PRUEBA --------------------
app.get('/', (req, res) => {
  res.send('Servidor funcionando y conectado a MongoDB');
});

// -------------------- INICIAR SERVIDOR --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
