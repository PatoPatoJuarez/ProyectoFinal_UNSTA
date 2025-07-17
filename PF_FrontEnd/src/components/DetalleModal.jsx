import React from 'react';

const DetalleModal = ({ publicacion, onClose, userRole, onSolicitar }) => {
  return (
    <div className="modal fade show d-block" tabIndex="-1" onDoubleClick={onClose} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div onDoubleClick={(e) => e.stopPropagation()} className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{publicacion.titulo}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <img
              src={publicacion.fotos?.[0] || 'https://via.placeholder.com/600x300?text=Sin+imagen'}
              alt="Foto del animal"
              className="img-fluid mb-3"
              style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
            />
            <p><strong>Descripción:</strong> {publicacion.descripcion || 'Sin descripción.'}</p>
            <p><strong>Tipo:</strong> {publicacion.tipoMascota}</p>
            <p><strong>Edad:</strong> {publicacion.edad}</p>
            <p><strong>Vacunado:</strong> {publicacion.vacunado}</p>
            <p><strong>Genero:</strong> {publicacion.genero}</p>
            <p><strong>Tamaño:</strong> {publicacion.tamanio}</p>
            {/* Podés agregar más campos si lo necesitás */}
          </div>
          <div className="modal-footer">
            {userRole === 'adoptante' && (
              <button className="btn btn-primary" onClick={onSolicitar}>
                Solicitar Adopción
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleModal;
