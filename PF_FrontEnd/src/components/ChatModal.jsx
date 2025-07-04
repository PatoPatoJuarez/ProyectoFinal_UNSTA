// src/components/ChatModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/chatModal.css';

const ChatModal = ({ token, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Decodificar rol del token
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.rol);
      } catch (err) {
        console.error('Error al decodificar token:', err);
      }
    }
  }, [token]);

  // Cargar conversaciones al montar
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/chat/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(res.data);
        setLoadingConvs(false);
      } catch (err) {
        setError('Error cargando conversaciones');
        setLoadingConvs(false);
      }
    };
    fetchConversations();
  }, [token]);

  // Cargar mensajes cuando cambie conversación seleccionada
  useEffect(() => {
    if (!selectedConv) return;

    const fetchMessages = async () => {
      setLoadingMsgs(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/chat/messages/${selectedConv._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
        setLoadingMsgs(false);
      } catch (err) {
        setError('Error cargando mensajes');
        setLoadingMsgs(false);
      }
    };

    fetchMessages();
  }, [selectedConv, token]);

  // Enviar mensaje nuevo
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedConv) return;

    try {
      const res = await axios.post('http://localhost:3000/api/chat/messages', {
        conversationId: selectedConv._id,
        text: newMessage.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      setError('Error enviando mensaje');
    }
  };

  // Obtener texto dinámico para el título de cada conversación
const getConversationTitle = (conv) => {
  if (userRole === 'adoptante') {
    // Mostrar nombreCompania del refugio para adoptante
    return `Con Refugio: ${conv.refugioId?.nombreCompania || 'Sin nombre'}`;
  } else if (userRole === 'refugio') {
    // Mostrar nombre y apellido del adoptante para refugio
    const nombreAdoptante = conv.adoptanteId?.nombre || '';
    const apellidoAdoptante = conv.adoptanteId?.apellido || '';
    return `Con Adoptante: ${nombreAdoptante} ${apellidoAdoptante}`.trim() || 'Sin nombre';
  }
  return 'Conversación';
};

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-container">

        <button className="chat-close-btn" onClick={onClose}>×</button>

        <div className="chat-sidebar">
          <h5>Conversaciones</h5>
          {loadingConvs && <p>Cargando...</p>}
          {conversations.length === 0 && !loadingConvs && <p>No hay conversaciones.</p>}
          <ul className="chat-conv-list">
            {conversations.map(conv => (
              <li
                key={conv._id}
                className={selectedConv?._id === conv._id ? 'selected' : ''}
                onClick={() => setSelectedConv(conv)}
              >
                <p>{getConversationTitle(conv)}</p>
                <small>{conv.lastMessage || 'Sin mensajes aún'}</small>
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-content">
          {!selectedConv ? (
            <p>Selecciona una conversación para ver mensajes</p>
          ) : (
            <>
              <h6 className="chat-conv-title">{getConversationTitle(selectedConv)}</h6>
              <div className="chat-messages">
                {loadingMsgs && <p>Cargando mensajes...</p>}
                {messages.length === 0 && !loadingMsgs && <p>No hay mensajes aún.</p>}
                {messages.map(msg => (
                  <div key={msg._id} className={`chat-message ${msg.senderId === selectedConv.adoptanteId?._id ? 'sent' : 'received'}`}>
                    <p>{msg.text}</p>
                    <small>{new Date(msg.createdAt).toLocaleString()}</small>
                  </div>
                ))}
              </div>

              <div className="chat-input-container">
                <input
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                />
                <button onClick={handleSendMessage}>Enviar</button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChatModal;
