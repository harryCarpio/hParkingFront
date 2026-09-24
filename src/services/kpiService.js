import api from '../utils/axiosInstance';

//Ecuador no tiene horario de verano, asi que el desfase es fijo. Se envian los limites con offset
//explicito para que el dia calendario del panel coincida con el que el backend usa al agrupar.
const OFFSET_ECUADOR = '-05:00';

/** Inicio (inclusive) del dia local ecuatoriano, en ISO-8601 con offset. */
export const inicioDelDia = (fecha) => `${fecha}T00:00:00${OFFSET_ECUADOR}`;

/** Inicio del dia siguiente: el backend trata 'to' como exclusivo, asi que asi se incluye 'fecha' completa. */
export const finDelDiaExclusivo = (fecha) => {
    const siguiente = new Date(`${fecha}T12:00:00Z`);
    siguiente.setUTCDate(siguiente.getUTCDate() + 1);
    return `${siguiente.toISOString().split('T')[0]}T00:00:00${OFFSET_ECUADOR}`;
};

//consultar todos los indicadores de la plataforma para un rango de fechas (una sola llamada,
//para que cada cifra del tablero este medida sobre exactamente el mismo periodo).
//Sin parkingId el backend devuelve el total de todos los parqueaderos.
export const getIndicadores = (desde, hasta, parkingId = '') => (
    api.get('/v1/analytics/kpis', {
        params: {
            from: inicioDelDia(desde),
            to: finDelDiaExclusivo(hasta),
            ...(parkingId ? { parkingId } : {}),
        },
    })
);
