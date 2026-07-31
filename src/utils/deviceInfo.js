//utilidades para reportar datos reales del dispositivo/navegador en el login (ver authService.js)

const DEVICE_ID_KEY = "hparking-device-id";

//identificador estable del navegador/dispositivo, se genera una sola vez y se persiste
export const obtenerDeviceIdentifier = () => {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
};

const detectarNavegador = (userAgent) => {
    if (/Edg\//.test(userAgent)) return "Edge";
    if (/OPR\//.test(userAgent)) return "Opera";
    if (/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) return "Chrome";
    if (/Firefox\//.test(userAgent)) return "Firefox";
    if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) return "Safari";
    return "Navegador Web";
};

const detectarSistemaOperativo = (userAgent) => {
    if (/Windows NT/.test(userAgent)) {
        return { nombre: "Windows", version: userAgent.match(/Windows NT ([\d.]+)/)?.[1] || "N/A" };
    }
    if (/Mac OS X/.test(userAgent)) {
        return { nombre: "macOS", version: userAgent.match(/Mac OS X ([\d_.]+)/)?.[1]?.replace(/_/g, ".") || "N/A" };
    }
    if (/Android/.test(userAgent)) {
        return { nombre: "Android", version: userAgent.match(/Android ([\d.]+)/)?.[1] || "N/A" };
    }
    if (/iPhone|iPad|iPod/.test(userAgent)) {
        return { nombre: "iOS", version: userAgent.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, ".") || "N/A" };
    }
    if (/Linux/.test(userAgent)) {
        return { nombre: "Linux", version: "N/A" };
    }
    return { nombre: navigator.platform || "Desconocido", version: "N/A" };
};

//deriva nombre de navegador y SO/version a partir del user agent, en vez de valores fijos
export const obtenerInfoDispositivo = () => {
    const userAgent = navigator.userAgent;
    const navegador = detectarNavegador(userAgent);
    const so = detectarSistemaOperativo(userAgent);
    return {
        deviceName: navegador,
        model: navegador,
        osName: so.nombre,
        osVersion: so.version,
    };
};

const TIMEOUT_IP_MS = 3000;

//consulta la ip publica real del cliente; si falla o tarda demasiado (ej. red que bloquea el servicio externo),
//se degrada a "0.0.0.0" para no bloquear el login
export const obtenerIpPublica = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_IP_MS);
        const respuesta = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
        clearTimeout(timeoutId);
        const { ip } = await respuesta.json();
        return ip || "0.0.0.0";
    } catch {
        return "0.0.0.0";
    }
};
