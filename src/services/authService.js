import api from "../utils/axiosInstance";


export const iniciarSesion = (email, password) => {
  const body = {
      email,
      password,
      deviceIdentifier: "web-admin",
      deviceFingerprint: navigator.userAgent,
      deviceName: "Navegador Web",
      model: "Browser",
      osName: navigator.platform,
      osVersion: "N/A",
      appVersion: "1.0.0",
      manufacturer: "Web",
      deviceType: "WEB",
      ipAddress: "0.0.0.0",
      userAgent: navigator.userAgent,
  };
  
  return api.post("/auth/login", body);
}

  export const cerrarSesion = () => api.post("/auth/logout");
