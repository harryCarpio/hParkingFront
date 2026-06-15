import api from "../utils/axiosInstance";

//consultar los usuarios de la app existentes
export const getUsuariosAplicacion = async (page = 0, size = 10,filtros = {}) => {
    const { data } = await api.get("/v1/app-users", { 
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

export const consultarUsuarioAppById = (id) =>{
    return api.get(`/v1/app-users/${id}`)
}

export const crearUsuarioApp = (usuario) =>{
    return api.post("/v1/app-users",usuario)
}

export const editarUsuarioApp = (id,form) =>{
    return api.put(`/v1/app-users/${id}`,form)
}

export const eliminarUsuarioApp = (id) =>{
    return api.delete(`/v1/app-users/${id}`)
}


