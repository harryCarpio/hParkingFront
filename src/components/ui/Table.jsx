import React from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import Spinner from './Spinner'
import { temas } from '../../styles/temas'

const Table = ({ columnas = [], datos = [], ordenamiento = null, onOrdenar = null }) => {

    if (!datos.length) return (
        <div className="text-center py-10 text-gray-400 text-sm">
            No se encontraron registros
        </div>
    )

    const iconoOrden = (col) => {
        if (ordenamiento?.campo !== col.key) return <ArrowUpDown size={14} className="opacity-40" />
        return ordenamiento.direccion === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="w-full text-sm text-left ">
                <thead className={`${temas.tabla.encabezado} sticky top-0`}>
                    <tr>
                        {columnas.map((col) => (
                            <th key={col.key} className="px-4 py-3 font-semibold">
                                {col.ordenable ? (
                                    <button
                                        type="button"
                                        onClick={() => onOrdenar?.(col.key)}
                                        className="flex items-center gap-1 hover:opacity-80 cursor-pointer"
                                    >
                                        {col.label}
                                        {iconoOrden(col)}
                                    </button>
                                ) : (
                                    col.label
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {datos.map((fila, index) => (
                        <tr key={fila.id ?? index}
                            className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                            {columnas.map((col) => (
                                <td key={col.key} className="px-4 py-3 text-gray-700">
                                    {col.render ? col.render(fila) : fila[col.key] ?? "—"}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table



