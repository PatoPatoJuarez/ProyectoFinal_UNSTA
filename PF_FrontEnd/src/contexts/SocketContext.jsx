// src/contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');
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
  }, []);

  // Entregamos el socket SOLO cuando está conectado para evitar null en los consumidores
  return (
    <SocketContext.Provider value={socketConnected ? socketRef.current : null}>
      {children}
    </SocketContext.Provider>
  );
};
