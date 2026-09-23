/**
 * Presets del filtro de fechas del tablero. Viven aparte del componente para que el archivo
 * de la vista exporte solo componentes (regla de fast refresh).
 */
export const PRESETS = [
    { id: 'hoy', etiqueta: 'Hoy', dias: 0 },
    { id: '7d', etiqueta: 'Últimos 7 días', dias: 6 },
    { id: '30d', etiqueta: 'Últimos 30 días', dias: 29 },
    { id: '90d', etiqueta: 'Últimos 90 días', dias: 89 },
]

/** Preset inicial del tablero: 30 días da contexto suficiente sin castigar la consulta. */
export const PRESET_POR_DEFECTO = PRESETS[2]

export const aFechaIso = (fecha) => fecha.toISOString().split('T')[0]

/** Rango de un preset, en días calendario terminados hoy. */
export const rangoDePreset = (dias) => {
    const hasta = new Date()
    const desde = new Date()
    desde.setDate(desde.getDate() - dias)
    return { desde: aFechaIso(desde), hasta: aFechaIso(hasta) }
}
