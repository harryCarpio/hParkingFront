import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

//boton pequeño para copiar un valor (tx, ids largos) al portapapeles, con feedback visual momentaneo
const BotonCopiar = ({ valor }) => {
    const [copiado, setCopiado] = useState(false)

    if (!valor) return null

    const copiar = async (e) => {
        e.stopPropagation()
        try {
            await navigator.clipboard.writeText(valor)
            setCopiado(true)
            setTimeout(() => setCopiado(false), 1500)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <button
            type="button"
            onClick={copiar}
            title="Copiar"
            className="text-gray-400 hover:text-slate-600 transition shrink-0 cursor-pointer"
        >
            {copiado ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
        </button>
    )
}

export default BotonCopiar
