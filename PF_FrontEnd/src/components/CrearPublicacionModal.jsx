import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearPublicacionModal = ({ show, handleClose, onPublicacionCreada, publicacionEditar }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipoMascota: 'perro',
    edad: '',
    tamaño: '',
    fotos: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar datos si es edición
  useEffect(() => {
    if (publicacionEditar) {
      setFormData({
        titulo: publicacionEditar.titulo || '',
        descripcion: publicacionEditar.descripcion || '',
        tipoMascota: publicacionEditar.tipoMascota || 'perro',
        edad: publicacionEditar.edad || '',
        tamaño: publicacionEditar.tamaño || '',
        fotos: (publicacionEditar.fotos || []).join(', ')
      });
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        tipoMascota: 'perro',
        edad: '',
        tamaño: '',
        fotos: ''
      });
    }
  }, [publicacionEditar, show]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autenticado');

      const fotosArray = formData.fotos.split(',').map(url => url.trim()).filter(url => url);

      const publicacion = {
        ...formData,
        fotos: fotosArray
      };

      if (publicacionEditar) {
        // EDITAR
        await axios.patch(
          `http://localhost:3000/api/publicaciones/${publicacionEditar._id}`,
          publicacion,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // CREAR
        await axios.post(
          'http://localhost:3000/api/publicaciones',
          publicacion,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      onPublicacionCreada();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al guardar publicación');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" onClick={handleClose} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Crear Publicación</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  name="titulo"
                  className="form-control"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  className="form-control"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Tipo de mascota</label>
                <select
                  name="tipoMascota"
                  className="form-select"
                  value={formData.tipoMascota}
                  onChange={handleChange}
                  required
                >
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Edad</label>
                <input
                  type="text"
                  name="edad"
                  className="form-control"
                  value={formData.edad}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Tamaño</label>
                <input
                  type="text"
                  name="tamaño"
                  className="form-control"
                  value={formData.tamaño}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fotos (URLs separadas por coma)</label>
                <input
                  type="text"
                  name="fotos"
                  className="form-control"
                  value={formData.fotos}
                  onChange={handleChange}
                  placeholder="https://imagen1.com, https://imagen2.com"
                />
              </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearPublicacionModal;
