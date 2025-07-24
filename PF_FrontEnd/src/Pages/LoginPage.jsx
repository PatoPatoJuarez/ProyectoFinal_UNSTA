import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Login.css';
import AuthModal from '../components/AuthModal';
import logo from '../assets/LogoHP.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistroAdoptante from './RegistroAdoptante';
import RegistroRefugio from './RegistroRefugio';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formType, setFormType] = useState(null);
  const [error, setError] = useState('');

  const backgroundImages = [
    'https://4kwallpapers.com/images/walls/thumbs_3t/1796.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/13251.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/13235.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/13248.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/9283.jpg',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email || '');
      setContrasena(location.state.contrasena || '');
    }
  }, [location.state]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'background-image 1s ease-in-out',
    minHeight: '100vh',
    width: '100%',
  };

  const handleModalSelection = (type) => {
    setFormType(type);
  };

  const handleBackToLogin = () => {
    setFormType(null);
  };

  const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    setError('Por favor, completá todos los campos.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError('El correo electrónico no tiene un formato válido.');
    return;
  }

  setError('');

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contrasena: password }), // IMPORTANTE: contrasena
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Error en login');
      return;
    }

    // Guardar token y usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario)); // IMPORTANTE: data.usuario

    window.location.href = '/main'; // o la ruta que uses después de login
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    setError('Error de conexión con el servidor.');
  }
  };
  
  const navigate = useNavigate();


  return (
    <div
      className="container-fluid login-page d-flex align-items-center justify-content-center position-relative"
      style={backgroundStyle}
    >
      {!formType && (
        <div className="card p-4 login-card cardMenulog">
          <div className="text-center">
            <img src={logo} alt="Logo" className="login-logo mb-3 MYPlogo" />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-group mb-3">
            <label>Email</label>
            <input 
              type="email"
              name="email"
              id="email" 
              className="form-control" 
              placeholder="example@email.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label>Contraseña</label>
            <input 
              type="password"
              name="password"
              id="password" 
              className="form-control"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button 
            className="btn btn-dark w-100 mb-2"
            onClick={handleLogin}
          >
            Ingresar
          </button>
          <button 
            className="btn btn-dark w-100 mb-2" 
            onClick={() => setFormType('modal')}
          >
            Crear Cuenta
          </button>
          <div className="text-center">
            <button
              className="recuperar-link small btn btn-link p-0"
              type="button"
              onClick={() => navigate('/recuperar-contraseña')}
              style={{ color: 'black', textDecoration: 'none' }}
            >
              Recuperar contraseña
            </button>
          </div>
        </div>
      )}

      {formType === 'modal' && (
        <AuthModal onSelect={handleModalSelection} onClose={handleBackToLogin} />
      )}

      {formType === 'adoptante' && (
        <div className="formulario-container">
          <RegistroAdoptante
            onRegistroExitoso={(email, contrasena) => {
              setEmail(email);
              setPassword(contrasena);
              setFormType(null); // volver al login
            }}
          />
          <button className="btn btn-secondary mt-3 botonVoler" onClick={handleBackToLogin}>Volver</button>
        </div>
      )}

      {formType === 'refugio' && (
        <div className="formulario-container">
          <RegistroRefugio
            onRegistroExitoso={(email, contrasena) => {
              setEmail(email);
              setPassword(contrasena);
              setFormType(null); // volver al login
            }}
          />
          <button className="btn btn-secondary mt-3 botonVoler" onClick={handleBackToLogin}>Volver</button>
        </div>
      )}
    </div>
  );
}