import { createContext, useEffect, useState } from "react";
import { setAccessToken, getAccessToken, clearAccessToken } from "../utils/axiosInstance";
import { cerrarSesion, iniciarSesion } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import api from "../utils/axiosInstance";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const recuperarSesion = async () => {
            const refreshToken = sessionStorage.getItem("refreshToken");
            if (!refreshToken) {
                setCargando(false);
                return;
            }

            try {
                const { data } = await api.post('/auth/refresh', { refreshToken });
                setAccessToken(data.accessToken);
                sessionStorage.setItem("refreshToken", data.refreshToken);

                const decodificado = jwtDecode(data.accessToken);
                const usuarioGuardado = JSON.parse(sessionStorage.getItem("usuario") || "{}")
                setUsuario({
                    ...usuarioGuardado,
                    email: decodificado.sub,
                    roles: decodificado.roles.map((r) => r.authority),
                });
            } catch (error) {
                clearAccessToken();
                sessionStorage.clear();

            } finally {
                setCargando(false);
            }
        };
        recuperarSesion();
    }, [])

    const login = async (email, password) => {
        try {
            const { data } = await iniciarSesion(email, password);

            const decodificado = jwtDecode(data.accessToken);
            const roles = decodificado.roles.map((r) => r.authority);

            if (!roles.includes("ROLE_ADMIN")) {
                throw new Error("Acceso denegado");
            }

            setAccessToken(data.accessToken);
            sessionStorage.setItem("refreshToken", data.refreshToken);
            const usuarioData = {
                email: data.email,
                name: data.name,
                pictureUrl: data.pictureUrl,
                roles,
            }
            setUsuario(usuarioData);
            sessionStorage.setItem("usuario", JSON.stringify(usuarioData))

        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error("Usuario no registrado, o credenciales inválidas");
            }
            throw error;
        }

    };

    const logout = async () => {
        try {
            await cerrarSesion();

        } catch (err) {
            console.log("Response del backend:", err.response?.data);
        }
        clearAccessToken();
        sessionStorage.clear();
        setUsuario(null);



    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
            {children}
        </AuthContext.Provider>
    );
};

