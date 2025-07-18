import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import MainPage from './Pages/mainPage';
import PerfilRefugio from './Pages/perfilRefugio';
import PerfilAdoptante from './Pages/perfilAdoptante';
import RegistroAdop from './Pages/RegistroAdoptante';
import 'bootstrap/dist/css/bootstrap.min.css';

import { SocketProvider } from './contexts/SocketContext';

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/perfilRefugio" element={<PerfilRefugio />} />
        <Route path="/perfilAdoptante" element={<PerfilAdoptante />} />
        <Route path="/registro" element={<RegistroAdop />} />
      </Routes>
    </BrowserRouter>
  </SocketProvider>
);
