import { useState } from 'react';

export default function FormularioPublicacion({ token, onPublicacionCreada }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoMascota, setTipoMascota] = useState('perro');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [vacunado, setVacunado] = useState('');
  const [tamano, setTamano] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('No estás autenticado como refugio.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/publicaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          tipoMascota,
          edad,
          sexo,
          vacunado,
          tamano
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al crear la publicación');
        setMensaje('');
      } else {
        setMensaje(data.message || '¡Publicación creada con éxito!');
        setError('');
        setTitulo('');
        setDescripcion('');
        setTipoMascota('perro');
        setEdad('');
        setSexo('');
        setVacunado('');
        setTamano('');

        // ⚠️ Notifica al padre (MainPage) que se creó una nueva publicación
        if (onPublicacionCreada) onPublicacionCreada();
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      setMensaje('');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Crear Publicación</h2>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de Mascota</label>
          <select
            className="form-select"
            value={tipoMascota}
            onChange={(e) => setTipoMascota(e.target.value)}
          >
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Edad</label>
          <input
            type="text"
            className="form-control"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Sexo</label>
          <select
            className="form-select"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
          >
            <option value="Hembra">Hembra</option>
            <option value="Macho">Macho</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Vacunado</label>
          <select
            className="form-select"
            value={vacunado}
            onChange={(e) => setVacunado(e.target.value)}
          >
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Tamaño</label>
          <input
            type="text"
            className="form-control"
            value={tamano}
            onChange={(e) => setTamano(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Publicar</button>
      </form>
    </div>
  );
}
