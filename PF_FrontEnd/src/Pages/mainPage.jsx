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
  const [showModalFiltros, setShowModalFiltros] = useState(false);


  // Filtros
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEdad, setFiltroEdad] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('todos');
  const [filtroVacunado, setFiltroVacunado] = useState('todos');
  const [filtroTamanio, setFiltroTamanio] = useState('todos');



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
  const generos = [...new Set(publicaciones.map(p => p.genero).filter(Boolean))];
  const vacunados = [...new Set(publicaciones.map(p => p.vacunado).filter(Boolean))];
  const tamanios = [...new Set(publicaciones.map(p => p.tamanio).filter(Boolean))];


  // Aplicar filtros
  const publicacionesFiltradas = publicaciones.filter(pub => {
  const tipoCoincide = filtroTipo === 'todos' || pub.tipoMascota === filtroTipo;
  const generoCoincide = filtroGenero === 'todos' || pub.genero === filtroGenero;
  const vacunadoCoincide = filtroVacunado === 'todos' || pub.vacunado === filtroVacunado;
  const tamanioCoincide = filtroTamanio === 'todos' || pub.tamanio === filtroTamanio; // Se agrega el filtro de tamaño

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

  return tipoCoincide && edadCoincide && generoCoincide && vacunadoCoincide && tamanioCoincide; // Añadido tamanioCoincide
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
        <div className="mainpage-flex d-flex">
          {/* Filtros */}
          <aside className="mainpage-filtros d-none d-md-block">
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
              <label className="form-label">Vacunado</label>
              <select value={filtroVacunado} onChange={e => setFiltroVacunado(e.target.value)} className="form-select">
                <option value="todos">esta vacunado</option>
                {vacunados.map(vac => (
                  <option key={vac} value={vac}>
                    {vac.charAt(0).toUpperCase() + vac.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Genero</label>
              <select value={filtroGenero} onChange={e => setFiltroGenero(e.target.value)} className="form-select">
                <option value="todos">todos</option>
                {generos.map(gen => (
                  <option key={gen} value={gen}>
                    {gen.charAt(0).toUpperCase() + gen.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Tamaño</label>
              <select value={filtroTamanio} onChange={e => setFiltroTamanio(e.target.value)} className="form-select">
                <option value="todos">todos</option>
                {tamanios.map(tam => (
                  <option key={tam} value={tam}>
                    {tam.charAt(0).toUpperCase() + tam.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </aside>
          
          {/* Publicaciones */}
          <section className="mainpage-publicaciones flex-grow-1">
            {loading && <p className="text-center">Cargando publicaciones...</p>}
            {error && <p className="text-center text-danger">{error}</p>}
            {mensaje && <p className="text-center text-success">{mensaje}</p>}
            {/* BOTÓN solo visible en pantallas pequeñas */}
            <div className="d-md-none text-center mb-3">
              <button className="btn btn-secondary" onClick={() => setShowModalFiltros(true)}>
                Mostrar Filtros
              </button>
            </div>
          
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
                        <li className="list-group-item"><strong><b>Refugio: </b></strong> {pub.nombreRefugio || 'N/A'}</li>
                        <li className="list-group-item"><strong>Tipo: </strong> {pub.tipoMascota || 'N/A'}</li>
                        <li className="list-group-item"><strong>Edad: </strong> {pub.edad || 'N/A'}</li>
                        <li className="list-group-item"><strong>Vacunado: </strong> {pub.vacunado || 'N/A'}</li>
                        <li className="list-group-item"><strong>Genero: </strong> {pub.genero || 'N/A'}</li>
                        <li className="list-group-item"><strong>Tamaño: </strong> {pub.tamanio || 'N/A'}</li>
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
          {showModalFiltros && (
            <div
              className="modal d-block"
              tabIndex="-1"
              role="dialog"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              onClick={() => setShowModalFiltros(false)}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Filtros</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModalFiltros(false)}></button>
                  </div>
                  <div className="modal-body">
                    {/* Tus filtros reutilizados */}
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
                      <input type="text" className="form-control" placeholder="Ej: 3 o 2-5" value={filtroEdad} onChange={e => setFiltroEdad(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Vacunado</label>
                      <select value={filtroVacunado} onChange={e => setFiltroVacunado(e.target.value)} className="form-select">
                        <option value="todos">esta vacunado</option>
                        {vacunados.map(vac => (
                          <option key={vac} value={vac}>
                            {vac.charAt(0).toUpperCase() + vac.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Género</label>
                      <select value={filtroGenero} onChange={e => setFiltroGenero(e.target.value)} className="form-select">
                        <option value="todos">Todos los géneros</option>
                        {generos.map(gen => (
                          <option key={gen} value={gen}>{gen}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Tamaño</label>
                      <select value={filtroTamanio} onChange={e => setFiltroTamanio(e.target.value)} className="form-select">
                        <option value="todos">Todos los tamaños</option>
                        {tamanios.map(tam => (
                          <option key={tam} value={tam}>{tam}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
