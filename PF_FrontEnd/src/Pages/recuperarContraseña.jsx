import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import logo from '../assets/logoH&P.png';
import '../styles/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecuperarContraseña = () => {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [codigo, setCodigo] = useState('');
    const [codigoError, setCodigoError] = useState('');
    const [mostrarCambioPass, setMostrarCambioPass] = useState(false);
    const [nuevaPass, setNuevaPass] = useState('');
    const [confirmarPass, setConfirmarPass] = useState('');
    const [passError, setPassError] = useState('');
    const navigate = useNavigate();

    const backgroundImages = [
    'https://4kwallpapers.com/images/walls/thumbs_3t/1796.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/13251.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/13235.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/13248.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/9283.jpg',
    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!email.trim()) {
        setError('Por favor, ingresa tu email.');
        return;
    }

    // Aquí iría la petición real al backend
    setShowModal(true); // Mostrar modal para ingresar código
    };

    const handleCodigoSubmit = (e) => {
    e.preventDefault();
    setCodigoError('');
    if (!codigo.trim()) {
        setCodigoError('Por favor, ingresa el código de seguridad.');
        return;
    }
    // Aquí puedes validar el código con el backend
    setShowModal(false);
    setMensaje('');
    setMostrarCambioPass(true); // Mostrar formulario de cambio de contraseña
    };

    const handleCambiarPass = (e) => {
    e.preventDefault();
    setPassError('');
    if (!nuevaPass || !confirmarPass) {
        setPassError('Por favor, completa ambos campos.');
        return;
    }
    if (nuevaPass !== confirmarPass) {
        setPassError('Las contraseñas no coinciden.');
        return;
    }
    // Aquí iría la petición real al backend para cambiar la contraseña
    setMensaje('¡Contraseña cambiada exitosamente!');
    setMostrarCambioPass(false);
    };


    return (
    <div className="container-fluid login-page d-flex align-items-center justify-content-center position-relative"
        style={backgroundStyle}
    >
        <div className="card p-4 login-card cardMenulog" style={{ maxWidth: 400, width: '100%' }}>
            <h2 className="mb-4 text-center">Recuperar Contraseña</h2>
            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!mostrarCambioPass ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="example@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <h6 className="text-muted mb-3">
                        Ingresa tu email para recibir un código de seguridad.
                    </h6>
                    <button type="submit" className="btn btn-dark w-100 mb-2">
                        Ingresar codigo de seguridad
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary w-100"
                        onClick={() => navigate('/')}
                    >
                        Volver al login
                    </button>
                </form>
            ) : (
                <form onSubmit={handleCambiarPass}>
                    <div className="form-group mb-3">
                        <label>Nueva contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={nuevaPass}
                            onChange={e => setNuevaPass(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Confirmar contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmarPass}
                            onChange={e => setConfirmarPass(e.target.value)}
                            required
                        />
                    </div>
                    {passError && <div className="alert alert-danger">{passError}</div>}
                    <button type="submit" className="btn btn-dark w-100 mb-2">
                        Cambiar contraseña
                    </button>
                </form>
            )}
        </div>
        {/* Modal para ingresar código de seguridad */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Ingresa el código de seguridad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleCodigoSubmit}>
                    <div className="form-group mb-3">
                        <label>Código de seguridad</label>
                        <input
                            type="text"
                            className="form-control"
                            value={codigo}
                            onChange={e => setCodigo(e.target.value)}
                            required
                        />
                    </div>
                    {codigoError && <div className="alert alert-danger">{codigoError}</div>}
                    <Button variant="dark" type="submit" className="w-100">
                        Confirmar código
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    </div>
    );
};

export default RecuperarContraseña;