import api from "../utils/axiosInstance";

//cambia la contraseña del usuario autenticado; responde con un nuevo par de tokens (los anteriores quedan invalidos)
export const cambiarContrasenia = (currentPassword, newPassword) => {
    return api.put("/v1/account/password", { currentPassword, newPassword });
}
