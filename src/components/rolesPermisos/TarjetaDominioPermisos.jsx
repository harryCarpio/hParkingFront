import React from 'react'
import { ShieldAlert } from 'lucide-react'
import { comodinQueCubre } from './permisosUtils'

//interruptor simple (el Toggle de ui/ esta ligado a valores ACTIVE/INACTIVE)
const Interruptor = ({ activo, onCambiar, disabled, etiqueta }) => (
  <button
    type="button"
    role="switch"
    aria-checked={activo}
    aria-label={etiqueta}
    disabled={disabled}
    onClick={onCambiar}
    className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 cursor-pointer
      ${activo ? 'bg-celestevr' : 'bg-gray-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
      ${activo ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
)

//tarjeta de un dominio (ej. "invoice"): comodin del dominio + un checkbox por permiso del catalogo
const TarjetaDominioPermisos = ({ dominio, items, otorgados, onAlternarPermiso, onAlternarDominio, disabled }) => {
  const comodinDominio = `${dominio}:*`
  const dominioCompleto = otorgados.includes(comodinDominio)

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-700 font-mono">{dominio}</h3>
        <label className="flex items-center gap-2 text-xs text-gray-500">
          Todo el dominio <code className="text-gray-600">{comodinDominio}</code>
          <Interruptor activo={dominioCompleto} disabled={disabled} etiqueta={`Todo el dominio ${comodinDominio}`}
            onCambiar={() => onAlternarDominio(dominio, items)} />
        </label>
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((item) => {
          const cubiertoPor = comodinQueCubre(item.permission, otorgados)
          const marcado = Boolean(cubiertoPor) || otorgados.includes(item.permission)
          return (
            <li key={item.permission}>
              <label className={`flex items-start gap-3 text-sm ${cubiertoPor || disabled ? 'cursor-default' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  className="mt-0.5 accent-celestevr"
                  checked={marcado}
                  disabled={disabled || Boolean(cubiertoPor)}
                  onChange={() => onAlternarPermiso(item.permission)}
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-gray-800 flex items-center gap-2 flex-wrap">
                    {item.description}
                    {item.sensitive && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[11px] font-semibold">
                        <ShieldAlert size={12} /> Sensible
                      </span>
                    )}
                  </span>
                  <code className="text-xs text-gray-400">
                    {item.permission}{cubiertoPor && ` · incluido por ${cubiertoPor}`}
                  </code>
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default TarjetaDominioPermisos
