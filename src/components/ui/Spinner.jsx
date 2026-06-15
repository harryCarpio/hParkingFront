//cargando que se mostrara en todo el sistema

import React from 'react'

const Spinner = ({ texto = "Cargando..." }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full py-8">
            <div className="w-10 h-10 border-4 border-slate-500 border-t-transparent 
                    rounded-full animate-spin mb-3">
            </div>
            <p className="text-slate-500 font-semibold text-sm">{texto}</p>
        </div>
    )
}

export default Spinner