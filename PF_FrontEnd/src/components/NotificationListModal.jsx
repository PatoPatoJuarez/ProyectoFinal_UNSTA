import { createPortal } from 'react-dom';

const NotificationListModal = ({ notifications, onClose, onDeleteAll }) => {
  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '40px',
        border: '1px solid gray',
        borderRadius: '8px',
        padding: '1rem',
        background: 'white',
        zIndex: 2147483647,
        width: '350px',
        maxHeight: '400px',
        overflowY: 'auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      {notifications.length === 0 ? (
        <p style={{ color: 'black', margin: 0 }}>No tienes notificaciones</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notifications.map((n, idx) => (
              <li
                key={n._id || idx}
                style={{
                  padding: '10px 0',
                  borderBottom: idx !== notifications.length - 1 ? '1px solid #ddd' : 'none',
                  color: 'black',
                }}
              >
                {n.message}
              </li>
            ))}
          </ul>
          <button
            onClick={onDeleteAll}
            style={{
              marginTop: '10px',
              width: '100%',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 0',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Borrar todas las notificaciones
          </button>
        </>
      )}
    </div>,
    document.body
  );
};

export default NotificationListModal;
