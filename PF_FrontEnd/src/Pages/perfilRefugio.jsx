import React from 'react';
import './PerfilRefugio.css'; // Importo el CSS externo

export default function PerfilRefugio() {
  const refugio = {
    nombre: "Refugio Patitas Felices",
    email: "contacto@patitasfelices.org",
    telefono: "+54 381 123-4567",
    direccion: "Calle Falsa 123, Tucumán",
  };

  return (
    <div className="perfil-refugio-container">
      <nav className="perfil-refugio-menu">
        <h2>Menú Refugio</h2>
        <ul>
          <li>Perfil</li>
          <li>Mis Publicaciones</li>
          <li>Crear Nueva Publicación</li>
          <li>Solicitudes de Adopción</li>
          <li>Configuración</li>
          <li className="cerrar-sesion">Cerrar sesión</li>
        </ul>
      </nav>

      <main className="perfil-refugio-contenido">
        <h1>Bienvenido, {refugio.nombre}</h1>
        <section className="perfil-refugio-info">
          <h3>Información del Refugio</h3>
          <p><strong>Email:</strong> {refugio.email}</p>
          <p><strong>Teléfono:</strong> {refugio.telefono}</p>
          <p><strong>Dirección:</strong> {refugio.direccion}</p>
        </section>
      </main>
    </div>
  );
}
