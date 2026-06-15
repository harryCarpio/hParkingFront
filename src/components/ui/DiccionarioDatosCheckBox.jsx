import React from 'react'
import { useDiccionarioDatos } from '../../hooks/useDiccionarioDatos'

const DiccionarioDatosCheckBox = ({ servicioOpciones, opcionesQuemadas, value = [], onChange, label,
    disable = false, required = false, onLoadingChange }) => {
    const { options, loading } = useDiccionarioDatos(servicioOpciones, opcionesQuemadas, onLoadingChange)
    const handleCheck = (key) => {
        if (disable) return;
        const yaExiste = value.includes(key);
        const nuevo = yaExiste
            ? value.filter((a) => a !== key)   
            : [...value, key];                  
        onChange(nuevo);
    };


    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-600">
                    {label}
                    {required && <span className="text-gray-600 ml-1">*</span>}
                </label>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">

                {options.map((opt) => (
                    <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value.includes(opt.key)}
                            onChange={() => handleCheck(opt.key)}
                            disabled={disable}
                            className="w-4 h-4 accent-celestevr disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className=" text-gray-700">{opt.label}</span>
                    </label>
                ))}

            </div>

            {required && value.length === 0 && (
                <p className="text-xs text-red-500">Seleccione al menos un rol</p>
            )}
        </div>
    )
}

export default DiccionarioDatosCheckBox