import React, { useState } from 'react';
import { useEffect } from 'react';
import "../styles/Registro.css";
import api from '../axios';

const RegistroRef = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nombreCompania, setNombreCompania] = useState('');  // <-- NUEVO ESTADO
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmacionContrasena, setConfirmacionContrasena] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [direccion, setDireccion] = useState('');
    const [tipoMascota, setTipoMascota] = useState([]);
    const [procesoAdopcion, setProcesoAdopcion] = useState('');
    const [tarifaAdopcion, setTarifaAdopcion] = useState('');
    const [seguimientoAdopcion, setSeguimientoAdopcion] = useState('');
    const [necesidadesRefugio, setNecesidadesRefugio] = useState('');
    const [errores, setErrores] = useState({});
    const [mensajeExito, setMensajeExito] = useState('');

    const localidades = [
        'San Miguel de Tucuman',
        'Yerba Buena',
        'Concepcion',
        'Banda del Rio Sali',
        'Lules',
        'Tafi del Valle'
    ];

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    useEffect(() => {
            console.log(errores);
        }, [errores]);

    const handleSubmit = (event) => {
        event.preventDefault();
        let valid = true;
        let nuevosErrores = {};

        if (!nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es obligatorio';
            valid = false;
        }
        if (!apellido.trim()) {
            nuevosErrores.apellido = 'El apellido es obligatorio';
            valid = false;
        }
        if (!nombreCompania.trim()) {     // <-- NUEVA VALIDACION
            nuevosErrores.nombreCompania = 'El nombre del refugio es obligatorio';
            valid = false;
        }
        if (!email.trim() || !validarEmail(email)) {
            nuevosErrores.email = 'Ingrese un email válido (debe contener @ y .)';
            valid = false;
        }
        if (!telefono.trim()) {
            nuevosErrores.telefono = 'El teléfono es obligatorio';
            valid = false;
        } else if (!/^(\+54|54)?\d{8,15}$/.test(telefono.replace(/[\s-]/g, ""))) {
            nuevosErrores.telefono = 'El teléfono debe tener entre 8 y 15 dígitos, con o sin +54';
            valid = false;
        }
        if (!contrasena.trim()) {
            nuevosErrores.contrasena = 'La contraseña es obligatoria';
            valid = false;
        } else if (contrasena.length < 6) {
            nuevosErrores.contrasena = 'La contraseña debe tener al menos 6 caracteres';
            valid = false;
        }        
        if (!confirmacionContrasena.trim()) {
            nuevosErrores.confirmacionContrasena = 'Debe confirmar la contraseña';
            valid = false;
        } else if (contrasena !== confirmacionContrasena) {
            nuevosErrores.confirmacionContrasena = 'Las contraseñas no coinciden';
            valid = false;
        }
        if (!localidad) {
            nuevosErrores.localidad = 'Seleccione una localidad';
            valid = false;
        }
        if (!direccion.trim()) {
            nuevosErrores.direccion = 'La dirección es obligatoria';
            valid = false;
        }
        if (tipoMascota.length === 0) {
            nuevosErrores.tipoMascota = 'Seleccione al menos un tipo de mascota';
            valid = false;
        }
        if (!procesoAdopcion.trim()) {
            nuevosErrores.procesoAdopcion = 'Describa el proceso de adopción';
            valid = false;
        }
        if (!tarifaAdopcion.trim()) {
            nuevosErrores.tarifaAdopcion = 'Indique la tarifa de adopción';
            valid = false;
        }
        if (!seguimientoAdopcion) {
            nuevosErrores.seguimientoAdopcion = 'Seleccione una opción';
            valid = false;
        }
        if (!necesidadesRefugio.trim()) {
            nuevosErrores.necesidadesRefugio = 'Describa las necesidades del refugio';
            valid = false;
        }

        setErrores(nuevosErrores);

        if (!valid) return;

        const datos = {
        nombre,
        apellido,
        nombreCompania,   // <-- NUEVO CAMPO ENVIADO
        email,
        telefono,
        contrasena,
        localidad,
        direccion,
        tipoMascota,
        procesoAdopcion,
        tarifaAdopcion,
        seguimientoAdopcion,
        necesidadesRefugio
        };

        api.post('/refugios', datos)
        .then(response => {
            setMensajeExito('Registro exitoso. Redirigiendo...');
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        })
        .catch(error => {
            setErrores({ general: 'Hubo un error al registrar' });
        });
    };

    const handleTipoMascotaChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setTipoMascota([...tipoMascota, value]);
        } else {
            setTipoMascota(tipoMascota.filter((tipo) => tipo !== value));
        }
    };

    const mostrarError = (campo) => {
        console.log(errores[campo]);
        return errores[campo] && <div className="text-danger">{errores[campo]}</div>;
    };

    return (
        <div className='fondo-registro'>
            <div className="registro-form">
                <h2>Registro de Refugio</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        {mostrarError("nombre")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="apellido" className="form-label">Apellido</label>
                        <input type="text" className="form-control" id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                        {mostrarError("apellido")}
                    </div>

                    {/* NUEVO INPUT PARA NOMBRE DEL REFUGIO */}
                    <div className="mb-3">
                        <label htmlFor="nombreCompania" className="form-label">Nombre del Refugio</label>
                        <input type="text" className="form-control" id="nombreCompania" value={nombreCompania} onChange={(e) => setNombreCompania(e.target.value)} />
                        {mostrarError("nombreCompania")}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="text" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {mostrarError("email")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                        <input type="tel" className="form-control" id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        {mostrarError("telefono")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contrasena" className="form-label">Contraseña</label>
                        <input type="password" className="form-control" id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                        {mostrarError("contrasena")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmacionContrasena" className="form-label">Confirmar Contraseña</label>
                        <input type="password" className="form-control" id="confirmacionContrasena" value={confirmacionContrasena} onChange={(e) => setConfirmacionContrasena(e.target.value)} />
                        {mostrarError("confirmacionContrasena")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="localidad" className="form-label">Localidad</label>
                        <select className="form-select" id="localidad" value={localidad} onChange={(e) => setLocalidad(e.target.value)}>
                            <option value="">Seleccione una localidad</option>
                            {localidades.map((loc, index) => (
                                <option key={index} value={loc}>{loc}</option>
                            ))}
                        </select>
                        {mostrarError("localidad")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="direccion" className="form-label">Dirección</label>
                        <input type="text" className="form-control" id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                        {mostrarError("direccion")}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tipo de Mascota</label>
                        <div className="d-flex gap-3">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="tipoMascotaPerro" value="Perro" checked={tipoMascota.includes("Perro")} onChange={handleTipoMascotaChange} />
                                <label className="form-check-label" htmlFor="tipoMascotaPerro">Perro</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="tipoMascotaGato" value="Gato" checked={tipoMascota.includes("Gato")} onChange={handleTipoMascotaChange} />
                                <label className="form-check-label" htmlFor="tipoMascotaGato">Gato</label>
                            </div>
                        </div>
                        {mostrarError("tipoMascota")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="procesoAdopcion" className="form-label">¿Cómo funciona el proceso de adopción?</label>
                        <textarea className="form-control" id="procesoAdopcion" value={procesoAdopcion} onChange={(e) => setProcesoAdopcion(e.target.value)} />
                        {mostrarError("procesoAdopcion")}
                    </div>
                                        <div className="mb-3">
                        <label htmlFor="tarifaAdopcion" className="form-label">Tarifa de Adopción</label>
                        <input type="text" className="form-control" id="tarifaAdopcion" value={tarifaAdopcion} onChange={(e) => setTarifaAdopcion(e.target.value)} />
                        {mostrarError("tarifaAdopcion")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="seguimientoAdopcion" className="form-label">¿Ofrecen seguimiento posterior a la adopción?</label>
                        <select className="form-select" id="seguimientoAdopcion" value={seguimientoAdopcion} onChange={(e) => setSeguimientoAdopcion(e.target.value)}>
                            <option value="">Seleccione una opción</option>
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                        </select>
                        {mostrarError("seguimientoAdopcion")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="necesidadesRefugio" className="form-label">¿Cuáles son las necesidades actuales del refugio?</label>
                        <textarea className="form-control" id="necesidadesRefugio" value={necesidadesRefugio} onChange={(e) => setNecesidadesRefugio(e.target.value)} />
                        {mostrarError("necesidadesRefugio")}
                    </div>
                    {mensajeExito && <div className="alert alert-success">{mensajeExito}</div>}
                    {errores.general && <div className="alert alert-danger">{errores.general}</div>}
                    <button type="submit" className="btn btn-primary">Registrarse</button>
                </form>
            </div>
        </div>
    );
};

export default RegistroRef;
