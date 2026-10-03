import React, { useEffect, useState } from 'react'
import { Download, QrCode, X } from 'lucide-react'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import BotonCopiar from '../ui/BotonCopiar'
import TipoVehiculoAnt from './TipoVehiculoAnt'
import { temas } from '../../styles/temas'
import { formatearFecha } from './usoDetalleUtils'
import { getUsoTicketQr } from '../../services/parkingUsageService'
import { useDiccionarioDatos } from '../../hooks/useDiccionarioDatos'
import { getCustomerTypes, getPaymentMethods, labelFromKey, USAGE_STATUS_OPTIONS } from '../../services/diccionarioDatos'

const ESTILOS_ESTADO = {
    ACTIVE: 'bg-blue-50 text-blue-700 ring-blue-200',
    PAYED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    COMPLETED: 'bg-gray-100 text-gray-600 ring-gray-200',
}

//el backend guarda el QR como base64 sin prefijo (normalmente PNG); se acepta tambien un data URI completo
const aDataUri = (qr) => {
    if (qr.startsWith('data:')) return qr
    const mime = qr.startsWith('/9j/') ? 'image/jpeg' : 'image/png'
    return `data:${mime};base64,${qr}`
}

//tiempo transcurrido entre la entrada y la salida (o ahora, si el vehiculo sigue dentro)
const calcularPermanencia = (entrada, salida) => {
    if (!entrada) return '—'
    const minutos = Math.max(0, Math.floor(((salida ? new Date(salida) : new Date()) - new Date(entrada)) / 60000))
    const dias = Math.floor(minutos / 1440)
    const horas = Math.floor((minutos % 1440) / 60)
    const partes = []
    if (dias) partes.push(`${dias} d`)
    if (horas) partes.push(`${horas} h`)
    partes.push(`${minutos % 60} min`)
    return `${partes.join(' ')}${salida ? '' : ' (en curso)'}`
}

const FilaDato = ({ label, children }) => (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-0.5">{label}</span>
        <span className="text-sm font-medium text-gray-800 text-right">{children}</span>
    </div>
)

//modal de solo lectura con el QR almacenado del ticket de un ParkingUsage y los datos que identifican el uso
const ModalQrUso = ({ parkingUsageId, onClose }) => {
    const [uso, setUso] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [errorMensaje, setErrorMensaje] = useState(null)
    const [imagenInvalida, setImagenInvalida] = useState(false)
    const metodosPago = useDiccionarioDatos(getPaymentMethods)
    const tiposCliente = useDiccionarioDatos(getCustomerTypes)

    useEffect(() => {
        getUsoTicketQr(parkingUsageId)
            .then(({ data }) => setUso(data))
            .catch((error) => {
                setErrorMensaje(error.response?.data?.detail || 'No se pudo cargar el QR del uso.')
                console.error(error.response?.data)
            })
            .finally(() => setCargando(false))
    }, [parkingUsageId])

    useEffect(() => {
        const cerrarConEscape = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', cerrarConEscape)
        return () => window.removeEventListener('keydown', cerrarConEscape)
    }, [onClose])

    const qrSrc = uso?.parkingTicketQr ? aDataUri(uso.parkingTicketQr) : null
    const qrVisible = qrSrc && !imagenInvalida

    const descargarQr = () => {
        const enlace = document.createElement('a')
        enlace.href = qrSrc
        enlace.download = `qr-${uso.parkingTicketNumber || uso.plate || uso.parkingUsageId}.png`
        enlace.click()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}>
                {/*Encabezado*/}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">QR del ticket</p>
                        <h2 className="text-base font-semibold text-slate-700">{uso?.plate || 'Uso de estacionamiento'}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition cursor-pointer" aria-label="Cerrar">
                        <X size={20} strokeWidth={4} />
                    </button>
                </div>

                {/*Cuerpo*/}
                <div className="px-6 py-5 overflow-y-auto flex-1">
                    {cargando && <Spinner texto="Cargando QR.." />}

                    {!cargando && errorMensaje && (
                        <p className={temas.texto.textoErrorFormulario}>{errorMensaje}</p>
                    )}

                    {!cargando && !errorMensaje && uso && (
                        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
                            {/*QR*/}
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-60 h-60 rounded-xl border border-gray-200 bg-white p-3 flex items-center justify-center">
                                    {qrVisible ? (
                                        <img
                                            src={qrSrc}
                                            alt={`QR del ticket ${uso.parkingTicketNumber ?? ''}`}
                                            className="w-full h-full object-contain [image-rendering:pixelated]"
                                            onError={() => setImagenInvalida(true)}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-center text-gray-400">
                                            <QrCode size={48} strokeWidth={1.25} />
                                            <span className="text-sm">
                                                {imagenInvalida ? 'El QR almacenado no es una imagen válida' : 'Este uso no tiene QR almacenado'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {uso.parkingTicketNumber && (
                                    <div className="flex flex-col items-center gap-0.5 max-w-60">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">N° Ticket</span>
                                        <span className="flex items-center gap-1.5 text-xs text-gray-700">
                                            <span className="font-mono break-all text-center">{uso.parkingTicketNumber}</span>
                                            <BotonCopiar valor={uso.parkingTicketNumber} />
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/*Datos del uso*/}
                            <div className="flex flex-col">
                                <FilaDato label="Estado">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset
                                        ${ESTILOS_ESTADO[uso.status] ?? ESTILOS_ESTADO.COMPLETED}`}>
                                        {labelFromKey(USAGE_STATUS_OPTIONS, uso.status)}
                                    </span>
                                </FilaDato>
                                <FilaDato label="Estacionamiento">{uso.parkingName}</FilaDato>
                                <FilaDato label="Placa">{uso.plate || '—'}</FilaDato>
                                <FilaDato label="Tipo vehículo"><TipoVehiculoAnt tipo={uso.antVehicleType} /></FilaDato>
                                <FilaDato label="Entrada">{formatearFecha(uso.entryTime)}</FilaDato>
                                <FilaDato label="Salida">{formatearFecha(uso.exitTime)}</FilaDato>
                                <FilaDato label="Permanencia">{calcularPermanencia(uso.entryTime, uso.exitTime)}</FilaDato>
                                <FilaDato label="Método de pago">
                                    {uso.paymentMethod ? labelFromKey(metodosPago.options, uso.paymentMethod) : '—'}
                                </FilaDato>
                                <FilaDato label="Tipo de cliente">
                                    {uso.customerType ? labelFromKey(tiposCliente.options, uso.customerType) : '—'}
                                </FilaDato>
                                <span className="flex items-center gap-1.5 text-xs text-gray-400 pt-3">
                                    <span className="font-mono truncate">ID: {uso.parkingUsageId}</span>
                                    <BotonCopiar valor={uso.parkingUsageId} />
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/*Footer*/}
                <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    {qrVisible && (
                        <Button texto="Descargar QR" variante="primary" tamanio="md" icono={<Download size={16} />} onClick={descargarQr} />
                    )}
                    <Button texto="Cerrar" variante="secondary" tamanio="md" onClick={onClose} />
                </div>
            </div>
        </div>
    )
}

export default ModalQrUso
