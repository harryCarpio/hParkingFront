import React from 'react'
import { CreditCard } from 'lucide-react'
import EstadoPill from '../ui/EstadoPill'
import BotonCopiar from '../ui/BotonCopiar'
import TarjetaFactura from './TarjetaFactura'
import { formatearFecha, formatearMoneda } from './usoDetalleUtils'

//tarjeta de un cobro (AtmCharge): monto recibido/vuelto, estado del pago, y la factura asociada si charged = true
const TarjetaCobro = ({ cobro }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
                <CreditCard size={15} className="text-slate-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-700">{formatearMoneda(cobro.receivedAmount)}</span>
                {cobro.returnedAmount > 0 && (
                    <span className="text-xs text-gray-400">(vuelto {formatearMoneda(cobro.returnedAmount)})</span>
                )}
            </div>
            <EstadoPill estado={cobro.status} />
        </div>

        {cobro.message && <p className="text-xs text-gray-500">{cobro.message}</p>}

        <div className="flex items-center justify-between text-[11px] text-gray-400 flex-wrap gap-1">
            <span className="flex items-center gap-1 font-mono truncate">
                tx: {cobro.tx}
                <BotonCopiar valor={cobro.tx} />
            </span>
            <span>{formatearFecha(cobro.createdAt)}</span>
        </div>

        {cobro.invoice ? (
            <TarjetaFactura factura={cobro.invoice} />
        ) : (
            <p className="text-xs text-gray-400 italic bg-gray-50 rounded-md px-3 py-2 text-center">
                Sin factura asociada
            </p>
        )}
    </div>
)

export default TarjetaCobro
