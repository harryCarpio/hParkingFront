import React, { useState } from 'react'
import { ChevronDown, Car } from 'lucide-react'
import EstadoPill from '../ui/EstadoPill'
import BotonCopiar from '../ui/BotonCopiar'
import TarjetaCobro from './TarjetaCobro'
import { formatearFecha, formatearMoneda } from './usoDetalleUtils'

//tarjeta acordeon de un AtmCheckout: encabezado siempre visible (placa/entrada/estado), cuerpo con
//servicios y cobros que se expande bajo demanda para no saturar la vista cuando hay varios checkouts
const TarjetaCheckout = ({ checkout, abiertoInicial = false }) => {
    const [abierto, setAbierto] = useState(abiertoInicial)

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <button
                type="button"
                onClick={() => setAbierto((prev) => !prev)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <Car size={18} className="text-slate-500 shrink-0" />
                    <div className="min-w-0 text-left">
                        <p className="text-sm font-semibold text-slate-700 truncate">{checkout.plate}</p>
                        <p className="text-xs text-gray-400 truncate">
                            {formatearFecha(checkout.entry)} · {checkout.duration}
                            {checkout.ref && <> · Ref {checkout.ref}</>}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {checkout.grace && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold whitespace-nowrap">
                            Cortesía {checkout.graceMinutes}min
                        </span>
                    )}
                    <EstadoPill estado={checkout.status} />
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${abierto ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {abierto && (
                <div className="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between text-xs text-gray-400 flex-wrap gap-1">
                        <span className="flex items-center gap-1 font-mono truncate">
                            tx: {checkout.tx}
                            <BotonCopiar valor={checkout.tx} />
                        </span>
                        {checkout.rounding !== 0 && <span>Redondeo: {formatearMoneda(checkout.rounding)}</span>}
                    </div>

                    {checkout.services.length > 0 && (
                        <div className="overflow-x-auto rounded-md border border-gray-200">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="px-2 py-1.5 font-semibold">Servicio</th>
                                        <th className="px-2 py-1.5 font-semibold">Clase</th>
                                        <th className="px-2 py-1.5 font-semibold text-right">Precio</th>
                                        <th className="px-2 py-1.5 font-semibold text-right">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkout.services.map((servicio) => (
                                        <tr key={servicio.id} className="border-t border-gray-100">
                                            <td className="px-2 py-1.5 text-gray-700">{servicio.description}</td>
                                            <td className="px-2 py-1.5 text-gray-500">{servicio.clazz}</td>
                                            <td className="px-2 py-1.5 text-right text-gray-700 font-semibold">{formatearMoneda(servicio.price)}</td>
                                            <td className="px-2 py-1.5 text-right"><EstadoPill estado={servicio.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cobros</p>
                        {checkout.charges.length > 0 ? (
                            checkout.charges.map((cobro) => (
                                <TarjetaCobro key={cobro.id} cobro={cobro} />
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 italic">Sin cobros registrados</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TarjetaCheckout
