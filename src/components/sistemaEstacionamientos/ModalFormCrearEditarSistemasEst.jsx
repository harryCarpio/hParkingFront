import React, { useEffect, useState } from 'react'
import ModalWrapper from '../ui/ModalWrapper';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';

const EMPTY = {   
    url: "",
    apiUser: "",
    providerName: "",
    supportEmail: "",
    supportPhone: "",
    supportName: "",
    status: "ACTIVE",
    authorities: []
}


const ModalFormCrearEditarSistemasEst = ({sistemaParking = null, onClose, onSubmit, cargando,parkingId,mensajeError}) => {
    const [form, setForm] = useState(() => {
        if (sistemaParking) {
            const { id, parkingId: _parkingId,...rest } = sistemaParking;
            return { ...EMPTY, ...rest };
        }
        return EMPTY;
    });
   

    const isEditing = Boolean(sistemaParking);

    useEffect(() => {
        if (sistemaParking) {
            const { id, parkingId: _parkingId, ...editable } = sistemaParking;
            setForm({...EMPTY, ...editable});
        } else {
            setForm(EMPTY);
        }
    }, [sistemaParking]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({...form,
            parkingId: sistemaParking?.parkingId ?? parkingId
        })
    };
    return (
        <ModalWrapper
            title={isEditing ? "Editar" : "Nuevo"}
            subtitle="Sistema"
            onClose={onClose}
            onSubmit={handleSubmit}
            cargando={cargando}
            submitText="Grabar"
            errorMensaje={mensajeError}>
            <div className="grid grid-cols-2 gap-4 items-end">
                <Input label="Usuario API" type="text" name="apiUser" value={form.apiUser} onChange={handleChange}
                    disabled={cargando} maxLength={255} />
                <Input label="Nombre proveedor" type="text" name="providerName" value={form.providerName} onChange={handleChange}
                    disabled={cargando} maxLength={100} />
                {isEditing && (
                    <Toggle
                        label="Estado"
                        name="status"
                        checked={form.status === "ACTIVE"}
                        onChange={handleChange}
                        disabled={cargando}
                    />
                )}
            </div>
            <Input label="URL*" type="text" name="url" value={form.url} onChange={handleChange}
                disabled={cargando} required maxLength={512} />
            <p className="text-sm font-semibold text-gray-700">Información Soporte:</p>
            <div className="grid grid-cols-2 gap-4 items-end">
                <Input label="Encargado" type="text" name="supportName" value={form.supportName} onChange={handleChange}
                    disabled={cargando} maxLength={150} />
                <Input label="Correo" type="email" name="supportEmail" value={form.supportEmail} onChange={handleChange}
                    disabled={cargando} maxLength={255} />
                <Input label="Teléfono" type="text" name="supportPhone" value={form.supportPhone} onChange={handleChange}
                    disabled={cargando} maxLength={50} />
            </div>
        </ModalWrapper>
    )
}
export default ModalFormCrearEditarSistemasEst
