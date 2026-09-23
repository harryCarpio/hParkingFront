/**
 * Tokens de visualizacion del tablero de indicadores.
 *
 * Los colores salen de la paleta validada del skill de dataviz y se comprobaron contra la
 * superficie real de las tarjetas (#ffffff, `--bg-surface`):
 *   serie 1 (azul) 4.42:1 · good 3.35:1 · critical 4.80:1 — sobre 3:1
 *   warning 1.83:1 · serious 2.64:1 — bajo 3:1 A PROPOSITO: por eso todo estado se muestra
 *   siempre con icono + etiqueta y nunca depende solo del color.
 *
 * Todos los graficos del tablero son de UNA sola serie, asi que usan el slot 1; el color nunca
 * codifica el valor (eso ya lo dice el largo de la barra) ni el ranking.
 */
export const viz = {
    //slot 1 de la paleta categorica: el unico color de dato en los graficos de serie unica
    serie1: '#2a78d6',
    //relleno de area: la misma tinta al 10%, un lavado y no un bloque saturado
    serie1Lavado: 'rgba(42, 120, 214, 0.10)',
    superficie: '#ffffff',
    //tinta: los textos NUNCA llevan el color del dato
    tintaPrimaria: '#0b0b0b',
    tintaSecundaria: '#52514e',
    tintaTenue: '#898781',
    rejilla: '#e1e0d9',
    ejeBase: '#c3c2b7',
    //escala de estado, de significado reservado: jamas se usa como "serie N"
    estado: {
        bueno: '#0ca30c',
        advertencia: '#fab219',
        grave: '#ec835a',
        critico: '#d03b3b',
    },
};

/**
 * Severidad de una tasa de exito (0-1). Devuelve la clave de `viz.estado`; el componente
 * que la use debe acompaniarla siempre de icono y etiqueta.
 */
export const severidadPorTasaExito = (tasa) => {
    if (tasa === null || tasa === undefined) return 'bueno';
    if (tasa >= 0.99) return 'bueno';
    if (tasa >= 0.9) return 'advertencia';
    if (tasa >= 0.7) return 'grave';
    return 'critico';
};

/** Severidad de ocupacion: llenarse es lo esperado, pero un parqueadero al tope es una alerta. */
export const severidadPorOcupacion = (tasa) => {
    if (tasa === null || tasa === undefined) return 'bueno';
    if (tasa >= 0.95) return 'critico';
    if (tasa >= 0.85) return 'grave';
    if (tasa >= 0.7) return 'advertencia';
    return 'bueno';
};

const formateadorMoneda = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

/** Monto completo, para cifras y tooltips: $1.284,50 */
export const formatearMoneda = (valor) => (
    valor === null || valor === undefined ? '—' : formateadorMoneda.format(Number(valor))
);

/** Monto compacto para ticks de eje y etiquetas directas: $1,3K */
export const formatearMonedaCompacta = (valor) => {
    if (valor === null || valor === undefined) return '—';
    const numero = Number(valor);
    if (Math.abs(numero) >= 1000) {
        return `$${new Intl.NumberFormat('es-EC', { maximumFractionDigits: 1 }).format(numero / 1000)}K`;
    }
    return `$${new Intl.NumberFormat('es-EC', { maximumFractionDigits: 0 }).format(numero)}`;
};

export const formatearEntero = (valor) => (
    valor === null || valor === undefined ? '—' : new Intl.NumberFormat('es-EC').format(valor)
);

export const formatearPorcentaje = (tasa, decimales = 1) => (
    tasa === null || tasa === undefined ? '—' : `${(Number(tasa) * 100).toFixed(decimales)}%`
);

/** "1h 08m" a partir de minutos; null cuando no hay nada que promediar. */
export const formatearMinutos = (minutos) => {
    if (minutos === null || minutos === undefined) return '—';
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return horas > 0 ? `${horas}h ${String(resto).padStart(2, '0')}m` : `${resto}m`;
};

/** "10 sep" — la fecha llega como yyyy-MM-dd y se formatea sin que el navegador la desplace. */
export const formatearDiaCorto = (fechaIso) => {
    if (!fechaIso) return '';
    const [anio, mes, dia] = fechaIso.split('-').map(Number);
    return new Date(Date.UTC(anio, mes - 1, dia)).toLocaleDateString('es-EC', {
        day: 'numeric', month: 'short', timeZone: 'UTC',
    });
};

export const formatearDiaLargo = (fechaIso) => {
    if (!fechaIso) return '';
    const [anio, mes, dia] = fechaIso.split('-').map(Number);
    return new Date(Date.UTC(anio, mes - 1, dia)).toLocaleDateString('es-EC', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    });
};

export const formatearHora = (hora) => `${String(hora).padStart(2, '0')}:00`;

/** Etiquetas en espaniol de UsageStatus; se deja la clave cruda si el backend suma un estado nuevo. */
export const ETIQUETA_ESTADO_USO = {
    ACTIVE: 'Activo',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
    PAYED: 'Pagado',
};
