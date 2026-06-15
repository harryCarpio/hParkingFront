# Panel Administración Hparking



## Requisitos previos

- Node.js v20.19.4
- npm

## Instalación y ejecución local

```bash
# 1. Clonar el repositorio
git clone https://github.com/carolinavrsoluciones/hParkingFront.git
cd al repositorio o abrir visual studio code con el proyecto y primero ejecutar:

# 2. Instalar dependencias
npm install

# 3. Correr en modo desarrollo
npm run dev
```

## Deploy en producción (Nginx)
##  Antes de hacer el build para producción

En el archivo `src/axiosInstance.js`, debe **comentar** la línea de desarrollo y **descomentar** la de producción:

```javascript
//  Producción — descomentar esto:
const api = axios.create({
    baseURL: window.__APP_CONFIG__?.API_URL || import.meta.env.VITE_HPARKING_API_URL
});

//  Desarrollo — comentar esto:
/*
const api = axios.create({
    baseURL: '/api'
});
*/
```

> Sin este cambio antes del build, el proyecto en producción intentará
> conectarse a `/api` y no encontrará el backend — dará errores de CORS o 404.

Una vez hecho ese cambio, recién se ejecuta:

```bash
# 1. Generar el build
npm run build
```


Esto genera la carpeta `dist/` lista para producción.

>  **Importante:** En el servidor Nginx ya existe un `config.js` con las variables
> de entorno de producción.  
> **NO sobreescribir ese archivo** al subir el contenido de `dist/` — si se reemplaza
> obtendrá errores de CORS y el proyecto no funcionará correctamente.

```bash

```

## Versión de Node.js

Se recomienda usar exactamente `v20.19.4`. Puede manejarlo con [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 20.19.4
nvm use 20.19.4
```