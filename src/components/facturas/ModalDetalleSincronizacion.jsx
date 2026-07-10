import React from 'react'
import { X, CloudCheck, CloudAlert } from 'lucide-react'
import Button from '../ui/Button'
import { SYNC_STATUS_OPTIONS, labelFromKey } from '../../services/diccionarioDatos'

const formatearFecha = (iso) => (
    iso ? new Date(iso).toLocaleString() : '—'
)

//detalle de un registro de InvoiceSyncStatusRecordDto (un sistema externo puntual), sin el campo nextRetryAt
const ModalDetalleSincronizacion = ({ syncStatus, onClose }) => {
    const sincronizado = syncStatus.status === 'SUCCEEDED'

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}>

                {/* Encabezado */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Sincronización</p>
                        <h2 className="text-base font-semibold text-slate-700">{syncStatus.targetSystem}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="Cerrar"
                    >
                        <X size={20} strokeWidth={4} />
                    </button>
                </div>

                {/* Cuerpo */}
                <div className="px-6 py-5 flex flex-col items-center gap-3 overflow-y-auto flex-1">
                    {sincronizado
                        ? <CloudCheck size={40} className="text-green-500" strokeWidth={1.5} />
                        : <CloudAlert size={40} className="text-red-500" strokeWidth={1.5} />
                    }
                    <span className={`text-sm font-semibold ${sincronizado ? 'text-green-700' : 'text-red-700'}`}>
                        {labelFromKey(SYNC_STATUS_OPTIONS, syncStatus.status)}
                    </span>

                    <div className="w-full bg-gray-50 rounded-lg px-4 py-3 flex flex-col gap-1 text-xs text-gray-600 border border-gray-200">
                        <span><strong>ID:</strong> {syncStatus.id}</span>
                        <span><strong>Intentos:</strong> {syncStatus.attempts} / {syncStatus.maxAttempts}</span>
                        <span><strong>Ciclos de reintento:</strong> {syncStatus.attemptsCycle}</span>
                        <span><strong>Último error:</strong> {syncStatus.lastError ?? '—'}</span>
                        <span><strong>ID externo:</strong> {syncStatus.externalId ?? '—'}</span>
                        <span><strong>Último código de respuesta:</strong> {syncStatus.lastResponseCode ?? '—'}</span>
                        <span><strong>Creado:</strong> {formatearFecha(syncStatus.createdAt)}</span>
                        <span><strong>Actualizado:</strong> {formatearFecha(syncStatus.updatedAt)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <Button texto="Cerrar" variante="secondary" tamanio="md" onClick={onClose} />
                </div>
            </div>
        </div>
    )
}

export default ModalDetalleSincronizacion
