// -------------------- DEPENDENCIAS --------------------
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// -------------------- CONFIGURACIONES --------------------
dotenv.config();

const app = express();
const server = http.createServer(app);

// -------------------- CORS CONFIG --------------------
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(express.json());

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
const chatRoutes = require('./routers/chatRoutes');
const notificationsRoutes = require('./routers/notifications');

// -------------------- RUTAS DE API --------------------
app.use('/api/auth', authRoutes);
app.use('/api/adoptantes', adoptanteRoutes);
app.use('/api/refugios', refugioRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationsRoutes);

// -------------------- RUTA DE PRUEBA --------------------
app.get('/', (req, res) => {
  res.send('Servidor funcionando y conectado a MongoDB');
});

// -------------------- SOCKET.IO --------------------
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
io.on('connection', (socket) => {
  console.log('🔌 Nuevo cliente conectado:', socket.id);

  socket.on('mensaje_nuevo', (data) => {
    console.log('📨 Mensaje recibido:', data);
    socket.broadcast.emit('mensaje_recibido', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

// -------------------- INICIAR SERVIDOR --------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor + Socket.IO corriendo en el puerto ${PORT}`);
});
