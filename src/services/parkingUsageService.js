import api from '../utils/axiosInstance';

//consultar los usos (sesiones) de estacionamiento, filtrable por ticket, placa, estado y ventana de tiempo
export const getUsosEstacionamiento = (page = 0, size = 20, filtros = {}) => {
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
    return api.get("/v1/parking/usage", { params });
}
