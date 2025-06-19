import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/mainPage.css';

const MainPage = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 mainpage-container">
      <Header />

      <main className="container py-5 flex-grow-1">
        <h1 className="text-center mb-5 display-5">🐾 Feed de Publicaciones de Refugios</h1>

        {loading && <p className="text-center">Cargando publicaciones...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {publicaciones.map(pub => (
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
                  <p className="card-text flex-grow-1">
                    {pub.descripcion || 'Sin descripción.'}
                  </p>
                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item"><strong>Tipo:</strong> {pub.tipoMascota || 'N/A'}</li>
                    <li className="list-group-item"><strong>Edad:</strong> {pub.edad || 'N/A'}</li>
                    <li className="list-group-item"><strong>Sexo:</strong> {pub.sexo || 'N/A'}</li>
                  </ul>
                  <button className="btn btn-primary mt-auto" type="button" disabled>
                    Más información
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
