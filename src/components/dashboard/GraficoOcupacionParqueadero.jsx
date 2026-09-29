import React from 'react'
import {
    Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import TarjetaGrafico from '../kpis/TarjetaGrafico'
import { formatearEntero, formatearPorcentaje, viz } from '../kpis/vizTokens'
import { formatearFechaHoraLocal, formatearMarcaTiempo } from './tiempoLocal'

/**
 * Ocupacion de UN parqueadero a lo largo del rango, como pequenio multiplo: todos los
 * parqueaderos comparten el eje 0-100% para que dos tarjetas vecinas se puedan comparar a ojo.
 *
 * Se grafica solo la ocupacion. La disponibilidad es su complemento exacto (suman 100%), asi que
 * dibujar ambas duplicaba la informacion y ademas cruzaba dos areas en rojo y verde.
 */
const TooltipOcupacion = ({ active, payload, totalCapacity, multiplesDias }) => {
    if (!active || !payload?.length) return null
    const punto = payload[0].payload
    return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-xs">
            <p className="text-sm font-semibold text-slate-800 tabular-nums">{formatearPorcentaje(punto.occupancyRate, 0)}</p>
            <p className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                <span className="inline-block w-3 h-0.5 rounded" style={{ backgroundColor: viz.serie1 }} />
                Ocupación promedio
            </p>
            <p className="text-gray-400 mt-1">
                {formatearEntero(Math.round(punto.avgOccupied ?? 0))} ocupados ·
                {' '}{formatearEntero(Math.round(punto.avgAvailable ?? 0))} libres de {formatearEntero(totalCapacity)}
            </p>
            <p className="text-gray-400">{formatearFechaHoraLocal(punto.bucketStartTs, multiplesDias)}</p>
        </div>
    )
}

/** Resume la serie en las dos cifras que un encargado busca primero: cuando se lleno y cuanto en promedio. */
const resumirSerie = (points = []) => {
    const conDato = points.filter((p) => p.occupancyRate !== null && p.occupancyRate !== undefined)
    if (conDato.length === 0) return { pico: null, promedio: null }
    const pico = conDato.reduce((max, p) => (p.occupancyRate > max.occupancyRate ? p : max), conDato[0])
    const promedio = conDato.reduce((suma, p) => suma + Number(p.occupancyRate), 0) / conDato.length
    return { pico, promedio }
}

const GraficoOcupacionParqueadero = ({ parkingName, totalCapacity, points = [], multiplesDias }) => {
    const { pico, promedio } = resumirSerie(points)

    return (
        <TarjetaGrafico
            titulo={parkingName}
            subtitulo={pico
                ? `Pico ${formatearPorcentaje(pico.occupancyRate, 0)} · ${formatearFechaHoraLocal(pico.bucketStartTs, multiplesDias)}`
                + ` · promedio ${formatearPorcentaje(promedio, 0)} · capacidad ${formatearEntero(totalCapacity)}`
                : `Capacidad ${formatearEntero(totalCapacity)} espacios`}
            columnas={[
                { clave: 'bucketStartTs', titulo: 'Hora', formato: (f) => formatearFechaHoraLocal(f.bucketStartTs, multiplesDias) },
                { clave: 'occupancyRate', titulo: 'Ocupación', alinear: 'derecha', formato: (f) => formatearPorcentaje(f.occupancyRate, 0) },
                { clave: 'avgOccupied', titulo: 'Ocupados', alinear: 'derecha', formato: (f) => formatearEntero(Math.round(f.avgOccupied ?? 0)) },
                { clave: 'avgAvailable', titulo: 'Libres', alinear: 'derecha', formato: (f) => formatearEntero(Math.round(f.avgAvailable ?? 0)) },
            ]}
            filas={points}
        >
            {points.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-10 text-center">Sin registros de ocupación en el rango</p>
            ) : (
                <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={points} margin={{ top: 18, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke={viz.rejilla} vertical={false} />
                        <XAxis
                            dataKey="bucketStartTs"
                            type="number"
                            scale="time"
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={(ts) => formatearMarcaTiempo(ts, multiplesDias)}
                            tick={{ fontSize: 11, fill: viz.tintaTenue }}
                            tickLine={false}
                            axisLine={{ stroke: viz.ejeBase }}
                            minTickGap={28}
                        />
                        <YAxis
                            domain={[0, 1]}
                            ticks={[0, 0.5, 1]}
                            tickFormatter={(v) => formatearPorcentaje(v, 0)}
                            tick={{ fontSize: 11, fill: viz.tintaTenue }}
                            tickLine={false}
                            axisLine={false}
                            width={40}
                        />
                        <Tooltip
                            content={<TooltipOcupacion totalCapacity={totalCapacity} multiplesDias={multiplesDias} />}
                            cursor={{ stroke: viz.ejeBase, strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="occupancyRate"
                            stroke={viz.serie1}
                            strokeWidth={2}
                            fill={viz.serie1Lavado}
                            dot={false}
                            activeDot={{ r: 5, fill: viz.serie1, stroke: viz.superficie, strokeWidth: 2 }}
                            isAnimationActive={false}
                        />
                        {/* unica etiqueta directa: el pico, que es lo que el subtitulo tambien nombra */}
                        {pico && (
                            <ReferenceDot
                                x={pico.bucketStartTs}
                                y={pico.occupancyRate}
                                r={4}
                                fill={viz.serie1}
                                stroke={viz.superficie}
                                strokeWidth={2}
                                label={{
                                    value: `Pico ${formatearPorcentaje(pico.occupancyRate, 0)}`,
                                    position: 'top',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    fill: viz.tintaSecundaria,
                                }}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </TarjetaGrafico>
    )
}

export default GraficoOcupacionParqueadero
