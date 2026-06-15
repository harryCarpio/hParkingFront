import React from 'react'
import api from '../utils/axiosInstance';


//consultar los estacionamientos existentes
export const getEstacionamientos = (page = 0, size = 20, filtros = {}) => {
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
    return api.get("/v1/parkings",{ params});

}

export const consultarEstacionamientoById = (id) =>{
    return api.get(`/v1/parkings/${id}`)
}
export const crearEstacionamiento = (parking) =>{

    return api.post("/v1/parkings",parking)
}
export const editarEstacionamiento = (id, form) => {
    return api.put(`/v1/parkings/${id}`, form)
}

export const eliminarEstacionamiento = (id)=>{
    return api.delete(`/v1/parkings/${id}`)
}


