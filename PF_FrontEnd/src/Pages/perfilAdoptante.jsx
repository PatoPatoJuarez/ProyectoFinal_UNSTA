import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/perfilAdoptante.css';      // ⬅️ la hoja que te adjunto abajo


const PerfilAdoptante = () => {
  const [adoptante, setAdoptante] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    // Cargar perfil
    axios.get('http://localhost:3000/api/adoptantes/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAdoptante(res.data))
      .catch(() => setError('Error al cargar el perfil'));

    // Cargar solicitudes
    axios.get('http://localhost:3000/api/solicitudes/mias', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSolicitudes(res.data))
      .catch(() => console.log('Error al cargar solicitudes'))
      .finally(() => setLoading(false));
  }, []);

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
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!adoptante) return null;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />

      <div className="container my-5">

        {/* ======= PERFIL ======= */}
        <h2 className="mb-4 text-primary fw-bold">
          <i className="bi bi-person-circle me-2" />Mi perfil
        </h2>

        <div className="card shadow rounded-4 mb-5 fade-in">
          <div className="card-body py-4">
            <h4 className="card-title mb-3">
              <i className="bi bi-person-fill me-2" />
              {adoptante.nombre} {adoptante.apellido}
            </h4>

            <p><i className="bi bi-envelope-fill me-2" /><strong>Email:</strong> {adoptante.email}</p>
            <p><i className="bi bi-telephone-fill me-2" /><strong>Teléfono:</strong> {adoptante.telefono}</p>
            <p><i className="bi bi-geo-alt-fill me-2" /><strong>Localidad:</strong> {adoptante.localidad}</p>
            <p><i className="bi bi-paw-fill me-2" /><strong>Experiencia con mascotas:</strong> {adoptante.experiencia || 'No especificado'}</p>
          </div>
        </div>

        {/* ======= SOLICITUDES ======= */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-primary fw-bold">
            <i className="bi bi-chat-square-heart-fill me-2" />Mis solicitudes
          </h4>
        </div>

        {solicitudes.length === 0 && (
          <p className="text-muted">No has enviado solicitudes aún.</p>
        )}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {solicitudes.map(solicitud => (
            <div className="col fade-in" key={solicitud._id}>
              <div className="card h-100 shadow-sm rounded-4 card-hover bg-white">

                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-patch-question-fill me-2" />
                    {solicitud.publicacion?.titulo || 'Sin título'}
                  </h5>

                  <p><strong>Mensaje:</strong> {solicitud.mensaje || 'Sin mensaje'}</p>

                  <p className="d-flex align-items-center">
                    <strong className="me-1">Estado:</strong>
                    <span className={`badge ${solicitud.estado === 'aprobada' ? 'bg-success' :
                        solicitud.estado === 'rechazada' ? 'bg-danger' : 'bg-secondary'
                      } d-inline-flex align-items-center`}>
                      <i className={`bi me-1 ${solicitud.estado === 'aprobada' ? 'bi-check-circle-fill' :
                          solicitud.estado === 'rechazada' ? 'bi-x-circle-fill' : 'bi-hourglass-split'
                        }`} />
                      {solicitud.estado}
                    </span>
                  </p>

                  <p><i className="bi bi-calendar-date-fill me-2" /><strong>Fecha:</strong> {new Date(solicitud.fecha).toLocaleDateString()}</p>
                </div>

                {solicitud.estado === 'rechazada' && (
                  <div className="card-footer d-flex justify-content-end bg-light border-top-0">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleEliminarSolicitud(solicitud._id)}
                    >
                      <i className="bi bi-trash3 me-1" />Eliminar solicitud
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ======= BOTÓN VOLVER ======= */}
        <div className="text-center mt-5">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate('/main')}
          >
            <i className="bi bi-arrow-left me-2" />Volver al feed
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PerfilAdoptante;