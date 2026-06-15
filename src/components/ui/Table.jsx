import React from 'react'
import Spinner from './Spinner'

const Table = ({ columnas = [], datos = []}) => {  

    if (!datos.length) return (
        <div className="text-center py-10 text-gray-400 text-sm">
            No se encontraron registros
        </div>
    )
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="w-full text-sm text-left ">
                <thead className="bg-slate-700 text-white sticky top-0">
                    <tr>
                        {columnas.map((col) => (
                            <th key={col.key} className="px-4 py-3 font-semibold">
                                {col.label}
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



