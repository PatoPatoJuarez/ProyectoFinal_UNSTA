const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');


// Crear conversación si no existe
exports.createConversation = async (req, res) => {
  const { adoptanteId, refugioId } = req.body;

  try {
    let conversation = await Conversation.findOne({ adoptanteId, refugioId });

    if (!conversation) {
      conversation = new Conversation({ adoptanteId, refugioId });
      await conversation.save();

      // Crear mensaje automático
      const message = new Message({
        conversationId: conversation._id,
        senderId: adoptanteId, // o refugioId, según quien inicie
        senderRole: 'adoptante', // o 'refugio', según corresponda
        text: 'Hola, estoy interesado en adoptar'
      });
      await message.save();

      conversation.lastMessage = message.text;
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (err) {
    console.error("Error en createConversation:", err);
    res.status(500).json({ message: 'Error al crear la conversación', error: err.message });
  }
};

// Traer conversaciones del usuario autenticado
exports.getUserConversations = async (req, res) => {
  const userId = req.user.id;

  try {
    const conversations = await Conversation.find({
      $or: [{ adoptanteId: userId }, { refugioId: userId }]
    })

    .populate('adoptanteId', 'nombre apellido')    // adoptante con nombre y apellido
    .populate('refugioId', 'nombreCompania')      // refugio con campo 'compania'
    .sort({ updatedAt: -1 });
    
    res.status(200).json(conversations);
  } catch (err) {
    console.error("Error en getUserConversations:", err);
    res.status(500).json({ message: 'Error al traer las conversaciones', error: err.message });
  }

};

// Enviar mensaje
exports.sendMessage = async (req, res) => {
  const { conversationId, text } = req.body;
  const senderId = req.user.id;
  const senderRole = req.user.rol;  // Obtener rol del usuario

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversación no encontrada' });
    }

    const adoptanteId = conversation.adoptanteId.toString();
    const refugioId = conversation.refugioId.toString();

    if (![adoptanteId, refugioId].includes(senderId)) {
      return res.status(403).json({ message: 'No tienes permiso para enviar mensajes en esta conversación' });
    }

    const message = new Message({ conversationId, senderId, senderRole, text });
    await message.save();

    conversation.lastMessage = text;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Determinar quién es el receptor
    const receptorId = (senderId === adoptanteId) ? refugioId : adoptanteId;
    await new Notification({ // Crear la notificación
      userId: receptorId,
      type: 'message',
      message: `Tienes un nuevo mensaje en una conversación sobre ${conversation.lastMessage}`
    }).save();

    res.status(200).json(message);
  } catch (err) {
    console.error("Error en sendMessage:", err);
    res.status(500).json({ message: 'Error al enviar el mensaje', error: err.message });
  }
};

// Obtener mensajes de una conversación
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id;

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversación no encontrada' });
    }

    const adoptanteId = conversation.adoptanteId.toString();
    const refugioId = conversation.refugioId.toString();

    if (![adoptanteId, refugioId].includes(userId)) {
      return res.status(403).json({ message: 'No tienes permiso para ver los mensajes de esta conversación' });
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error en getMessages:", err);
    res.status(500).json({ message: 'Error al obtener mensajes', error: err.message });
  }
};
