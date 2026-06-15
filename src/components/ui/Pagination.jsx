import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { temas } from '../../styles/temas'

const OPCIONES_POR_PAGINA = [1, 5, 10, 20, 30, 50]

const Pagination = ({
    paginaActual = 0,
    totalPaginas = 1,
    totalElementos = 0,
    porPagina = 10,
    onCambiarPagina,
    onCambiarPorPagina,
}) => {

    const startPage = Math.max(0, paginaActual - 2)
    const endPage = Math.min(totalPaginas - 1, paginaActual + 2)
    const paginas = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

    return (
        <div className="flex justify-center items-center flex-wrap gap-3 mt-4 text-sm text-gray-600">


            <select
                value={porPagina}
                onChange={(e) => { onCambiarPorPagina(Number(e.target.value)) }}
                className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white
                    cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
            >
                {OPCIONES_POR_PAGINA.map(op => (
                    <option key={op} value={op}>{op} por página</option>
                ))}
            </select>

            {/* Total registros */}
            {totalElementos === 0
                ? <span className="text-red-500 font-medium">Sin registros</span>
                : <span className="font-medium">{totalElementos} registro(s) encontrado(s)</span>
            }

            {/* Navegación */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onCambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 0}
                    className={temas.paginador.button}
                >
                    <ChevronLeft size={14} />
                </button>

                <div className="flex items-center gap-1 mx-1">
                    {paginas.map((num) => (
                        <button
                            key={num}
                            onClick={() => onCambiarPagina(num)}
                            className={`${temas.paginador.numberButton}
                                    ${paginaActual === num
                                    ? temas.paginador.active
                                    : temas.paginador.button}
                                    `}
                        >
                            {num + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onCambiarPagina(paginaActual + 1)}
                    disabled={paginaActual >= totalPaginas - 1}
                    className={temas.paginador.button}
                >
                    <ChevronRight size={14} />
                </button>
            </div>

            <span className="font-medium">
                Página {paginaActual + 1} de {Math.max(1, totalPaginas)}
            </span>
        </div>
    )
}

export default Pagination