import React from 'react'
import {
    Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import {
    formatearEntero, formatearHora, formatearMoneda, formatearMonedaCompacta, viz,
} from './vizTokens'

const TooltipHora = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const punto = payload[0].payload
    return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-xs">
            <p className="text-sm font-semibold text-slate-800 tabular-nums">{formatearMoneda(punto.monto)}</p>
            <p className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                <span className="inline-block w-3 h-0.5 rounded" style={{ backgroundColor: viz.serie1 }} />
                Facturado
            </p>
            <p className="text-gray-400 mt-1">{formatearHora(punto.hora)} — {formatearHora((punto.hora + 1) % 24)}</p>
            <p className="text-gray-400">{formatearEntero(punto.facturas)} facturas</p>
        </div>
    )
}

/**
 * Columnas por hora del dia (0-23, hora de Ecuador), acumuladas sobre todo el rango.
 *
 * Se rotula unicamente la hora pico: 24 cifras sobre 24 columnas serian ruido. El resto de
 * valores viven en el eje, en el tooltip y en la vista de tabla, asi que nada queda inaccesible.
 */
const GraficoActividadPorHora = ({ puntos = [] }) => {
    const montoMaximo = Math.max(...puntos.map((p) => Number(p.monto) || 0), 0)

    const EtiquetaPico = ({ x, y, width, value }) => {
        if (montoMaximo === 0 || Number(value) !== montoMaximo || x === undefined) return null
        return (
            <text
                x={x + width / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill={viz.tintaSecundaria}
            >
                {formatearMonedaCompacta(value)}
            </text>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={puntos} margin={{ top: 20, right: 8, left: 4, bottom: 4 }}>
                <CartesianGrid stroke={viz.rejilla} vertical={false} />
                <XAxis
                    dataKey="hora"
                    tickFormatter={(hora) => String(hora).padStart(2, '0')}
                    tick={{ fontSize: 10, fill: viz.tintaTenue }}
                    tickLine={false}
                    axisLine={{ stroke: viz.ejeBase }}
                    interval={1}
                />
                <YAxis
                    tickFormatter={formatearMonedaCompacta}
                    tick={{ fontSize: 11, fill: viz.tintaTenue }}
                    tickLine={false}
                    axisLine={false}
                    width={56}
                />
                <Tooltip content={<TooltipHora />} cursor={{ fill: 'rgba(11,11,11,0.04)' }} />
                <Bar dataKey="monto" fill={viz.serie1} radius={[4, 4, 0, 0]} maxBarSize={24}>
                    <LabelList dataKey="monto" content={EtiquetaPico} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

export default GraficoActividadPorHora
