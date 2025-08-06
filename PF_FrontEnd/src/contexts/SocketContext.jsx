// src/contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Definimos la URL base para Socket.IO sacando el '/api' si está
  const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace('/api', '');

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 Socket conectado globalmente');
      setSocketConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Socket desconectado globalmente');
      setSocketConnected(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [SOCKET_URL]);

  // Solo entregamos el socket cuando está conectado para evitar null
  return (
    <SocketContext.Provider value={socketConnected ? socketRef.current : null}>
      {children}
    </SocketContext.Provider>
  );
};
