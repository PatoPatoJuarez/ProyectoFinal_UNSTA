import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import MainPage from './Pages/mainPage';
import PerfilRefugio from './Pages/perfilRefugio';
import PerfilAdoptante from './Pages/perfilAdoptante';
import RecuperarContraseña from './Pages/RecuperarContraseña';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/perfilRefugio" element={<PerfilRefugio />} />
      <Route path="/perfilAdoptante" element={<PerfilAdoptante />} />
      <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>
);
