import React from 'react'
import Button from './Button'
import { X } from 'lucide-react'
import { temas } from '../../styles/temas'

const ModalWrapper = ({
    title,
    subtitle,
    onClose,
    onSubmit,
    cargando,
    submitText = "Guardar",
    children,
    disableSubmit = false,
    errorMensaje = null,

}) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}>
                {/*Encabezado*/}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div>
                        {subtitle && (<p className="text-xs text-gray-400 mb-0.5">{subtitle}</p>)}
                        <h2 className="text-base font-semibold text-slate-700">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition text-lg leading-none"
                        aria-label="Cerrar"
                    >
                        <X size={20} strokeWidth={4} />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col min-h-0 flex-1">
                    {/*CUERPO */}
                    <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto flex-1 ">
                        {children}
                    </div>
                    {errorMensaje && (
                        <div className="px-6 pb-2">
                            <p className={temas.texto.textoErrorFormulario}>
                                {errorMensaje}
                            </p>
                        </div>
                    )}

                    {/*FOOTER*/}
                    <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0">
                        <Button
                            texto={submitText}
                            type="submit"
                            variante="primary"
                            tamanio="md"
                            cargando={cargando}
                            disabled={disableSubmit}
                        >

                        </Button>
                        <Button
                            texto="Cancelar"
                            variante="secondary"
                            tamanio="md"
                            onClick={onClose}
                            disabled={cargando}>

                        </Button>

                    </div>


                </form>
            </div>

        </div>
    )
}

export default ModalWrapper