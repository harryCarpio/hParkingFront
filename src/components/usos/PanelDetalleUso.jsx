import React, { useEffect, useState } from 'react'
import { Receipt } from 'lucide-react'
import PanelLateral from '../ui/PanelLateral'
import Spinner from '../ui/Spinner'
import BotonCopiar from '../ui/BotonCopiar'
import { temas } from '../../styles/temas'
import { getUsoDetalle } from '../../services/parkingUsageService'
import TarjetaCheckout from './TarjetaCheckout'
import TarjetaFactura from './TarjetaFactura'

//panel lateral con el arbol completo de detalle de un ParkingUsage: sus checkouts (con servicios, cobros
//y factura cobrada emparejada por tx) mas cualquier factura adicional emparejada solo por parkingTicketNumber
const PanelDetalleUso = ({ parkingUsageId, onClose }) => {
    const [detalle, setDetalle] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [errorMensaje, setErrorMensaje] = useState(null)

    const cargar = async () => {
        setCargando(true)
        setErrorMensaje(null)
        try {
            const { data } = await getUsoDetalle(parkingUsageId)
            setDetalle(data)
        } catch (error) {
            setErrorMensaje(error.response?.data?.detail || 'No se pudo cargar el detalle del uso.')
            console.error(error.response?.data)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        cargar()
    }, [parkingUsageId])

    return (
        <PanelLateral
            title={detalle?.atmCheckouts[0]?.plate ?? 'Detalle de uso'}
            subtitle="Uso de estacionamiento"
            onClose={onClose}
            ancho="max-w-2xl"
        >
            {cargando && <Spinner texto="Cargando detalle.." />}

            {!cargando && errorMensaje && (
                <p className={temas.texto.textoErrorFormulario}>{errorMensaje}</p>
            )}

            {!cargando && !errorMensaje && detalle && (
                <div className="flex flex-col gap-6">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 -mt-1">
                        <span className="font-mono truncate">ID: {detalle.parkingUsageId}</span>
                        <BotonCopiar valor={detalle.parkingUsageId} />
                    </span>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Checkouts ({detalle.atmCheckouts.length})
                        </h3>
                        {detalle.atmCheckouts.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {detalle.atmCheckouts.map((checkout, index) => (
                                    <TarjetaCheckout
                                        key={checkout.id}
                                        checkout={checkout}
                                        abiertoInicial={index === 0}
                                        onSincronizado={cargar}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">Sin checkouts registrados</p>
                        )}
                    </div>

                    {detalle.additionalInvoices.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Receipt size={14} /> Facturas adicionales ({detalle.additionalInvoices.length})
                            </h3>
                            <div className="flex flex-col gap-3">
                                {detalle.additionalInvoices.map((factura) => (
                                    <TarjetaFactura key={factura.invoice.id} factura={factura} onSincronizado={cargar} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </PanelLateral>
    )
}

export default PanelDetalleUso
