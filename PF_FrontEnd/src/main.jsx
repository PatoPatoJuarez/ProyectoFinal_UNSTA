import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import MainPage from './Pages/mainPage';
import PerfilRefugio from './Pages/perfilRefugio';
import PerfilAdoptante from './Pages/perfilAdoptante';
import 'bootstrap/dist/css/bootstrap.min.css';

import { SocketProvider } from './contexts/SocketContext';  // Importá el provider

createRoot(document.getElementById('root')).render(
    <SocketProvider>  {/* Aquí envolvés toda la app */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/perfilRefugio" element={<PerfilRefugio />} />
          <Route path="/perfilAdoptante" element={<PerfilAdoptante />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
);
