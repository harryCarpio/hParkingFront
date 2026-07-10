import React from 'react'
import { CloudCheck, CloudAlert } from 'lucide-react'

//pill clickeable que muestra el estado de sincronizacion de una factura hacia un sistema externo (SPARK/EMOV)
//verde + cloud_done cuando esta sincronizada (SUCCEEDED), rojo + cloud_alert en cualquier otro estado
const BadgeSyncStatus = ({ syncStatus, onClick }) => {
    const sincronizado = syncStatus.status === 'SUCCEEDED'

    return (
        <button
            onClick={() => onClick(syncStatus)}
            title="Ver detalle de sincronización"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
            transition-colors duration-150 cursor-pointer
            ${sincronizado
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}>
            {sincronizado ? <CloudCheck size={14} /> : <CloudAlert size={14} />}
            {syncStatus.targetSystem}
        </button>
    )
}

export default BadgeSyncStatus
