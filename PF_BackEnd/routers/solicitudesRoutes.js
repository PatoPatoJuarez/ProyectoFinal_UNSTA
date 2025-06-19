// routes/solicitudesRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerSolicitudesDelAdoptante } = require('../controllers/solicitudesController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/mias', authMiddleware, obtenerSolicitudesDelAdoptante);

module.exports = router;
