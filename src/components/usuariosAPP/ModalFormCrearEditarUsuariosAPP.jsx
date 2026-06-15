import React, { useEffect, useState } from 'react'
import ModalWrapper from '../ui/ModalWrapper';
import { temas } from '../../styles/temas';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import DiccionarioDatosSelect from '../ui/DiccionarioDatosSelect';
import { FALLBACKS, getAppUserAuthority, getUserStatus } from '../../services/diccionarioDatos';
import { Output } from '../ui/Output';
import DiccionarioDatosCheckBox from '../ui/DiccionarioDatosCheckBox';

const EMPTY = {
    name: "",
    email: "",
    password: "",
    status: "ACTIVE",
    authorities: [],
}

const ModalFormCrearEditarUsuariosAPP = ({ usuarioApp = null, onClose, onSubmit, cargando,mensajeError }) => {
    const [form, setForm] = useState(() => {
        if (usuarioApp) {
            const { id, ...rest } = usuarioApp;
            return { ...EMPTY, ...rest }
        }
        return EMPTY
    });

    const isEditing = Boolean(usuarioApp);
    const [loadingEstado, setLoadingEstado] = useState(false);
    

    useEffect(() => {
        setLoadingEstado(false);
        if (usuarioApp) {
            const { id, ...editable } = usuarioApp;
            setForm({ ...EMPTY, ...editable });
        } else {
            setForm(EMPTY);
        }
    }, [usuarioApp]);

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
            subtitle="Usuario de Aplicación"
            onClose={onClose}
            onSubmit={handleSubmit}
            cargando={cargando}
            submitText="Grabar"
            disableSubmit={loadingEstado}
            errorMensaje={mensajeError}
        >
            <div className={temas.inputColumnas.dos}>
                <Input label="Nombres*" type="text" name="name" value={form.name} onChange={handleChange}
                    disabled={cargando} required maxLength={255} />
                {isEditing && (
                    <DiccionarioDatosSelect
                    servicioOpciones={getUserStatus}
                    opcionesQuemadas={FALLBACKS.getStatusUser}
                    name = "status"
                    value={form.status}
                    onChange={handleChange}
                    label="Estado"
                    disabled = {cargando}
                    onLoadingChange={setLoadingEstado}
                    required
                    />
                )}
                {isEditing ? (
                    <Output label="Correo electrónico*" value={form.email}/>
                ) : (
                    <Input label="Correo electrónico*" type="email" name="email" value={form.email} onChange={handleChange}
                        disabled={cargando} required maxLength={255} />
                )
                }
                
                {!isEditing && (
                    <Input label="Contraseña*" type="password" name="password" value={form.password} onChange={handleChange}
                        disabled={cargando} required maxLength={255} />
                )}                
                
            </div>
            <DiccionarioDatosCheckBox
            servicioOpciones={getAppUserAuthority}
            opcionesQuemadas={FALLBACKS.getAppUserAuthority}
            value={form.authorities}
            onChange={(nuevoArray) => setForm((prev) =>
            ({...prev,authorities:nuevoArray}))}
            label="Roles"
            disable={cargando}
            required
            />

        </ModalWrapper>
    )
}

export default ModalFormCrearEditarUsuariosAPP