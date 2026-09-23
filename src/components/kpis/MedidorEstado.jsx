import React from 'react'
import { AlertTriangle, CheckCircle2, CircleAlert, OctagonAlert } from 'lucide-react'
import { formatearPorcentaje, viz } from './vizTokens'

//Cada severidad viaja siempre con icono Y etiqueta. En superficie clara "advertencia" (1.83:1) y
//"grave" (2.64:1) quedan bajo 3:1 de contraste a proposito: el par icono+texto es la mitigacion,
//de modo que el estado nunca se apoya solo en el color.
const SEVERIDADES = {
    bueno: { color: viz.estado.bueno, Icono: CheckCircle2 },
    advertencia: { color: viz.estado.advertencia, Icono: AlertTriangle },
    grave: { color: viz.estado.grave, Icono: CircleAlert },
    critico: { color: viz.estado.critico, Icono: OctagonAlert },
}

/**
 * Medidor de una razon contra un limite (tasa de sincronizacion, ocupacion de un parqueadero).
 * Es la forma correcta cuando el dato es "una proporcion respecto de un tope": un pastel de dos
 * porciones diria lo mismo peor.
 *
 * La pista no rellena del medidor es un tono mas claro de la propia rampa, para que el estado se
 * lea a lo largo de toda la barra.
 *
 * @param {string} severidad  clave de SEVERIDADES; determina color e icono
 * @param {number} tasa       0-1, o null cuando no hay nada que medir
 */
const MedidorEstado = ({ titulo, etiquetaEstado, severidad = 'bueno', tasa, detalle }) => {
    const { color, Icono } = SEVERIDADES[severidad] ?? SEVERIDADES.bueno
    const porcentaje = tasa === null || tasa === undefined ? 0 : Math.max(0, Math.min(1, Number(tasa))) * 100

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700 truncate">{titulo}</span>
                <span className="flex items-center gap-1 shrink-0">
                    <Icono size={14} style={{ color }} aria-hidden="true" />
                    <span className="text-xs font-semibold text-slate-700">{etiquetaEstado}</span>
                    <span className="text-xs text-gray-500 tabular-nums">{formatearPorcentaje(tasa)}</span>
                </span>
            </div>

            <div
                className="h-2 w-full rounded-full overflow-hidden"
                //pista: el mismo tono al 15%, no un gris ajeno a la rampa
                style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, #ffffff)` }}
                role="meter"
                aria-valuenow={Math.round(porcentaje)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${titulo}: ${etiquetaEstado}`}
            >
                <div className="h-full rounded-full transition-[width] duration-300"
                    style={{ width: `${porcentaje}%`, backgroundColor: color }} />
            </div>

            {detalle && <p className="text-[11px] text-gray-400">{detalle}</p>}
        </div>
    )
}

export default MedidorEstado
