import axios from "axios"

/*
const api = axios.create({ //Produccion
    baseURL: window.__APP_CONFIG__?.API_URL || import.meta.env.VITE_HPARKING_API_URL
});
*/


const api = axios.create({ //Desarrollo:
    baseURL: '/api'
});


//se guarda el token en memoria
let tokenMemoria = null;


export const setAccessToken = (token) => {
    tokenMemoria = token;
};

export const getAccessToken = () => tokenMemoria;

export const clearAccessToken = () => {
    tokenMemoria = null;
};

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const respuesta = error.config;
        const esRutaAuth = respuesta.url?.includes('/auth/');
        if(esRutaAuth){
            return Promise.reject(error);
        }
        if(error.response?.status === 401 && !respuesta._retry){
            respuesta._retry = true;
            try {
                const refreshToken = sessionStorage.getItem("refreshToken")
                
                const { data } = await api.post(
                    '/auth/refresh',
                    { refreshToken }
                );

                setAccessToken(data.accessToken);
                sessionStorage.setItem("refreshToken", data.refreshToken);
                respuesta.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(respuesta);
            } catch {
                clearAccessToken();
                sessionStorage.clear();
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);
export default api;
