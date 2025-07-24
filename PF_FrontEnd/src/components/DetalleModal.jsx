import React, { useState } from 'react';

const DetalleModal = ({publicacion, onClose, userRole, onSolicitar }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSolicitar = () => {
    // Ejecutar la acción original
    onSolicitar();

    // Mostrar el modal de confirmación
    setShowConfirmModal(true);

    // Ocultar ambos modales después de 2 segundos
    setTimeout(() => {
      setShowConfirmModal(false);
      onClose(); // Cierra el modal principal también
    }, 2000);
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        onDoubleClick={onClose}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
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
              <p><strong>Refugio: </strong>{publicacion.nombreRefugio}</p>
              <p><strong>Descripción: </strong> {publicacion.descripcion || 'Sin descripción.'}</p>
              <p><strong>Tipo: </strong> {publicacion.tipoMascota}</p>
              <p><strong>Edad: </strong> {publicacion.edad}</p>
              <p><strong>Vacunado: </strong> {publicacion.vacunado}</p>
              <p><strong>Genero: </strong> {publicacion.genero}</p>
              <p><strong>Tamaño: </strong> {publicacion.tamanio}</p>
            </div>
            <div className="modal-footer">
              {userRole === 'adoptante' && (
                <button className="btn btn-primary" onClick={handleSolicitar}>
                  Solicitar Adopción
                </button>
              )}
              <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación momentáneo */}
      {showConfirmModal && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1060,
          }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div
              className="modal-content text-center p-4"
              style={{
                backgroundColor: '#424242', // Fondo verde suave (puede ser otro)
                color: 'orange',           // Texto verde oscuro
                border: '1px solid #badbcc',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              <p className="mb-0">✅ Solicitud enviada</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetalleModal;
