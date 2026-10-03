import api from "../utils/axiosInstance";

//catalogo de permisos del sistema (descripcion, dominio, si es sensible o asignable)
export const getCatalogoPermisos = () => {
    return api.get("/v1/role-permissions/catalog");
}

//permisos asignados y efectivos de cada rol de aplicacion
export const getRolesPermisos = () => {
    return api.get("/v1/role-permissions");
}

//reemplaza todos los permisos de un rol editable (ROLE_OPERATOR, ROLE_CITIZEN)
export const actualizarPermisosRol = (rol, permisos) => {
    return api.put(`/v1/role-permissions/${rol}`, { permissions: permisos });
}

//vuelve un rol editable a sus permisos por defecto
export const restaurarPermisosRol = (rol) => {
    return api.post(`/v1/role-permissions/${rol}/reset`);
}
