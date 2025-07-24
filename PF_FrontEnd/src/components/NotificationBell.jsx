import React, { useState, useEffect } from 'react';

const NotificationBell = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Error al traer notificaciones');
        }
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    if(token) fetchNotifications();
  }, [token, BACKEND_URL]);

  const handleClick = async () => {
    setShowList(!showList);
    if (!showList && notifications.length > 0) {
      try {
        const res = await fetch(`${BACKEND_URL}/notifications`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Error al borrar notificaciones');
        }
        setNotifications([]);
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleClick} style={{ cursor: 'pointer' }}>
        🔔 {notifications.length > 0 && <span>({notifications.length})</span>}
      </button>

      {showList && (
        <div style={{
          border: '1px solid gray',
          padding: '1rem',
          position: 'absolute',
          right: 0,
          background: 'white',
          zIndex: 1000,
          width: '250px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {notifications.length === 0 ? (
            <p>No tienes notificaciones</p>
          ) : (
            notifications.map((n, idx) => (
              <p key={idx} style={{ margin: '0.5rem 0' }}>{n.message}</p>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
