import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import api from '../axios'; // usa tu cliente axios

const NotificationBell = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Error al traer notificaciones:', err);
      }
    };

    if (token) fetchNotifications();
  }, [token]);

  useEffect(() => {
    document.body.style.overflow = showList ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showList]);

  const handleClick = () => {
    setShowList(!showList);
  };

  const handleDeleteOne = async (id) => {
    try {
      await api.delete(`/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error('Error al borrar la notificación:', err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await api.delete('/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications([]);
    } catch (err) {
      console.error('Error al borrar todas las notificaciones:', err);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '15px' }}>
      <button
        onClick={handleClick}
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
          <span
            style={{
              background: '#dc3545',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 7px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              lineHeight: 1,
              minWidth: '24px',
              textAlign: 'center',
              marginRight: '6px'
            }}
          >
            {notifications.length}
          </span>
        )}
        <FontAwesomeIcon icon={faBell} style={{ fontSize: '1.3rem' }} />
      </button>

      {showList && (
        <div style={{
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
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
                      color: 'black'
                    }}
                  >
                    {n.message}
                    <button
                      onClick={() => handleDeleteOne(n._id)}
                      style={{
                        marginLeft: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleDeleteAll}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 0',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Borrar todas las notificaciones
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
