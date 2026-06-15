import React, { useEffect, useState } from 'react'
import ModalWrapper from '../ui/ModalWrapper';
import { temas } from '../../styles/temas';
import DiccionarioDatosSelect from '../ui/DiccionarioDatosSelect';
import { FALLBACKS, getSystemUserAuthority, getUserStatus } from '../../services/diccionarioDatos';
import DiccionarioDatosCheckBox from '../ui/DiccionarioDatosCheckBox';
import Input from '../ui/Input';
import { Output } from '../ui/Output';

const EMPTY = {
    username: "",
    password: "",
    description: "",
    status: "ACTIVE",
    authorities: [],
}
const ModalFormCrearEditarUsuariosSistemas = ({ usuarioSistema = null, onClose, onSubmit, cargando, mensajeError }) => {
    const [form, setForm] = useState(() => {
        if (usuarioSistema) {
            const { id, ...rest } = usuarioSistema;
            return { ...EMPTY, ...rest }
        }
        return EMPTY
    });
    const isEditing = Boolean(usuarioSistema);
    const [loadingEstado, setLoadingEstado] = useState(false);

    useEffect(() => {
        setLoadingEstado(false);
        if (usuarioSistema) {
            const { id, ...editable } = usuarioSistema;
            setForm({ ...EMPTY, ...editable });
        } else {
            setForm(EMPTY);
        }
    }, [usuarioSistema]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form)
    };
    return (
        <ModalWrapper
            title={isEditing ? "Editar" : "Nuevo"}
            subtitle="Usuario de Sistema"
            onClose={onClose}
            onSubmit={handleSubmit}
            cargando={cargando}
            submitText="Grabar"
            disableSubmit={loadingEstado}
            errorMensaje={mensajeError}
        >
            <div className={temas.inputColumnas.dos} >
                {isEditing ? (
                    <Output label="Username*" value={form.username} />
                ) : (
                    <Input label="Username*" type="text" name="username" value={form.username} onChange={handleChange}
                        disabled={cargando} required maxLength={255} />
                )
                }


                {!isEditing && (
                    <Input label="Contraseña*" type="password" name="password" value={form.password} onChange={handleChange}
                        disabled={cargando} required maxLength={255} />
                )}
                {isEditing && (
                    <DiccionarioDatosSelect
                        servicioOpciones={getUserStatus}
                        opcionesQuemadas={FALLBACKS.getStatusUser}
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        label="Estado"
                        disabled={cargando}
                        onLoadingChange={setLoadingEstado}
                        required
                    />
                )}
                <Input label="Descripción" type="text" name="description" value={form.description} onChange={handleChange}
                    disabled={cargando} maxLength={255} />

            </div>
            <DiccionarioDatosCheckBox
                servicioOpciones={getSystemUserAuthority}
                opcionesQuemadas={FALLBACKS.getSystemUserAuthority}
                value={form.authorities}
                onChange={(nuevoArray) => setForm((prev) =>
                    ({ ...prev, authorities: nuevoArray }))}
                label="Grupos"
                disable={cargando}
                required
            />

        </ModalWrapper>
    )
}

export default ModalFormCrearEditarUsuariosSistemas