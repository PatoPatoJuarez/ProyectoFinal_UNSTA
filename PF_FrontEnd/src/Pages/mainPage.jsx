import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DetalleModal from '../components/DetalleModal'; // Modal separado
import '../styles/mainPage.css';

const MainPage = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:3000/api/publicaciones')
      .then(response => {
        setPublicaciones(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar las publicaciones.');
        setLoading(false);
      });

    // Decodificar rol del token
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.rol);
      } catch (err) {
        console.error('Error al decodificar token:', err);
      }
    }
  }, []);

  const solicitarAdopcion = async (publicacionId) => {
    if (!token) {
      setMensaje('Debes estar autenticado para solicitar adopción.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/solicitudes', {
        publicacion: publicacionId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensaje('Solicitud enviada con éxito. ¡Gracias!');
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setMensaje('Hubo un error al enviar la solicitud.');
    }
  };

  const abrirModal = (publicacion) => {
    setPublicacionSeleccionada(publicacion);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setPublicacionSeleccionada(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100 mainpage-container">
      <Header />

      <main className="container py-5 flex-grow-1">
        <h1 className="text-center mb-5 display-5"><strong>🐾 Feed de Publicaciones de Refugios</strong></h1>

        {loading && <p className="text-center">Cargando publicaciones...</p>}
        {error && <p className="text-center text-danger">{error}</p>}
        {mensaje && <p className="text-center text-success">{mensaje}</p>}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {publicaciones.map(pub => (
            <div className="col" key={pub._id}>
              <div className="card h-100 mainpage-card shadow-sm">
                <img
                  src={pub.fotos?.[0] || 'https://via.placeholder.com/300x200?text=Sin+imagen'}
                  className="card-img-top mainpage-img"
                  alt={pub.titulo}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{pub.titulo}</h5>
                  <p className="card-text flex-grow-1">{pub.descripcion || 'Sin descripción.'}</p>
                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item"><strong>Tipo:</strong> {pub.tipoMascota || 'N/A'}</li>
                    <li className="list-group-item"><strong>Edad:</strong> {pub.edad || 'N/A'}</li>
                    <li className="list-group-item"><strong>Sexo:</strong> {pub.sexo || 'N/A'}</li>
                  </ul>
                  <button
                    className="btn btn-outline-secondary mt-auto"
                    type="button"
                    onClick={() => abrirModal(pub)}
                  >
                    Mostrar Más Información
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modalVisible && publicacionSeleccionada && (
        <DetalleModal
          publicacion={publicacionSeleccionada}
          onClose={cerrarModal}
          userRole={userRole}
          onSolicitar={() => solicitarAdopcion(publicacionSeleccionada._id)}
        />
      )}

      <Footer />
    </div>
  );
};

export default MainPage;
