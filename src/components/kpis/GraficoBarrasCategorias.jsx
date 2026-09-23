import React from 'react'
import {
    Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { viz } from './vizTokens'

/**
 * Barras horizontales para categorias nominales (parqueaderos, estados de uso).
 *
 * Todas las barras llevan el MISMO color (slot 1). Pintar cada barra de un tono distinto segun
 * su valor gastaria el canal de identidad en repetir lo que el largo de la barra ya dice; y
 * darle un color propio a cada categoria haria que filtrar repinte a las sobrevivientes.
 *
 * @param {Array}    datos       [{ etiqueta, valor, ...extras }]
 * @param {Function} formatoValor  como se muestra el valor en etiqueta directa y eje
 * @param {Function} renderTooltip contenido del tooltip, recibe la fila
 */
//definido fuera del componente: crearlo dentro del render lo remontaria en cada pintado
const TooltipBarra = ({ active, payload, renderTooltip }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-xs">
            {renderTooltip(payload[0].payload)}
        </div>
    )
}

const GraficoBarrasCategorias = ({ datos = [], formatoValor, renderTooltip, altura = 240, resaltarPrimera = false }) => {
    return (
        <ResponsiveContainer width="100%" height={altura}>
            <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 56, left: 4, bottom: 4 }}>
                <CartesianGrid stroke={viz.rejilla} horizontal={false} />
                <XAxis
                    type="number"
                    tickFormatter={formatoValor}
                    tick={{ fontSize: 11, fill: viz.tintaTenue }}
                    tickLine={false}
                    axisLine={{ stroke: viz.ejeBase }}
                />
                <YAxis
                    type="category"
                    dataKey="etiqueta"
                    tick={{ fontSize: 11, fill: viz.tintaSecundaria }}
                    tickLine={false}
                    axisLine={false}
                    width={130}
                />
                <Tooltip
                    content={<TooltipBarra renderTooltip={renderTooltip} />}
                    cursor={{ fill: 'rgba(11,11,11,0.04)' }}
                />
                <Bar
                    dataKey="valor"
                    fill={viz.serie1}
                    //extremo del dato redondeado, escuadrado contra la linea base
                    radius={[0, 4, 4, 0]}
                    maxBarSize={24}
                    //el hueco lo hace el propio espacio de la banda, sin bordes dibujados sobre la marca
                    barCategoryGap="30%"
                >
                    {datos.map((fila, indice) => (
                        <Cell
                            key={fila.etiqueta}
                            //enfasis opcional: la primera barra en el color de dato, el resto atenuado,
                            //cuando la historia es "esta de aqui" y no "compare todas"
                            fill={resaltarPrimera && indice > 0 ? 'rgba(42, 120, 214, 0.35)' : viz.serie1}
                        />
                    ))}
                    {/* valor en la punta: son pocas barras y el numero cabe fuera del extremo */}
                    <LabelList
                        dataKey="valor"
                        position="right"
                        formatter={formatoValor}
                        style={{ fill: viz.tintaSecundaria, fontSize: 11, fontWeight: 600 }}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

export default GraficoBarrasCategorias
