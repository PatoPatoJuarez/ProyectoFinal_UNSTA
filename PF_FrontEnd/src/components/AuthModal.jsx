import React from 'react';
import '../styles/AuthModal.css';

export default function AuthModal({ onSelect, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="auth-modal">
        <h2>¿Qué tipo de cuenta querés crear?</h2>
        <div className="button-group">
          <button className="btn-adoptante" onClick={() => onSelect('adoptante')}>
            Adoptante
          </button>
          <button className="btn-refugio" onClick={() => onSelect('refugio')}>
            Refugio
          </button>
          <button className="btn-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
