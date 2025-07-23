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
      💬
    </button>
  );
};

export default FloatingChatButton;
