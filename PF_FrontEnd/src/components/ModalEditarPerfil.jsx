import React, { useState } from 'react';

export default function ModalEditarPerfil({ campos, valores, onClose, onSave, titulo = "Editar perfil" }) {
    const [form, setForm] = useState(valores);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSave(form);
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
                                    <input
                                        type={campo.type || "text"}
                                        className="form-control"
                                        name={campo.name}
                                        value={form[campo.name] || ""}
                                        onChange={handleChange}
                                    />
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