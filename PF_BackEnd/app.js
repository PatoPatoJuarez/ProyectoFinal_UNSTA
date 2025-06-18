// Importar dependencias
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Importar rutas
const adoptanteRoutes = require('./routers/adoptanteRoutes');
const refugioRoutes = require('./routers/refugioRoutes');
const authRoutes = require('./routers/authRoutes');
const publicacionesRoutes = require('./routers/publicacionRoutes');




// Configurar dotenv para acceder a variables de entorno
dotenv.config();

// Crear la aplicación de Express
const app = express();

// Habilitar CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando y conectado a MongoDB');
});

// Rutas de API 
app.use('/api/adoptantes', adoptanteRoutes);
app.use('/api/refugios', refugioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/publicaciones', publicacionesRoutes);



// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
