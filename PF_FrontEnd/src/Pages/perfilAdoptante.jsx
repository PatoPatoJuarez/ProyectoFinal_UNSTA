import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ModalEditarPerfil from '../components/ModalEditarPerfil';
import { useNavigate } from 'react-router-dom';
import '../styles/perfilUsuario.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PerfilAdoptante = () => {
  const [adoptante, setAdoptante] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
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

  const localidades = [
    'San Miguel de Tucuman',
    'Yerba Buena',
    'Concepcion',
    'Banda del Rio Sali',
    'Lules',
    'Tafi del Valle'
  ];

  const camposAdoptante = [
    { name: "nombre", label: "Nombre" },
    { name: "apellido", label: "Apellido" },
    { name: "email", label: "Email", type: "email" },
    { name: "telefono", label: "Teléfono" },
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
      name: "viveEn",
      label: "¿Dónde vive?",
      type: "select",
      options: [
        { value: "casa", label: "Casa" },
        { value: "departamento", label: "Departamento" }
      ]
    },
    {
      name: "tieneMascota",
      label: "¿Tiene mascota en su hogar?",
      type: "select",
      options: [
        { value: "", label: "No especificado" },
        { value: true, label: "Sí" },
        { value: false, label: "No" }
      ]
    },
    {
      name: "disponeDeHorarios",
      label: "¿Tiene disponibilidad horaria?",
      type: "select",
      options: [
        { value: "", label: "No especificado" },
        { value: true, label: "Sí" },
        { value: false, label: "No" }
      ]
    },
    {
      name: "tuvoMascota",
      label: "¿Tuvo mascotas anteriormente?",
      type: "select",
      options: [
        { value: "", label: "No especificado" },
        { value: true, label: "Sí" },
        { value: false, label: "No" }
      ]
    },
    { name: "motivoAdopcion", label: "Motivo para adoptar", type: "textarea" },
    { name: "cuidadosVeterinarios", label: "Cuidados veterinarios", type: "textarea" },
    { name: "cuidadoAlternativo", label: "Cuidado alternativo", type: "textarea" }
  ];

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
          <h2 className="text-primary fw-bold">
            <i className="bi bi-person-heart me-2" /> Perfil Adoptante
          </h2>
          <button className="btn-1 mt-2 me-1" onClick={() => navigate('/main')}>
            <i className="bi bi-arrow-left me-1" /> Volver al Feed
          </button>
        </div>
        
        <div className="card mb-4 shadow-sm rounded-4 card-hover">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3 w-100">
              <div className="flex-grow-1">
              <h4 className="card-title mb-0">
                <i className="bi bi-person-fill me-2" /> {adoptante.nombre} {adoptante.apellido}
              </h4>
              </div>
              <button className="btn-3" onClick={() => setShowEdit(true)}>
                <i className="bi bi-pencil-square me-1" /> Editar perfil
              </button>
            </div>
            <ul className="list-group list-group-flush perfil-lista-datos mb-0">
              <li className="list-group-item">
                <i className="bi bi-envelope-fill me-2" /><strong>Email:</strong> {adoptante.email}
              </li>
              <li className="list-group-item">
                <i className="bi bi-telephone-fill me-2" /><strong>Teléfono:</strong> {adoptante.telefono}
              </li>
              <li className="list-group-item">
                <i className="bi bi-geo-alt-fill me-2" /><strong>Localidad:</strong> {adoptante.localidad}
              </li>
              <li className="list-group-item">
                <i className="bi bi-house-door-fill me-2" /><strong>¿Tiene mascota en su hogar?:</strong> {adoptante.tieneMascota === true ? 'Sí' : adoptante.tieneMascota === false ? 'No' : 'No especificado'}
              </li>
              <li className="list-group-item">
                <i className="bi bi-building me-2" /><strong>¿Dónde vive?:</strong> {" "}
                {adoptante.viveEn
                  ? adoptante.viveEn.charAt(0).toUpperCase() + adoptante.viveEn.slice(1)
                  : 'No especificado'}
              </li>
              <li className="list-group-item">
                <i className="bi bi-clock-history me-2" /><strong>¿Tiene disponibilidad horaria?:</strong> {adoptante.disponeDeHorarios === true ? 'Sí' : adoptante.disponeDeHorarios === false ? 'No' : 'No especificado'}
              </li>
              <li className="list-group-item">
                <i className="bi bi-heart-pulse-fill me-2" /><strong>¿Tuvo mascotas anteriormente?:</strong> {adoptante.tuvoMascota === true ? 'Sí' : adoptante.tuvoMascota === false ? 'No' : 'No especificado'}
              </li>
              <li className="list-group-item">
                <i className="bi bi-question-circle-fill me-2" /><strong>Motivo para adoptar:</strong> {adoptante.motivoAdopcion || 'No especificado'}
              </li>
              <li className="list-group-item">
                <i className="bi bi-capsule-pill me-2" /><strong>Cuidados veterinarios:</strong> {adoptante.cuidadosVeterinarios || 'No especificado'}
              </li>
              <li className="list-group-item">
                <i className="bi bi-people-fill me-2" /><strong>Cuidado alternativo:</strong> {adoptante.cuidadoAlternativo || 'No especificado'}
              </li>
            </ul>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-secondary">
            <i className="bi bi-inbox-fill me-2" /> Mis solicitudes
          </h4>
        </div>

        {solicitudes.length === 0 && <p>No has enviado solicitudes aún.</p>}

        
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {solicitudes.map(solicitud => (
          <div className="col" key={solicitud._id}>
            <div className="card h-100 shadow-sm rounded-4 card-hover">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-megaphone-fill me-2" />
                  {solicitud.publicacion?.titulo || 'Sin título'}
                </h5>
                <p><i className="bi bi-chat-left-text me-2" /><strong>Mensaje:</strong> {solicitud.mensaje || 'Sin mensaje'}</p>
                <p>
                  <i className="bi bi-info-circle-fill me-2" />
                  <strong>Estado:</strong> 
                  <span className={`ms-2 badge ${
                    solicitud.estado === 'aprobada' ? 'bg-success' :
                    solicitud.estado === 'rechazada' ? 'bg-danger' : 'bg-secondary'
                  }`}>
                    {solicitud.estado}
                  </span>
                </p>
                <p><i className="bi bi-calendar-event me-2" /><strong>Fecha:</strong> {new Date(solicitud.fecha).toLocaleDateString()}</p>
              </div>
              {solicitud.estado === 'rechazada' && (
                <div className="card-footer d-flex justify-content-end">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleEliminarSolicitud(solicitud._id)}
                  >
                    <i className="bi bi-trash-fill me-1" /> Eliminar solicitud
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>

      {showEdit && adoptante && (
        <ModalEditarPerfil
          campos={camposAdoptante}
          valores={adoptante}
          onClose={() => setShowEdit(false)}
          onSave={async datosActualizados => {
            try {
              const token = localStorage.getItem('token');
              const res = await axios.patch(
                'http://localhost:3000/api/adoptantes/me',
                datosActualizados,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setAdoptante(res.data); // Actualiza el estado con la respuesta del backend
              setShowEdit(false);
            } catch (error) {
              alert('No se pudo guardar el perfil');
            }
          }}
          titulo="Editar perfil de usuario"
        />
      )}

      <Footer />
    </div>
  );
};

export default PerfilAdoptante;
