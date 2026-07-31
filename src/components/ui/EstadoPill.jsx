import React from 'react'

//grupos de estados (backend, en ingles) agrupados por significado para colorear el pill
const ESTADOS_VERDES = ['PAID', 'SUCCESS', 'SUCCEEDED', 'ACTIVE', 'COMPLETED', 'PAYED']
const ESTADOS_ROJOS = ['FAILED', 'CANCELLED', 'ERROR', 'DEAD', 'EXPIRED', 'INACTIVE']
const ESTADOS_AMBAR = ['PENDING', 'IN_PROGRESS']

const colorPorEstado = (estado) => {
    if (ESTADOS_VERDES.includes(estado)) return 'bg-green-50 text-green-700'
    if (ESTADOS_ROJOS.includes(estado)) return 'bg-red-50 text-red-700'
    if (ESTADOS_AMBAR.includes(estado)) return 'bg-amber-50 text-amber-700'
    return 'bg-gray-100 text-gray-600'
}

//convierte un estado tipo ENUM_VALUE en texto legible: "Enum value"
const formatearEstado = (estado) => {
    if (!estado) return '—'
    const texto = estado.replaceAll('_', ' ').toLowerCase()
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}

//pill de estado generico y de solo lectura: colorea segun el significado del estado recibido (exito/error/pendiente/otro)
const EstadoPill = ({ estado }) => (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${colorPorEstado(estado)}`}>
        {formatearEstado(estado)}
    </span>
)

export default EstadoPill
