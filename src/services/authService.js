import api from "../utils/axiosInstance";
import { obtenerDeviceIdentifier, obtenerInfoDispositivo, obtenerIpPublica } from "../utils/deviceInfo";
import { APP_VERSION } from "../utils/buildInfo";


export const iniciarSesion = async (email, password) => {
  const { deviceName, model, osName, osVersion } = obtenerInfoDispositivo();
  const ipAddress = await obtenerIpPublica();

  const body = {
      email,
      password,
      deviceIdentifier: obtenerDeviceIdentifier(),
      deviceFingerprint: navigator.userAgent,
      deviceName,
      model,
      osName,
      osVersion,
      appVersion: APP_VERSION,
      manufacturer: "Web",
      deviceType: "WEB",
      ipAddress,
      userAgent: navigator.userAgent,
  };

  return api.post("/auth/login", body);
}

  export const cerrarSesion = () => api.post("/auth/logout");
