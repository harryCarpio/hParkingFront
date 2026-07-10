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
