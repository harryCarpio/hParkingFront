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

DESPLEGAR O ACTUALIZAR VERSION SERVIDOR:
Ingresar al servidor por sftp y en la ruta. 
sftp://parking@148.72.168.213:222/home/parking/ngix/bin
copiar el contenido que se encuentra dentro de lo carpeta que se creo localmente al ejecutar npm run build. 
Esta carpeta tiene los siguientes archivos:
carpeta assets
index.html
config.js
vite.svg

se debe copiar la carpeta assets, index.html,  y viste.svg no copiar config.js ya quela que esta en el servidor ya esta con el proxy inverso que se configuro en nginx para conectar al back, en tal caso de reescribirse config.js para el servidor debe tener lo siguiente:
window.__APP_CONFIG__={
    API_URL: "/api"
}

gitignore se ignora el archivo .env por seguridad pero este .env debe crear en la raiz del proyecto con esta informacion:
VITE_HPARKING_API_URL = https://hparking-api.vrsoluciones.net solo para desarrollo

y a su vez en la carpeta public el config.js para desarrollo tiene esto:
window.__APP_CONFIG__={
    API_URL: "https://hparking-api.vrsoluciones.net/api"
}

que basicamente al compilar para subir al servidor se copia este archivo en la carpeta /dist
sin embargo, no se debe sobreescribir el config.js que ya existe en el servidor porq ese esta con el proxy pass

una vez que se haya copiado en la carpeta del servidor de nginx/bin
en el terminal ejecutar lo siguinete para actualizar el docker:
ingresar a la carpeta nginx
cd nginx
luego dentro de esa carpeta ejecutar el script restart.sh
./restart.sh
este script tiene lo suficiente para actualizar el docker. y ya esta listo los cambiso publicado en el servidor
```bash

```

## Versión de Node.js

Se recomienda usar exactamente `v20.19.4`. Puede manejarlo con [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 20.19.4
nvm use 20.19.4
```