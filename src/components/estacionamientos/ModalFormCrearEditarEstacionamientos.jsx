import React, { useEffect, useState } from 'react'
import ModalWrapper from '../ui/ModalWrapper';
import Input from '../ui/Input';
import { Output } from '../ui/Output';
import Toggle from '../ui/Toggle';
import { temas } from '../../styles/temas';
import DiccionarioDatosSelect from '../ui/DiccionarioDatosSelect';
import { FALLBACKS, getParkingTypes } from '../../services/diccionarioDatos';

const EMPTY = {
    name: "",
    address: "",
    city: "",
    phone: "",
    status: "ACTIVE",
    totalLevels: 0,
    parkingType: "SIMPLE",
    totalCapacity: 0,
    availableCount: 0,
    latitude: 0,
    longitude: 0,
    operatingHours: "",
    services: "",
}

const ModalFormCrearEditarEstacionamientos = ({ parking = null, onClose, onSubmit, cargando,mensajeError }) => {
    const [form, setForm] = useState(() => {
        if (parking) {
            const { id, ...rest } = parking;
            return rest;
        }
        return EMPTY;
    });
    const isEditing = Boolean(parking);
    const [loadingOpciones, setLoadingOpciones] = useState(false);

    useEffect(() => {
        if (parking) {
            const { id, ...editable } = parking;
            setForm(editable);
        } else {
            setForm(EMPTY);
        }
    }, [parking]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form)
    };

    return (
        <ModalWrapper
            title={isEditing ? "Editar" : "Nuevo"}
            subtitle="Estacionamiento"
            onClose={onClose}
            onSubmit={handleSubmit}
            cargando={cargando}
            submitText="Grabar"
            disableSubmit={loadingOpciones}
            errorMensaje={mensajeError}
        >
            <div className={temas.inputColumnas.dos}>
                <Input label="Nombre*" type="text" name="name" value={form.name} onChange={handleChange}
                    disabled={cargando} required maxLength={100} />
                <Input label="Ciudad*" type="text" name="city" value={form.city} onChange={handleChange}
                    disabled={cargando} required maxLength={100} />
            </div>
            <Input label="Dirección*" type="text" name="address" value={form.address} onChange={handleChange}
                disabled={cargando} required maxLength={255} />
            <div className={temas.inputColumnas.dos}>
                <Input label="Teléfono" type="tel" name="phone" value={form.phone} onChange={handleChange}
                    disabled={cargando} maxLength={20} />

                <Input label="ID externo" type="text" name="externalParkingId" value={form.externalParkingId} onChange={handleChange}
                    disabled={cargando} />

                <Input label="Niveles*" type="number" name="totalLevels" value={form.totalLevels} onChange={handleChange}
                    disabled={cargando} required />
                {isEditing && (
                    <Toggle
                        label="Estado"
                        name="status"
                        checked={form.status === "ACTIVE"}
                        onChange={handleChange}
                        disabled={cargando} />
                )}
                <Input label="Capacidad total*" type="number" name="totalCapacity" value={form.totalCapacity} onChange={handleChange}
                    disabled={cargando} required />
                {isEditing && (
                    <Output label="Disponibles" value={form.availableCount} />
                )}

                <Input label="Latitud*" type="number" name="latitude" value={form.latitude} onChange={handleChange}
                    disabled={cargando} required min={-90} max={90} step="any" />
                <Input label="Longitud*" type="number" name="longitude" value={form.longitude} onChange={handleChange}
                    disabled={cargando} required min={-180} max={180} step="any" />

                <DiccionarioDatosSelect
                    servicioOpciones={getParkingTypes}
                    opcionesQuemadas={FALLBACKS.getParkingTypes}
                    name="parkingType"
                    value={form.parkingType}
                    onChange={handleChange}
                    label="Tipo estacionamiento"
                    disabled={cargando}
                    onLoadingChange={setLoadingOpciones}
                    required />
                <Input label="Servicios" type="text" name="services" value={form.services} onChange={handleChange} disabled={cargando}
                    maxLength={255} />
            </div>
            <Input label="Horario de operación" type="text" name="operatingHours" value={form.operatingHours} onChange={handleChange} disabled={cargando}
                maxLength={255} />
        </ModalWrapper>
    )
}

export default ModalFormCrearEditarEstacionamientos