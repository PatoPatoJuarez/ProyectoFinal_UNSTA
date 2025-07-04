const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/conversations', authMiddleware, chatController.createConversation);
router.get('/conversations', authMiddleware, chatController.getUserConversations);

router.post('/messages', authMiddleware, chatController.sendMessage);
router.get('/messages/:conversationId', authMiddleware, chatController.getMessages);

module.exports = router;
