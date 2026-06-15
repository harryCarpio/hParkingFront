import api from "../utils/axiosInstance";

//consultar los usuarios de la WEB existentes
export const getUsuariosSistema = async (page = 0, size = 10,filtros = {}) => {
    const { data } = await api.get("/v1/system-users", { 
        params: filtros
    });

    const inicio = page * size;
    const fin = inicio + size;

    return {
        data: {
            content: data.slice(inicio, fin),
            number: page,
            totalPages: Math.ceil(data.length / size),
            totalElements: data.length,
            size,
            first: page === 0,
            last: fin >= data.length
        }
    };
}

export const consultarUsuarioSistema = (id) => {
    return api.get(`/v1/system-users/${id}`)
}

export const crearUsuarioSistema = (usuario) =>{
    return api.post("/v1/system-users",usuario)
}

export const editarUsuarioSistema = (id,form) =>{
    return api.put(`/v1/system-users/${id}`,form)

}

export const eliminarUsuarioSistema = (id) => {
    return api.delete(`/v1/system-users/${id}`)
}



