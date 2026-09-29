/**
 * Formato de marcas de tiempo en hora local de Ecuador. El band-chart entrega los cubos en UTC;
 * mostrarlos en UTC ponia el trafico de las 17:00 a las 22:00, asi que aqui se fija el huso
 * operativo en vez de depender del navegador.
 */
export const ZONA_OPERACION = 'America/Guayaquil'

/** Eje X: solo la hora para un dia; dia + hora cuando el rango abarca varios dias. */
export const formatearMarcaTiempo = (ts, multiplesDias) => new Date(ts).toLocaleString('es-EC', multiplesDias
    ? { day: 'numeric', month: 'short', timeZone: ZONA_OPERACION }
    : { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ZONA_OPERACION })

export const formatearFechaHoraLocal = (ts, multiplesDias) => new Date(ts).toLocaleString('es-EC', {
    ...(multiplesDias ? { weekday: 'short', day: 'numeric', month: 'short' } : {}),
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ZONA_OPERACION,
})
