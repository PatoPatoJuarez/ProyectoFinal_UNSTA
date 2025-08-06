import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import NotificationListModal from './NotificationListModal';

const NotificationBell = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al traer notificaciones');
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    if (token) fetchNotifications();
  }, [token]);

  useEffect(() => {
    document.body.style.overflow = showList ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showList]);

  const handleDeleteAll = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/notifications`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al borrar todas las notificaciones');
      setNotifications([]);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '15px' }}>
      <button
        onClick={() => setShowList(!showList)}
        style={{
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: 0,
          minWidth: '32px',
          minHeight: '32px'
        }}
        title="Notificaciones"
      >
        {notifications.length > 0 && (
          <span style={{
            background: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 7px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            lineHeight: 1,
            minWidth: '24px',
            textAlign: 'center',
            marginRight: '6px',
            position: 'static'
          }}>
            {notifications.length}
          </span>
        )}
        <FontAwesomeIcon icon={faBell} style={{ fontSize: '1.3rem' }} />
      </button>

      {showList && (
        <NotificationListModal
          notifications={notifications}
          onDeleteAll={handleDeleteAll}
        />
      )}
    </div>
  );
};

export default NotificationBell;
