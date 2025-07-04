const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  adoptanteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Adoptante', required: true },
  refugioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Refugio', required: true },
  lastMessage: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
