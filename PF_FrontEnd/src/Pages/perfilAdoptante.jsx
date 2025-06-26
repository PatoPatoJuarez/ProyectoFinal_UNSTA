import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import '../styles/perfilUsuario.css'; // Asegúrate de tener este archivo CSS

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
    <div className="perfil-container">
      <Header />

      <div className="container my-5 flex-grow-2">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Perfil Adoptante</h2>
          <button className="btn-1 mt-2 me-1" onClick={() => navigate('/main')}>
            ← Volver al Feed
          </button>
        </div>
        
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h4 className="card-title">{adoptante.nombre} {adoptante.apellido}</h4>
            <p><strong>Email:</strong> {adoptante.email}</p>
            <p><strong>Teléfono:</strong> {adoptante.telefono}</p>
            <p><strong>Localidad:</strong> {adoptante.localidad}</p>
            <p><strong>Experiencia con mascotas:</strong> {adoptante.experiencia || 'No especificado'}</p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Mis solicitudes</h4>
        </div>

        {solicitudes.length === 0 && <p>No has enviado solicitudes aún.</p>}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {solicitudes.map(solicitud => (
          <div className="col" key={solicitud._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{solicitud.publicacion?.titulo || 'Sin título'}</h5>
                <p><strong>Mensaje:</strong> {solicitud.mensaje || 'Sin mensaje'}</p>
                <p><strong>Estado:</strong> {solicitud.estado}</p>
                <p><strong>Fecha:</strong> {new Date(solicitud.fecha).toLocaleDateString()}</p>
              </div>
              {solicitud.estado === 'rechazada' && (
                <div className="card-footer d-flex justify-content-end">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleEliminarSolicitud(solicitud._id)}
                  >
                    🗑️ Eliminar solicitud
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PerfilAdoptante;
