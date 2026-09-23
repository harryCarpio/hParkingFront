import React from 'react'
import { Check } from 'lucide-react'
import Input from '../ui/Input'
import { PRESETS, aFechaIso } from './rangosFecha'

/**
 * Fila unica de filtros, por encima de todo lo que condiciona: presets primero (nadie pelea con
 * un calendario para pedir "ultimos 30 dias") y el rango a medida detras de una divisoria.
 * Todo el tablero se recalcula contra la misma porcion, asi que las cifras siempre concuerdan.
 */
const FiltroRangoFechas = ({ presetActivo, desde, hasta, onPreset, onDesdeChange, onHastaChange }) => (
    <div className="flex items-end gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
            {PRESETS.map((preset) => {
                const activo = presetActivo === preset.id
                return (
                    <button
                        key={preset.id}
                        type="button"
                        onClick={() => onPreset(preset)}
                        className={`flex items-center gap-1.5 text-xs rounded-lg px-3 py-2 border transition-colors
                            ${activo
                                ? 'border-brand text-brand font-semibold bg-brand/5'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                        aria-pressed={activo}
                    >
                        {/* la seleccion se marca con un check, no solo con color */}
                        {activo && <Check size={16} strokeWidth={3} />}
                        {preset.etiqueta}
                    </button>
                )
            })}
        </div>

        <div className="flex items-end gap-3 flex-wrap border-l border-gray-200 pl-3">
            <Input
                label="Desde"
                type="date"
                name="desde"
                value={desde}
                onChange={(e) => onDesdeChange(e.target.value)}
                max={hasta}
            />
            <Input
                label="Hasta"
                type="date"
                name="hasta"
                value={hasta}
                onChange={(e) => onHastaChange(e.target.value)}
                min={desde}
                max={aFechaIso(new Date())}
            />
        </div>
    </div>
)

export default FiltroRangoFechas
