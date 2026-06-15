import { X, AlertTriangle } from 'lucide-react'
import React from 'react'
import Button from './Button'

const ModalConfirmacion = ({ title = "Eliminar", subtitle, mensaje, subMensaje,onConfirmar, onCancelar, cargando, children }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 "
            onClick={onCancelar}>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}>

                {/* Encabezado */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div>
                        {subtitle && <p className="text-xs text-gray-400 mb-0.5">{subtitle}</p>}
                        <h2 className="text-base font-semibold text-slate-700">{title}</h2>
                    </div>
                    <button
                        onClick={onCancelar}
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="Cerrar"
                    >
                        <X size={20} strokeWidth={4} />
                    </button>
                </div>

                {/* Cuerpo */}
                <div className="px-6 py-5 flex flex-col items-center gap-3 overflow-y-auto flex-1">
                    <AlertTriangle size={48} className="text-orange-400" strokeWidth={1.5} />
                    <p className="text-sm font-semibold text-gray-700 text-center">{mensaje}</p>
                    {subMensaje && <p className="text-sm text-gray-700 text-center">{subMensaje}</p>}                    
                    {/* info extra opcional */}
                    {children && (
                        <div className="w-full bg-gray-50 rounded-lg px-4 py-3 flex flex-col gap-1 text-xs text-gray-600 border border-gray-200">
                            {children}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0">
                <Button texto={"Eliminar"} variante="danger" tamanio="md" onClick={onConfirmar} disabled={cargando} cargando={cargando} />
                    <Button texto="Cancelar" variante="secondary" tamanio="md" onClick={onCancelar} disabled={cargando} />
                    
                </div>

            </div>
        </div>
    )
}

export default ModalConfirmacion