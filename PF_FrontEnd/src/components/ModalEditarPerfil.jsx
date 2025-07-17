import React, { useState } from 'react';

export default function ModalEditarPerfil({ campos, valores, onClose, onSave, titulo = "Editar perfil" }) {
    const [form, setForm] = useState(valores);
    const [errores, setErrores] = useState({});

    // Validación genérica según campos requeridos y tipo
    const validar = () => {
        const nuevosErrores = {};
        campos.forEach(campo => {
            // Requeridos por defecto: nombre, apellido, email, telefono, nombreCompania, direccion, localidad, viveEn
            if (
                ["nombre", "apellido", "email", "telefono", "nombreCompania", "direccion", "localidad", "viveEn"].includes(campo.name) &&
                (!form[campo.name] || form[campo.name].toString().trim() === "")
            ) {
                nuevosErrores[campo.name] = `El campo "${campo.label}" es obligatorio`;
            }
            // Email válido
            if (campo.type === "email" && form[campo.name]) {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!regex.test(form[campo.name])) {
                    nuevosErrores[campo.name] = "Ingrese un email válido";
                }
            }
            // Select obligatorio (si no se permite vacío)
            if (
                campo.type === "select" &&
                campo.options &&
                campo.options[0]?.value === "" &&
                campo.name !== "tipoMascota" &&
                (!form[campo.name] || form[campo.name] === "")
            ) {
                nuevosErrores[campo.name] = `Seleccione una opción para "${campo.label}"`;
            }
            // Validación booleana para los selects de sí/no
            if (
                ["tieneMascota", "disponeDeHorarios", "tuvoMascota"].includes(campo.name) &&
                (form[campo.name] !== true && form[campo.name] !== false)
            ) {
                nuevosErrores[campo.name] = `Debe seleccionar una opción para "${campo.label}"`;
            }
            // Validación de textarea
            if (campo.type === "textarea" && (!form[campo.name] || form[campo.name].trim() === "")) {
                nuevosErrores[campo.name] = `El campo "${campo.label}" es obligatorio`;
            }
        });
        return nuevosErrores;
    };

    const handleSubmit = e => {
        e.preventDefault();
        const nuevosErrores = validar();
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length === 0) {
            onSave(form);
        }
    };

    return (
        <>
            <div className="modal-backdrop show" style={{zIndex: 1050}}></div>
            <div className="modal d-block" tabIndex="-1" style={{zIndex: 1060}}>
                <div className="modal-dialog">
                    <form className="modal-content" onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">{titulo}</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            {campos.map(campo => (
                            <div className="mb-3" key={campo.name}>
                                <label className="form-label">{campo.label}</label>
                                {campo.type === "select" ? (
                                <select
                                    className="form-select"
                                    name={campo.name}
                                    value={form[campo.name] === true ? "true" : form[campo.name] === false ? "false" : form[campo.name] || ""}
                                    onChange={e => {
                                    let value = e.target.value;
                                    if (value === "true") value = true;
                                    else if (value === "false") value = false;
                                    else if (value === "") value = "";
                                    setForm({ ...form, [campo.name]: value });
                                    }}
                                >
                                    {campo.options.map(opt => (
                                    <option key={String(opt.value)} value={String(opt.value)}>
                                        {opt.label}
                                    </option>
                                    ))}
                                </select>
                                ) : campo.type === "multiselect" ? (
                                    <select
                                        className="form-select"
                                        name={campo.name}
                                        multiple
                                        value={form[campo.name] || []}
                                        onChange={e => {
                                        const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                                        setForm({ ...form, [campo.name]: selected });
                                        }}
                                    >
                                        {campo.options.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                        ))}
                                    </select>
                                ) : campo.type === "textarea" ? (
                                <textarea
                                    className="form-control"
                                    name={campo.name}
                                    value={form[campo.name] || ""}
                                    onChange={e => setForm({ ...form, [campo.name]: e.target.value })}
                                    rows={3}
                                />
                                ) : (
                                <input
                                    type={campo.type || "text"}
                                    className="form-control"
                                    name={campo.name}
                                    value={form[campo.name] || ""}
                                    onChange={e => setForm({ ...form, [campo.name]: e.target.value })}
                                />
                                )}
                                {errores[campo.name] && (
                                    <div className="text-danger small mt-1">{errores[campo.name]}</div>
                                )}
                            </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}