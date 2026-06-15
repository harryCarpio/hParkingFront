import React from 'react'
import { useDiccionarioDatos } from '../../hooks/useDiccionarioDatos'

const DiccionarioDatosSelect = ({ servicioOpciones, opcionesQuemadas, name, value, onChange, label,
    placeHolder = "Seleccione una opción", disable = false, required = false, onLoadingChange
}) => { //opcionesquemadas sirve por si falla y se llama al diccionario que se tiene en el mismo servicio de diccionariodatos

    const {options,loading} = useDiccionarioDatos(servicioOpciones,opcionesQuemadas,onLoadingChange)


    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-600">
                    {label}
                    {required && <span className="text-gray-600 ml-1">*</span>}
                </label>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disable}
                required={required}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50
             focus:outline-none focus:ring-2 focus:ring-blue-900 min-h-[42px]
             disabled:opacity-50 disabled:cursor-not-allowed transition duration-200">
                <option value="">
                    {placeHolder}
                </option>
                {options.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                        {opt.label}
                    </option>
                ))}

            </select>
        </div>
    )
}

export default DiccionarioDatosSelect