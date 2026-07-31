import React, { useState } from 'react'
import { FileText } from 'lucide-react'
import BadgeSyncStatus from '../facturas/BadgeSyncStatus'
import ModalDetalleSincronizacion from '../facturas/ModalDetalleSincronizacion'
import BotonCopiar from '../ui/BotonCopiar'
import { formatearFecha, formatearMoneda } from './usoDetalleUtils'

//orden fijo de despliegue de los sistemas externos, sin importar el orden en que llegan del backend
const ORDEN_SISTEMAS_EXTERNOS = ['SPARK', 'EMOV']
const ordenarSyncStatuses = (syncStatuses) => (
    [...syncStatuses].sort((a, b) => (
        ORDEN_SISTEMAS_EXTERNOS.indexOf(a.targetSystem) - ORDEN_SISTEMAS_EXTERNOS.indexOf(b.targetSystem)
    ))
)

//tarjeta de detalle de una factura cobrada (InvoiceDto): datos del cliente, lineas de detalle y estado de sincronizacion
//se usa tanto colgada de un AtmCharge como en la lista de facturas adicionales por parkingTicketNumber
const TarjetaFactura = ({ factura }) => {
    const [syncSeleccionado, setSyncSeleccionado] = useState(null)
    const { invoice, createdBy, details, syncStatuses } = factura
    const totalFactura = details.reduce((suma, detalle) => suma + detalle.totalWithTaxes, 0)

    return (
        <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-3 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <FileText size={16} className="text-blue-600 shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">
                            Factura N° {invoice.sequenceNumber ?? '—'}
                        </p>
                        <p className="text-xs text-gray-500">{formatearFecha(invoice.billingAt)}</p>
                    </div>
                </div>
                <span className="text-sm font-bold text-blue-700 shrink-0">{formatearMoneda(totalFactura)}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600">
                <span className="col-span-2 truncate"><strong>Cliente:</strong> {invoice.clientName}</span>
                <span><strong>Identificación:</strong> {invoice.clientIdType} {invoice.clientIdNumber}</span>
                <span><strong>Teléfono:</strong> {invoice.billingPhone || '—'}</span>
                <span className="col-span-2 truncate"><strong>Dirección:</strong> {invoice.billingAddress || '—'}</span>
                <span className="col-span-2 truncate"><strong>Email:</strong> {invoice.billingEmail || '—'}</span>
                <span><strong>Placa:</strong> {invoice.plate}</span>
                <span><strong>Minutos:</strong> {invoice.minuteQuantity}</span>
                <span className="col-span-2"><strong>Parqueadero:</strong> {invoice.parkingName} ({invoice.externalParkingId})</span>
                <span><strong>Método de pago:</strong> {invoice.paymentMethodCode}</span>
                {invoice.sessionId && <span><strong>Sesión:</strong> {invoice.sessionId}</span>}
                {invoice.authNumber && <span><strong>N° Autorización:</strong> {invoice.authNumber}</span>}
                <span className="col-span-2 flex items-center gap-1">
                    <strong className="shrink-0">Transacción:</strong>
                    <span className="font-mono truncate">{invoice.transactionId}</span>
                    <BotonCopiar valor={invoice.transactionId} />
                </span>
            </div>

            {details.length > 0 && (
                <div className="overflow-x-auto rounded-md border border-blue-100">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-blue-100/70 text-blue-800">
                            <tr>
                                <th className="px-2 py-1.5 font-semibold">Descripción</th>
                                <th className="px-2 py-1.5 font-semibold text-right">Cant.</th>
                                <th className="px-2 py-1.5 font-semibold text-right">P. Unit.</th>
                                <th className="px-2 py-1.5 font-semibold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((detalle, index) => (
                                <tr key={index} className="border-t border-blue-100">
                                    <td className="px-2 py-1.5">
                                        <p className="text-gray-700">{detalle.description}</p>
                                        <p className="text-[10px] text-gray-400">{detalle.mainCode} · {detalle.auxiliarCode}</p>
                                    </td>
                                    <td className="px-2 py-1.5 text-right text-gray-600">{detalle.quantity}</td>
                                    <td className="px-2 py-1.5 text-right text-gray-600">{formatearMoneda(detalle.unitPrice)}</td>
                                    <td className="px-2 py-1.5 text-right font-semibold text-gray-700">{formatearMoneda(detalle.totalWithTaxes)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-2 flex-wrap">
                    {ordenarSyncStatuses(syncStatuses).map((sync) => (
                        <BadgeSyncStatus key={sync.id} syncStatus={sync} onClick={setSyncSeleccionado} />
                    ))}
                </div>
                <span className="text-[11px] text-gray-400">Creado por {createdBy}</span>
            </div>

            {syncSeleccionado && (
                <ModalDetalleSincronizacion syncStatus={syncSeleccionado} onClose={() => setSyncSeleccionado(null)} />
            )}
        </div>
    )
}

export default TarjetaFactura
