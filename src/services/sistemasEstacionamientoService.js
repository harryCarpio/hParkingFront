import api from "../utils/axiosInstance";

export const getSistemasEstacionamiento = (page = 0, size=20,filtros={}) => {
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
    return api.get("/v1/parking-systems",{ params});
}

export const crearSistemaEstacionamiento = (sistemaParking) =>{
    return api.post("/v1/parking-systems",sistemaParking)
}

export const editarSistemaEstacionamiento = (id,form) =>{
    return api.put(`/v1/parking-systems/${id}`,form)
}

export const eliminarSistemaEstacionamiento = (id) => {
    return api.delete(`/v1/parking-systems/${id}`)
}
