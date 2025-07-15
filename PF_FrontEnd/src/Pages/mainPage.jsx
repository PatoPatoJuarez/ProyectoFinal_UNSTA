import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DetalleModal from '../components/DetalleModal'; // Modal separado
import FloatingChatButton from '../components/FloatingChatButton';
import ChatModal from '../components/ChatModal'; // Importamos el nuevo modal
import '../styles/mainPage.css';

const MainPage = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEdad, setFiltroEdad] = useState('');
  const [filtroSexo, setFiltroSexo] = useState('todos');


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

  // Extraer filtros únicos
  const tiposMascota = [...new Set(publicaciones.map(p => p.tipoMascota).filter(Boolean))];
  const edades = [...new Set(publicaciones.map(p => p.edad).filter(Boolean))];
  const sexos = [...new Set(publicaciones.map(p => p.sexo).filter(Boolean))];

  // Aplicar filtros
  const publicacionesFiltradas = publicaciones.filter(pub => {
    const tipoCoincide = filtroTipo === 'todos' || pub.tipoMascota === filtroTipo;
    const sexoCoincide = filtroSexo === 'todos' || pub.sexo === filtroSexo;

    let edadCoincide = true;
    if (filtroEdad.trim() !== '' && filtroEdad !== 'todos') {
      const edadPub = parseInt(pub.edad, 10);
      if (filtroEdad.includes('-')) {
        const [min, max] = filtroEdad.split('-').map(e => parseInt(e.trim(), 10));
        edadCoincide = !isNaN(min) && !isNaN(max) && edadPub >= min && edadPub <= max;
      } else {
        const edadFiltro = parseInt(filtroEdad, 10);
        edadCoincide = !isNaN(edadFiltro) && edadPub === edadFiltro;
      }
    }

    return tipoCoincide && edadCoincide && sexoCoincide;
  });


  return (
    <div className="d-flex flex-column min-vh-100 mainpage-container">
      <Header />

      <main className="container py-5 flex-grow-1">
        <div className="mainpage-title-bg">
          <h1
            className="text-center mb-0 display-5"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              fontSize: '3rem',
              fontWeight: 700,
              color: '#3c2e28',
              textShadow: '2px 2px 4px rgba(60, 46, 40, 0.88)',
              letterSpacing: '1px'
            }}
          >
            <strong>🐶 Feed de Publicaciones de Refugios 🐱</strong>
          </h1>
        </div>
        <div className="mainpage-flex">
          {/* Filtros */}
          <aside className="mainpage-filtros">
            <h5 className="mb-3">Filtros</h5>
            <div className="mb-3">
              <label className="form-label">Tipo</label>
              <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="form-select">
                <option value="todos">Todos los tipos</option>
                {tiposMascota.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Edad</label>
              <input type="text" className="form-control" placeholder="Ej: 3 o 2-5" value={filtroEdad} onChange={e => setFiltroEdad(e.target.value)}/>
            </div>
            <div className="mb-3">
              <label className="form-label">Sexo</label>
              <select value={filtroSexo} onChange={e => setFiltroSexo(e.target.value)} className="form-select">
                <option value="todos">Todos los sexos</option>
                {sexos.map(gen => (
                  <option key={gen} value={gen}>{gen}</option>
                ))}
              </select>
            </div>
          </aside>
          {/* Publicaciones */}
          <section className="mainpage-publicaciones flex-grow-1">
            {loading && <p className="text-center">Cargando publicaciones...</p>}
            {error && <p className="text-center text-danger">{error}</p>}
            {mensaje && <p className="text-center text-success">{mensaje}</p>}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
              {publicacionesFiltradas.map(pub => (
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
          </section>
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

      {/* Botón flotante para abrir el chat */}
      <FloatingChatButton onClick={() => setShowChat(true)} />

      {/* Modal de chat */}
      {showChat && <ChatModal token={token} onClose={() => setShowChat(false)} />}

      <Footer />
    </div>
  );
};

export default MainPage;
