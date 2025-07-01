import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CrearPublicacionModal from '../components/CrearPublicacionModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import '../styles/perfilUsuario.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PerfilRefugio = () => {
  const [refugio, setRefugio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [publicacionEditar, setPublicacionEditar] = useState(null);

  // Estado y carga de solicitudes
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    // Obtener datos del refugio
    axios.get('http://localhost:3000/api/refugios/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(({ data }) => {
        setRefugio(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al obtener datos del refugio');
        setLoading(false);
      });

    cargarPublicaciones();
    cargarSolicitudes();
  }, []);

  const cargarPublicaciones = () => {
    if (!token) return;
    axios.get('http://localhost:3000/api/publicaciones/mias', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(({ data }) => setPublicaciones(data))
      .catch(() => console.log('Error cargando publicaciones'));
  };

  const cargarSolicitudes = () => {
    if (!token) return;
    setLoadingSolicitudes(true);
    axios.get('http://localhost:3000/api/solicitudes/refugio', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(({ data }) => {
        setSolicitudes(data);
        setLoadingSolicitudes(false);
      })
      .catch((err) => {
        console.error('Error al obtener solicitudes:', err);
        setLoadingSolicitudes(false);
      });
  };

  const handleEliminarPublicacion = async (idPub) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/publicaciones/${idPub}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarPublicaciones();
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      alert('No se pudo eliminar la publicación');
    }
  };

  // Cambiar estado de la solicitud (aprobar o rechazar)
  const cambiarEstado = async (idSolicitud, nuevoEstado) => {
    try {
      await axios.patch(`http://localhost:3000/api/solicitudes/${idSolicitud}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSolicitudes(prev => prev.map(s => s._id === idSolicitud ? { ...s, estado: nuevoEstado } : s));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('No se pudo actualizar el estado de la solicitud.');
    }
  };

  // Eliminar solicitud (solo si estado es 'rechazada')
  const handleEliminarSolicitud = async (idSolicitud) => {
    if (!window.confirm('¿Eliminar esta solicitud?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/solicitudes/${idSolicitud}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(prev => prev.filter(s => s._id !== idSolicitud));
    } catch (error) {
      console.error('Error al eliminar solicitud:', error);
      alert('No se pudo eliminar la solicitud');
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando perfil...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!refugio) return null;

  return (
    <div className="perfil-container">
      <Header />
      <div className="container my-5 flex-grow-2">
        {/* Título con ícono */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary fw-bold">
            <i className="bi bi-house-heart-fill me-2" /> Perfil del Refugio
          </h2>
          <button className="btn-1 mt-2 me-1" onClick={() => navigate('/main')}>
            <i className="bi bi-arrow-left me-1" /> Volver al Feed
          </button>
        </div>

        {/* Card de perfil con íconos */}
        <div className="card shadow-sm mb-4 rounded-4 card-hover">
          <div className="card-body">
            <h3 className="card-title mb-3">
              <i className="bi bi-person-fill me-2" /> {refugio.nombre}
            </h3>
            <ul className="list-group list-group-flush perfil-lista-datos mb-0">
              <li className="list-group-item">
                <i className="bi bi-envelope-fill me-2" /><strong>Email:</strong> {refugio.email}
              </li>
              <li className="list-group-item">
                <i className="bi bi-telephone-fill me-2" /><strong>Teléfono:</strong> {refugio.telefono}
              </li>
              <li className="list-group-item">
                <i className="bi bi-geo-alt-fill me-2" /><strong>Dirección:</strong> {refugio.direccion}
              </li>
              <li className="list-group-item">
                <i className="bi bi-geo-fill me-2" /><strong>Localidad:</strong> {refugio.localidad}
              </li>
              <li className="list-group-item">
                <i className="bi bi-paw-fill me-2" /><strong>Tipo de mascota que recibe:</strong> {refugio.tipoMascota}
              </li>
              <li className="list-group-item">
                <i className="bi bi-journal-check me-2" /><strong>Proceso de adopción:</strong> {refugio.procesoAdopcion}
              </li>
              <li className="list-group-item">
                <i className="bi bi-cash-coin me-2" /><strong>Tarifa:</strong> {refugio.tarifaAdopcion}
              </li>
              <li className="list-group-item">
                <i className="bi bi-clipboard-check me-2" /><strong>Seguimiento posterior:</strong> {refugio.seguimientoAdopcion === 'Sí' ? 'Sí' : 'No'}
              </li>
              <li className="list-group-item">
                <i className="bi bi-exclamation-circle-fill me-2" /><strong>Necesidades:</strong> {refugio.necesidadesRefugio}
              </li>
            </ul>
          </div>
        </div> 

        {/* Título publicaciones con ícono */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-secondary">
            <i className="bi bi-megaphone-fill me-2" /> Mis publicaciones
          </h4>
          <button className="btn-2 mb-3 me-1" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-1" /> Nueva Publicación
          </button>
        </div>

        {publicaciones.length === 0 && <p>No hay publicaciones todavía.</p>}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mb-5">
          {publicaciones.map(pub => (
            <div className="col" key={pub._id}>
              <div className="card h-100 shadow-sm rounded-4 card-hover">
                <img
                  src={pub.fotos?.[0] || 'https://via.placeholder.com/300x200?text=Sin+imagen'}
                  className="card-img-top rounded-top-4"
                  alt={pub.titulo}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{pub.titulo}</h5>
                  <p className="card-text flex-grow-1">{pub.descripcion || 'Sin descripción.'}</p>
                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item"><strong>Tipo:</strong> {pub.tipoMascota}</li>
                    <li className="list-group-item"><strong>Edad:</strong> {pub.edad}</li>
                    <li className="list-group-item"><strong>Tamaño:</strong> {pub.tamaño}</li>
                  </ul>
                  <button
                    className="btn btn-outline-primary mt-2 me-2"
                    onClick={() => {
                      setPublicacionEditar(pub);
                      setShowModal(true);
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-outline-danger mt-2"
                    onClick={() => handleEliminarPublicacion(pub._id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="mb-5 text-secondary">
            <i className="bi bi-inbox-fill me-2" /> Solicitudes recibidas
          </h4>
          {loadingSolicitudes && <p>Cargando solicitudes...</p>}
          {!loadingSolicitudes && solicitudes.length === 0 && <p>No hay solicitudes aún.</p>}

          {!loadingSolicitudes && solicitudes.length > 0 && (
            <div className="list-group">
              {solicitudes.map(solicitud => (
                <div
                  key={solicitud._id}
                  className="list-group-item mb-3 shadow-sm rounded-4 card-hover"
                  style={{ border: 'none' }}
                >
                  <p>
                    <i className="bi bi-person-circle me-2" />
                    <strong>Adoptante:</strong> {solicitud.adoptante?.nombre || 'N/D'} ({solicitud.adoptante?.email || 'sin email'})
                  </p>
                  <p>
                    <i className="bi bi-megaphone-fill me-2" />
                    <strong>Publicación:</strong> {solicitud.publicacion?.titulo || 'N/D'}
                  </p>
                  <p>
                    <i className="bi bi-chat-left-text me-2" />
                    <strong>Mensaje:</strong> {solicitud.mensaje || '(Sin mensaje)'}
                  </p>
                  <p>
                    <i className="bi bi-info-circle-fill me-2" />
                    <strong>Estado:</strong>
                    <span className={`ms-2 badge ${
                      solicitud.estado === 'aprobada'
                        ? 'bg-success'
                        : solicitud.estado === 'rechazada'
                        ? 'bg-danger'
                        : 'bg-secondary'
                    }`}>
                      {solicitud.estado}
                    </span>
                  </p>
                  {solicitud.estado === 'pendiente' && (
                    <div>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => cambiarEstado(solicitud._id, 'aprobada')}
                      >
                        <i className="bi bi-check-circle me-1" /> Aprobar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => cambiarEstado(solicitud._id, 'rechazada')}
                      >
                        <i className="bi bi-x-circle me-1" /> Rechazar
                      </button>
                    </div>
                  )}
                  {solicitud.estado === 'rechazada' && (
                    <button
                      className="btn btn-outline-danger mt-2"
                      onClick={() => handleEliminarSolicitud(solicitud._id)}
                    >
                      <i className="bi bi-trash-fill me-1" /> Eliminar solicitud
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      <CrearPublicacionModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setPublicacionEditar(null);
        }}
        onPublicacionCreada={() => {
          setShowModal(false);
          setPublicacionEditar(null);
          cargarPublicaciones();
        }}
        publicacionEditar={publicacionEditar}
      />
    </div>
  );
};

export default PerfilRefugio;
