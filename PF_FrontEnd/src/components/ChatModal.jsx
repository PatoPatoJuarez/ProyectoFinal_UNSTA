import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/chatModal.css';
import EmojiPicker from 'emoji-picker-react';
import { FaPaperPlane } from 'react-icons/fa';
import { useSocket } from '../contexts/SocketContext';

const ChatModal = ({ token, onClose }) => {
  const socket = useSocket();

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const textareaRef = useRef(null);
  const lastMessageRef = useRef(null);

  const isMobile = window.innerWidth < 768;
  const [showChatContent, setShowChatContent] = useState(false);


  // Decodificar rol del token localmente
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

  // Cargar conversaciones desde backend local
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

  // Cargar mensajes según conversación seleccionada
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

  // Auto ajustar textarea altura
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [newMessage]);

  // Scroll automático al último mensaje
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Escuchar mensajes entrantes por socket
  useEffect(() => {
    if (!socket) return;

    const handleMensajeRecibido = (msg) => {
      if (msg.conversationId === selectedConv?._id) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on('mensaje_recibido', handleMensajeRecibido);

    return () => {
      socket.off('mensaje_recibido', handleMensajeRecibido);
    };
  }, [socket, selectedConv]);

  // Enviar mensaje al backend y emitir socket
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedConv) return;

    try {
      const res = await axios.post('http://localhost:3000/api/chat/messages', {
        conversationId: selectedConv._id,
        text: newMessage.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualizar mensajes localmente con respuesta del backend
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');

      // Emitir mensaje por socket para que otros clientes se actualicen
      if (socket) {
        socket.emit('mensaje_nuevo', res.data);
      }
    } catch (err) {
      setError('Error enviando mensaje');
    }
  };

  const getConversationTitle = (conv) => {
    if (userRole === 'adoptante') {
      return `Con Refugio: ${conv.refugioId?.nombreCompania || 'Sin nombre'}`;
    } else if (userRole === 'refugio') {
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

        {/* Mostrar SOLO el sidebar en móvil si no está viendo un chat */}
        {(!isMobile || !showChatContent) && (
          <div className="chat-sidebar">
            <h5>Conversaciones</h5>
            {loadingConvs && <p>Cargando...</p>}
            {conversations.length === 0 && !loadingConvs && <p>No hay conversaciones.</p>}
            <ul className="chat-conv-list">
              {conversations.map(conv => (
                <li
                  key={conv._id}
                  className={selectedConv?._id === conv._id ? 'selected' : ''}
                  onClick={() => {
                    setSelectedConv(conv);
                    if (isMobile) setShowChatContent(true);
                  }}
                >
                  <p>{getConversationTitle(conv)}</p>
                  <small>{conv.lastMessage || 'Sin mensajes aún'}</small>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mostrar SOLO el contenido en móvil si seleccionó una conversación */}
        {(!isMobile || showChatContent) && (
          <div className="chat-content">
            {!selectedConv ? (
              <p>Selecciona una conversación para ver mensajes</p>
            ) : (
              <>
                {isMobile && (
                  <button
                    className="btn btn-link volver-btn"
                    onClick={() => setShowChatContent(false)}
                  >
                    ← Conversaciones
                  </button>
                )}

                <h6 className="chat-conv-title">{getConversationTitle(selectedConv)}</h6>

                <div className="chat-messages">
                  {loadingMsgs && <p>Cargando mensajes...</p>}
                  {messages.length === 0 && !loadingMsgs && <p>No hay mensajes aún.</p>}
                  {messages.map((msg, idx) => (
                    <div
                      key={msg._id}
                      ref={idx === messages.length - 1 ? lastMessageRef : null}
                      className={`chat-message ${
                        msg.senderId === selectedConv.adoptanteId?._id ? 'sent' : 'received'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <small>{new Date(msg.createdAt).toLocaleString()}</small>
                    </div>
                  ))}
                </div>

                <form
                  className="chat-input-container"
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  style={{ marginTop: 0 }}
                >
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setShowEmoji(v => !v)}
                      className="emoji-btn"
                      style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                      tabIndex={-1}
                    >
                      😊
                    </button>
                    {showEmoji && (
                      <div style={{ position: 'absolute', bottom: '40px', left: 0, zIndex: 10 }}>
                        <EmojiPicker
                          onEmojiClick={emoji => {
                            setNewMessage(prev => prev + emoji.emoji);
                            setShowEmoji(false);
                          }}
                          height={300}
                          width={500}
                        />
                      </div>
                    )}
                  </div>
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder="Escribe tu mensaje..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="chat-textarea"
                  />
                  <button
                    type="submit"
                    style={{ background: 'none', border: 'none', color: '#007bff', fontSize: '1.5rem', padding: '0 10px' }}
                  >
                    <FaPaperPlane />
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatModal;
