import React, { useId, useState } from 'react'
import { BarChart3, TableProperties } from 'lucide-react'

/**
 * Contenedor de un grafico: titulo, subtitulo y un interruptor grafico/tabla.
 *
 * La vista de tabla no es un extra: es el gemelo accesible de cada grafico. Garantiza que
 * ningun valor dependa del color ni del hover para poder leerse, que es la razon por la que
 * los graficos pueden permitirse etiquetar solo los puntos que importan.
 *
 * @param {Array}    columnas  definicion de la tabla: [{ clave, titulo, alinear, formato }]
 * @param {Array}    filas     datos crudos de la serie; se muestran tal cual en la tabla
 */
const TarjetaGrafico = ({ titulo, subtitulo, columnas = [], filas = [], children }) => {
    const [verTabla, setVerTabla] = useState(false)
    const idTabla = useId()
    const hayTabla = columnas.length > 0

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-700">{titulo}</h3>
                    {subtitulo && <p className="text-xs text-gray-400 mt-0.5">{subtitulo}</p>}
                </div>
                {hayTabla && (
                    <button
                        type="button"
                        onClick={() => setVerTabla((previo) => !previo)}
                        className="shrink-0 flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand
                            border border-gray-200 rounded-lg px-2 py-1 transition-colors"
                        aria-expanded={verTabla}
                        aria-controls={idTabla}
                    >
                        {verTabla ? <BarChart3 size={14} /> : <TableProperties size={14} />}
                        {verTabla ? 'Ver gráfico' : 'Ver tabla'}
                    </button>
                )}
            </div>

            {verTabla && hayTabla ? (
                <div id={idTabla} className="overflow-x-auto overflow-y-auto max-h-72 rounded-md border border-gray-100">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-500 sticky top-0">
                            <tr>
                                {columnas.map((columna) => (
                                    <th
                                        key={columna.clave}
                                        scope="col"
                                        className={`px-3 py-2 font-semibold ${columna.alinear === 'derecha' ? 'text-right' : ''}`}
                                    >
                                        {columna.titulo}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filas.map((fila, indice) => (
                                <tr key={indice} className="border-t border-gray-100">
                                    {columnas.map((columna) => (
                                        <td
                                            key={columna.clave}
                                            //tabular-nums SI aplica aqui: son columnas de numeros que deben alinearse
                                            className={`px-3 py-1.5 text-gray-700 ${columna.alinear === 'derecha' ? 'text-right tabular-nums' : ''}`}
                                        >
                                            {columna.formato ? columna.formato(fila) : fila[columna.clave]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                children
            )}
        </div>
    )
}

export default TarjetaGrafico
