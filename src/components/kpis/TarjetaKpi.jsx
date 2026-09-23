import React from 'react'

/**
 * Tarjeta de cifra (stat tile): etiqueta en minuscula, valor en semibold y una pista opcional.
 * El valor usa las cifras proporcionales por defecto — `tabular-nums` solo tiene sentido en
 * columnas que deben alinearse verticalmente, y aqui haria ver flojo un numero como "121".
 *
 * Se usa cuando el dato es un numero suelto: un grafico de una sola barra seria peor.
 */
const TarjetaKpi = ({ etiqueta, valor, pista, icono }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
            {icono && <span className="text-gray-400 shrink-0">{icono}</span>}
            <p className="text-xs text-gray-500">{etiqueta}</p>
        </div>
        <p className="text-2xl font-semibold text-slate-800 leading-tight">{valor}</p>
        {pista && <p className="text-[11px] text-gray-400">{pista}</p>}
    </div>
)

export default TarjetaKpi
