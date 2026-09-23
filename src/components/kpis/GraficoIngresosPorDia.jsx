import React from 'react'
import {
    Area, AreaChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import {
    formatearDiaCorto, formatearDiaLargo, formatearEntero, formatearMoneda,
    formatearMonedaCompacta, viz,
} from './vizTokens'

//Serie unica: no lleva leyenda (el titulo de la tarjeta ya dice que se grafica) y el color
//del dato es siempre el slot 1, nunca el ranking ni el valor.
const TooltipIngresos = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const punto = payload[0].payload
    return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-xs">
            {/* el valor manda y el nombre de la serie va en segundo plano: aqui el lector ya sabe que mira */}
            <p className="text-sm font-semibold text-slate-800 tabular-nums">{formatearMoneda(punto.monto)}</p>
            <p className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                <span className="inline-block w-3 h-0.5 rounded" style={{ backgroundColor: viz.serie1 }} />
                Facturado
            </p>
            <p className="text-gray-400 mt-1">{formatearDiaLargo(punto.fecha)}</p>
            <p className="text-gray-400">{formatearEntero(punto.facturas)} facturas</p>
        </div>
    )
}

//solo se rotula el ultimo punto de la linea: una cifra sobre cada dia seria ruido y no se leeria
const EtiquetaFinal = ({ x, y, value, index, total }) => {
    if (index !== total - 1 || x === undefined) return null
    return (
        <text x={x} y={y - 10} textAnchor="end" fontSize={11} fill={viz.tintaSecundaria} fontWeight={600}>
            {formatearMonedaCompacta(value)}
        </text>
    )
}

const GraficoIngresosPorDia = ({ puntos = [] }) => (
    <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={puntos} margin={{ top: 16, right: 24, left: 4, bottom: 4 }}>
            <CartesianGrid stroke={viz.rejilla} vertical={false} />
            <XAxis
                dataKey="fecha"
                tickFormatter={formatearDiaCorto}
                tick={{ fontSize: 11, fill: viz.tintaTenue }}
                tickLine={false}
                axisLine={{ stroke: viz.ejeBase }}
                minTickGap={24}
            />
            <YAxis
                tickFormatter={formatearMonedaCompacta}
                tick={{ fontSize: 11, fill: viz.tintaTenue }}
                tickLine={false}
                axisLine={false}
                width={56}
            />
            {/* la cruz encuentra la fecha: el lector apunta a un dia, nunca a una linea de 2px */}
            <Tooltip content={<TooltipIngresos />} cursor={{ stroke: viz.ejeBase, strokeWidth: 1 }} />
            <Area
                type="monotone"
                dataKey="monto"
                stroke={viz.serie1}
                strokeWidth={2}
                fill={viz.serie1Lavado}
                //el anillo de 2px en color de superficie mantiene legible el punto donde cruza la linea
                activeDot={{ r: 5, fill: viz.serie1, stroke: viz.superficie, strokeWidth: 2 }}
                dot={false}
            >
                <LabelList
                    dataKey="monto"
                    content={(props) => <EtiquetaFinal {...props} total={puntos.length} />}
                />
            </Area>
        </AreaChart>
    </ResponsiveContainer>
)

export default GraficoIngresosPorDia
