import React, { useEffect, useState } from 'react';
import api from '../axios';
import CrearPublicacionModal from '../components/CrearPublicacionModal';
import ModalEditarPerfil from '../components/ModalEditarPerfil';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import '../styles/perfilUsuario.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

const PerfilRefugio = () => {
  const [refugio, setRefugio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [publicacionEditar, setPublicacionEditar] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

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
    api.get('/refugios/me', {
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

  const localidades = [
    'San Miguel de Tucuman',
    'Yerba Buena',
    'Concepcion',
    'Banda del Rio Sali',
    'Lules',
    'Tafi del Valle'
  ];

  const camposRefugio = [
    { name: "nombreCompania", label: "Nombre del refugio" },
    { name: "nombre", label: "Nombre responsable" },
    { name: "apellido", label: "Apellido responsable" },
    { name: "email", label: "Email", type: "email" },
    { name: "telefono", label: "Teléfono" },
    { name: "direccion", label: "Dirección" },
    {
      name: "localidad",
      label: "Localidad",
      type: "select",
      options: [
        { value: "", label: "Seleccione una localidad" },
        ...localidades.map(loc => ({ value: loc, label: loc }))
      ]
    },
    {
      name: "tipoMascota",
      label: "Tipo de mascota que recibe",
      type: "multiselect",
      options: [
        { value: "perro", label: "Perro" },
        { value: "gato", label: "Gato" },
        { value: "ambos", label: "Ambos" }
      ]
    },
    { name: "procesoAdopcion", label: "Proceso de adopción", type: "textarea" },
    { name: "tarifaAdopcion", label: "Tarifa" },
    {
      name: "seguimientoAdopcion",
      label: "Seguimiento posterior",
      type: "select",
      options: [
        { value: "", label: "No especificado" },
        { value: "Sí", label: "Sí" },
        { value: "No", label: "No" }
      ]
    },
    { name: "necesidadesRefugio", label: "Necesidades", type: "textarea" }
  ];

  const cargarPublicaciones = () => {
    if (!token) return;
    api.get('/publicaciones/mias', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(({ data }) => setPublicaciones(data))
      .catch(() => console.log('Error cargando publicaciones'));
  };

  const cargarSolicitudes = () => {
    if (!token) return;
    setLoadingSolicitudes(true);
    api.get('/solicitudes/refugio', {
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
      await api.delete(`/publicaciones/${idPub}`, {
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
      await api.patch(`/solicitudes/${idSolicitud}`,
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
      await api.delete(`/solicitudes/${idSolicitud}`, {
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
            {/* Nuevo campo nombreCompañia */}
            <div className="d-flex justify-content-between align-items-center mb-3 w-100">
              <div className="flex-grow-1">
                <h3 className="card-title mb-1">
                  <i className="bi bi-building me-2" /> {refugio.nombreCompania || 'Sin nombre de refugio'}
                </h3>
                <h4 className="mb-0">
                  <i className="bi bi-person-fill me-2" /> {refugio.nombre} {refugio.apellido}
                </h4>
              </div>
              <button className="btn-3" onClick={() => setShowEdit(true)}>
                <i className="bi bi-pencil-square me-1" /> Editar perfil
              </button>
            </div>
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
                <FontAwesomeIcon icon={faPaw} className="me-2" />
                <strong>Tipo de mascota que recibe:</strong>{" "}
                {Array.isArray(refugio.tipoMascota) && refugio.tipoMascota.length > 0
                  ? refugio.tipoMascota
                      .map(
                        tm =>
                          tm && typeof tm === "string"
                            ? tm.charAt(0).toUpperCase() + tm.slice(1)
                            : ""
                      )
                      .filter(Boolean)
                      .join(", ")
                  : "No especificado"}
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
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setPublicacionEditar(pub);
                        setShowModal(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminarPublicacion(pub._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal para crear o editar publicación */}
        {showModal && (
          <CrearPublicacionModal
            show={showModal}
            handleClose={() => {
              setShowModal(false);
              setPublicacionEditar(null);
            }}
            onPublicacionCreada={() => {
              cargarPublicaciones();
              setShowModal(false);
              setPublicacionEditar(null);
            }}
            publicacionEditar={publicacionEditar}
          />
        )}

        {showEdit && (
          <ModalEditarPerfil
            campos={camposRefugio}
            valores={refugio}
            onClose={() => setShowEdit(false)}
            onSave={async datosActualizados => {
              try {
                const token = localStorage.getItem('token');
                const res = await api.patch(
                  '/refugios/me',
                  datosActualizados,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setRefugio(res.data); // Actualiza el estado con la respuesta del backend
                setShowEdit(false);
              } catch (error) {
                alert('No se pudo guardar el perfil');
              }
            }}
            titulo="Editar perfil del refugio"
          />
        )}

        {/* Sección solicitudes */}
        <h4 className="mb-3 mt-5 text-secondary">
          <i className="bi bi-envelope-fill me-2" /> Solicitudes de Adopción
        </h4>
        {loadingSolicitudes ? (
          <p>Cargando solicitudes...</p>
        ) : solicitudes.length === 0 ? (
          <p>No hay solicitudes para mostrar.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Adoptante</th>
                  <th>Animal</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud._id}>
                    <td>{solicitud.adoptante?.nombre || solicitud.adoptanteNombre} {solicitud.adoptante?.apellido || solicitud.adoptanteApellido}</td>
                    <td>{solicitud.publicacion?.titulo || solicitud.animalNombre}</td>
                    <td>
                      <span className={`badge ${
                        solicitud.estado === 'aprobada' ? 'bg-success' :
                        solicitud.estado === 'rechazada' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {solicitud.estado}
                      </span>
                    </td>
                    <td>
                      {solicitud.estado === 'pendiente' && (
                        <>
                          <button className="btn btn-success btn-sm me-2" onClick={() => cambiarEstado(solicitud._id, 'aprobada')}>
                            Aprobar
                          </button>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => cambiarEstado(solicitud._id, 'rechazada')}>
                            Rechazar
                          </button>
                        </>
                      )}
                      {solicitud.estado === 'rechazada' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminarSolicitud(solicitud._id)}>
                          Eliminar
                        </button>
                      )}
                      {solicitud.estado === 'aprobada' && (
                        <span className="badge bg-success">Aprobada</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default PerfilRefugio;
