import api from "../utils/axiosInstance";

//consultar las operaciones existentes en el sistema de parqueo
export const getOperacionesSistemaParqueo = (page = 0, size = 20, filtros = {}) => {
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
    return api.get("/v1/parking-system-operations",{ params});
}

export const crearOperacionSistema = (operacionSistema) => {
    return api.post("/v1/parking-system-operations",operacionSistema)
}

export const editarOperacionSistema = (id,form) => {
    return api.put(`/v1/parking-system-operations/${id}`,form)
}

export const eliminarOperacionSistema = (id) => {
    return api.delete(`/v1/parking-system-operations/${id}`)
}



