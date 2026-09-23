import api from '../utils/axiosInstance';

//consultar el reporte paginado de facturas con su estado de sincronizacion hacia SPARK/EMOV
export const getFacturasSyncStatus = (page = 0, size = 20, filtros = {}) => {
    const params = {
        page,
        size,
        ...filtros
    };
    Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
            delete params[key];
        }
    });
    return api.get("/v1/invoice/sync-status", { params });
}

//reintentar la sincronizacion de una factura hacia un sistema externo puntual (SPARK o EMOV)
//el backend responde 200 con un resultado por sistema aunque la sincronizacion haya fallado: revisar el status de cada uno
export const sincronizarFactura = (transactionId, targetSystem) => (
    api.post("/v1/invoice/sync", {
        transactionId,
        systems: [{ system: targetSystem, order: 1 }],
    })
)
