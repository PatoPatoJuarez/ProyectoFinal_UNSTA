const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
});

router.delete('/', authMiddleware, async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user.id });
    res.json({ message: 'Todas las notificaciones eliminadas' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar las notificaciones' });
  }
});

module.exports = router;