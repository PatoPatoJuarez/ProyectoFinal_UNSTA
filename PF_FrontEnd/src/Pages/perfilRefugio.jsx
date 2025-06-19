import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CrearPublicacionModal from '../components/CrearPublicacionModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const PerfilRefugio = () => {
  const [refugio, setRefugio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);

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

  const handleEliminar = async (idPub) => {
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
      setSolicitudes(prev => prev.map(s => s._id === idSolicitud ? {...s, estado: nuevoEstado} : s));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('No se pudo actualizar el estado de la solicitud.');
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando perfil...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!refugio) return null;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container my-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Perfil del Refugio</h2>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/main')}>
            ← Volver al Feed
          </button>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title">{refugio.nombre}</h3>
            <p><strong>Email:</strong> {refugio.email}</p>
            <p><strong>Teléfono:</strong> {refugio.telefono}</p>
            <p><strong>Dirección:</strong> {refugio.direccion}</p>
            <p><strong>Localidad:</strong> {refugio.localidad}</p>
            <p><strong>Tipo de mascota que recibe:</strong> {refugio.tipoMascota}</p>
            <p><strong>Proceso de adopción:</strong> {refugio.procesoAdopcion}</p>
            <p><strong>Tarifa:</strong> {refugio.tarifa}</p>
            <p><strong>Seguimiento posterior:</strong> {refugio.seguimientoPosterior ? 'Sí' : 'No'}</p>
            <p><strong>Necesidades:</strong> {refugio.necesidades}</p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Mis publicaciones</h4>
          <button className="btn btn-success" onClick={() => setShowModal(true)}>
            + Nueva Publicación
          </button>
        </div>

        {publicaciones.length === 0 && <p>No hay publicaciones todavía.</p>}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mb-5">
          {publicaciones.map(pub => (
            <div className="col" key={pub._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={pub.fotos?.[0] || 'https://via.placeholder.com/300x200?text=Sin+imagen'}
                  className="card-img-top"
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
                    className="btn btn-outline-danger mt-2"
                    onClick={() => handleEliminar(pub._id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4>Solicitudes recibidas</h4>
          {loadingSolicitudes && <p>Cargando solicitudes...</p>}
          {!loadingSolicitudes && solicitudes.length === 0 && <p>No hay solicitudes aún.</p>}

          {!loadingSolicitudes && solicitudes.length > 0 && (
            <div className="list-group">
              {solicitudes.map(solicitud => (
                <div key={solicitud._id} className="list-group-item mb-3 shadow-sm">
                  <p><strong>Adoptante:</strong> {solicitud.adoptante?.nombre || 'N/D'} ({solicitud.adoptante?.email || 'sin email'})</p>
                  <p><strong>Publicación:</strong> {solicitud.publicacion?.titulo || 'N/D'}</p>
                  <p><strong>Mensaje:</strong> {solicitud.mensaje || '(Sin mensaje)'}</p>
                  <p><strong>Estado:</strong> <em>{solicitud.estado}</em></p>
                  {solicitud.estado === 'pendiente' && (
                    <div>
                      <button 
                        className="btn btn-success me-2" 
                        onClick={() => cambiarEstado(solicitud._id, 'aprobada')}
                      >
                        Aprobar
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => cambiarEstado(solicitud._id, 'rechazada')}
                      >
                        Rechazar
                      </button>
                    </div>
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
        handleClose={() => setShowModal(false)}
        onPublicacionCreada={() => {
          setShowModal(false);
          cargarPublicaciones();
        }}
      />
    </div>
  );
};

export default PerfilRefugio;
