import React, { useEffect, useState } from 'react'
import ModalWrapper from '../ui/ModalWrapper';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';
import { temas } from '../../styles/temas';
import DiccionarioDatosSelect from '../ui/DiccionarioDatosSelect';
import { FALLBACKS, getParkingSystemOperationTypes } from '../../services/diccionarioDatos';

const EMPTY = {
    operationType: "",
    endpoint: "",
    providerName: "",
    httpMethod: "GET",
    status: "ACTIVE",

}



const ModalFormCrearEditarOperacionesSis = ({ operacionSistema = null, onClose, onSubmit, cargando,parkingSystemId,mensajeError }) => {
    const [form, setForm] = useState(() => {
        if (operacionSistema) {
            const { id, parkingSystemId: _parkingSystemId, ...rest } = operacionSistema;
            return { ...EMPTY, ...rest }
        }
        return EMPTY;
    });

    const isEditing = Boolean(operacionSistema);
    const [loadingOpciones, setLoadingOpciones] = useState(false);

    useEffect(() => {
        if (operacionSistema) {
            const { id, parkingSystemId: _parkingSystemId, ...editable } = operacionSistema;
            setForm({ ...EMPTY, ...editable });
        } else {
            setForm(EMPTY);
        }
    }, [operacionSistema]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...form,
            parkingSystemId: operacionSistema?.parkingSystemId ?? parkingSystemId
        })
    };

    return (
        <ModalWrapper
            title={isEditing ? "Editar" : "Nuevo"}
            subtitle="Operación"
            onClose={onClose}
            onSubmit={handleSubmit}
            cargando={cargando}
            submitText="Grabar"
            disableSubmit={loadingOpciones}
            errorMensaje={mensajeError}>
            <div className={temas.inputColumnas.dos}>
                <DiccionarioDatosSelect
                    servicioOpciones={getParkingSystemOperationTypes}
                    opcionesQuemadas={FALLBACKS.getParkingSystemOperationTypes}
                    name="operationType"
                    value={form.operationType}
                    onChange={handleChange}
                    label="Tipo operación"
                    disabled={cargando}
                    onLoadingChange={setLoadingOpciones}
                    required
                />

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600">Método HTTP</label>
                    <select
                        name="httpMethod"
                        value={form.httpMethod}
                        onChange={handleChange}
                        disabled={cargando}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-blue-900
                       disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>DELETE</option>
                    </select>
                </div>
                {isEditing && (
                    <Toggle
                        label="Estado"
                        name="status"
                        checked={form.status === "ACTIVE"}
                        onChange={handleChange}
                        disabled={cargando} />
                )}
            </div>
            <Input label="Endpoint *" type="text" name="endpoint" value={form.endpoint} onChange={handleChange}
                disabled={cargando} required maxLength={512} />


        </ModalWrapper>
    )
}

export default ModalFormCrearEditarOperacionesSis