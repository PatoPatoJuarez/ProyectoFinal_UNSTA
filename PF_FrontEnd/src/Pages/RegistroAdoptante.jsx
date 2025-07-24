import React, { useState } from 'react';
import "../styles/Registro.css";
import api from '../axios';
import { useNavigate } from 'react-router-dom';

export const RegistroAdop = ({onRegistroExitoso}) => {

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmacionContrasena, setConfirmacionContrasena] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [tieneMascota, setTieneMascota] = useState(null);
    const [viveEn, setViveEn] = useState('');
    const [disponeDeHorarios, setDisponeDeHorarios] = useState(null);
    const [tuvoMascota, setTuvoMascota] = useState(null);
    const [motivoAdopcion, setMotivoAdopcion] = useState('');
    const [cuidadosVeterinarios, setCuidadosVeterinarios] = useState('');
    const [cuidadoAlternativo, setCuidadoAlternativo] = useState('');
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

    const navigate = useNavigate();

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
        if (!email.trim() || !validarEmail(email)) {
            nuevosErrores.email = 'Ingrese un email válido';
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
        if (tieneMascota === null) {
            nuevosErrores.tieneMascota = 'Seleccione si tiene una mascota';
            valid = false;
        }
        if (!viveEn) {
            nuevosErrores.viveEn = 'Seleccione una opción de vivienda';
            valid = false;
        }
        if (disponeDeHorarios === null) {
            nuevosErrores.disponeDeHorarios = 'Seleccione disponibilidad horaria';
            valid = false;
        }
        if (tuvoMascota === null) {
            nuevosErrores.tuvoMascota = 'Seleccione si tuvo mascota';
            valid = false;
        }
        if (!motivoAdopcion.trim()) {
            nuevosErrores.motivoAdopcion = 'Este campo es obligatorio';
            valid = false;
        }
        if (!cuidadosVeterinarios.trim()) {
            nuevosErrores.cuidadosVeterinarios = 'Este campo es obligatorio';
            valid = false;
        }
        if (!cuidadoAlternativo.trim()) {
            nuevosErrores.cuidadoAlternativo = 'Este campo es obligatorio';
            valid = false;
        }

        setErrores(nuevosErrores);
        console.log(errores);
        
        if (!valid) return;

        const datos = {
            nombre,
            apellido,
            email,
            telefono,
            contrasena,
            localidad,
            tieneMascota,
            viveEn,
            disponeDeHorarios,
            tuvoMascota,
            motivoAdopcion,
            cuidadosVeterinarios,
            cuidadoAlternativo
        };

        api.post('/adoptantes', datos)
            .then(response => {
                setMensajeExito('Registro exitoso. Redirigiendo...');
                console.log("Redireccionando");
                setTimeout(() => {
                    if (onRegistroExitoso) {
                        onRegistroExitoso(email, contrasena);
                    }
                }, 1500)
            })
            .catch(error => {
                setErrores({ general: 'Hubo un error al registrar' });
            });
    };

    const mostrarError = (campo) => {
        // console.log(errores[campo]);
        return errores[campo] && <div className="text-danger">{errores[campo]}</div>;
    };

    return (
        <div className='fondo-registro'>
            <div className="registro-form" style={{ maxWidth: '800px', width: '100%' }}>
                <h2>Registro de Adoptante</h2>
                {mensajeExito && <div className="alert alert-success">{mensajeExito}</div>}
                {errores.general && <div className="alert alert-danger">{errores.general}</div>}
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
                        <label className="form-label">¿Tiene mascota en su hogar?</label><br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="tieneMascota" id="tieneMascotaSi" value="true" onChange={() => setTieneMascota(true)} checked={tieneMascota === true} />
                            <label className="form-check-label" htmlFor="tieneMascotaSi">Sí</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="tieneMascota" id="tieneMascotaNo" value="false" onChange={() => setTieneMascota(false)} checked={tieneMascota === false} />
                            <label className="form-check-label" htmlFor="tieneMascotaNo">No</label>
                        </div>
                        {mostrarError("tieneMascota")}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">¿Dónde vive?</label><br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="viveEn" id="casa" value="casa" onChange={() => setViveEn("casa")} checked={viveEn === "casa"} />
                            <label className="form-check-label" htmlFor="casa">Casa</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="viveEn" id="departamento" value="departamento" onChange={() => setViveEn("departamento")} checked={viveEn === "departamento"} />
                            <label className="form-check-label" htmlFor="departamento">Departamento</label>
                        </div>
                        {mostrarError("viveEn")}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">¿Tiene disponibilidad horaria para cuidar a una mascota?</label><br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="disponeDeHorarios" id="siHorarios" value="true" onChange={() => setDisponeDeHorarios(true)} checked={disponeDeHorarios === true} />
                            <label className="form-check-label" htmlFor="siHorarios">Sí</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="disponeDeHorarios" id="noHorarios" value="false" onChange={() => setDisponeDeHorarios(false)} checked={disponeDeHorarios === false} />
                            <label className="form-check-label" htmlFor="noHorarios">No</label>
                        </div>
                        {mostrarError("disponeDeHorarios")}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">¿Tuvo mascotas anteriormente?</label><br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="tuvoMascota" id="siMascota" value="true" onChange={() => setTuvoMascota(true)} checked={tuvoMascota === true} />
                            <label className="form-check-label" htmlFor="siMascota">Sí</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="tuvoMascota" id="noMascota" value="false" onChange={() => setTuvoMascota(false)} checked={tuvoMascota === false} />
                            <label className="form-check-label" htmlFor="noMascota">No</label>
                        </div>
                        {mostrarError("tuvoMascota")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="motivoAdopcion" className="form-label">¿Por qué desea adoptar una mascota?</label>
                        <textarea className="form-control" id="motivoAdopcion" rows="3" value={motivoAdopcion} onChange={(e) => setMotivoAdopcion(e.target.value)}></textarea>
                        {mostrarError("motivoAdopcion")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cuidadosVeterinarios" className="form-label">¿Qué tipo de cuidados veterinarios brindaría?</label>
                        <textarea className="form-control" id="cuidadosVeterinarios" rows="3" value={cuidadosVeterinarios} onChange={(e) => setCuidadosVeterinarios(e.target.value)}></textarea>
                        {mostrarError("cuidadosVeterinarios")}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cuidadoAlternativo" className="form-label">¿Qué haría con la mascota si se va de vacaciones o no puede atenderla?</label>
                        <textarea className="form-control" id="cuidadoAlternativo" rows="3" value={cuidadoAlternativo} onChange={(e) => setCuidadoAlternativo(e.target.value)}></textarea>
                        {mostrarError("cuidadoAlternativo")}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistroAdop;