import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

//panel lateral deslizante (drawer) anclado al lado derecho, para vistas de detalle de solo lectura
const PanelLateral = ({ title, subtitle, onClose, children, ancho = "max-w-xl" }) => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        //arranca en translate-x-full (fuera de pantalla) y anima al frame siguiente hacia su posicion final
        const id = requestAnimationFrame(() => setVisible(true))
        return () => cancelAnimationFrame(id)
    }, [])

    const cerrar = () => {
        setVisible(false)
        setTimeout(onClose, 200)
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end"
            onClick={cerrar}>
            <div
                className={`bg-white shadow-2xl w-full ${ancho} h-full flex flex-col
                    transition-transform duration-200 ease-out
                    ${visible ? "translate-x-0" : "translate-x-full"}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div className="min-w-0">
                        {subtitle && (<p className="text-xs text-gray-400 mb-0.5">{subtitle}</p>)}
                        <h2 className="text-base font-semibold text-slate-700 truncate">{title}</h2>
                    </div>
                    <button
                        onClick={cerrar}
                        className="text-gray-400 hover:text-gray-600 transition shrink-0"
                        aria-label="Cerrar"
                    >
                        <X size={20} strokeWidth={4} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default PanelLateral
