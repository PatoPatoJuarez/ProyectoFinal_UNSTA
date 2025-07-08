import React from 'react';
import '../styles/floatingChatButton.css';
import logorefugio from '../assets/LogoMYP2.png'

const FloatingChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="floating-chat-button"
      title="Centro de mensajes"
    >
      <img src={logorefugio} alt="icono refugio" style={{ width: '100px', height: '100px', objectFit: 'contain', marginRight: '1px' }} />
    </button>
  );
};

export default FloatingChatButton;
