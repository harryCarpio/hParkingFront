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

## Deploy en producción (Docker)

El panel se despliega como un contenedor: una imagen que compila la SPA y la
sirve con nginx, que ademas hace de proxy de `/api/` hacia el backend. Todo lo
necesario esta en el repositorio (`Dockerfile`, `nginx/default.conf`,
`docker-compose.yml`), asi que la compilacion es reproducible y no hay que
editar codigo ni subir archivos a mano antes de publicar.

```bash
docker compose up -d --build
```

### Como funciona

- **`API_URL` ya no se compila dentro del bundle.** El contenedor genera
  `/config.js` en cada arranque (`nginx/20-config-js.sh`) a partir de la
  variable de entorno `API_URL`, cuyo valor por defecto es `/api`. Eso significa
  mismo origen: el navegador pide a `/api/...`, nginx lo reenvia al backend y no
  hay CORS. Ya **no** hay que acordarse de "no sobreescribir el config.js del
  servidor": ese archivo se regenera solo.
- **El upstream es `hparking-app:8080`**, el nombre del contenedor del backend en
  la red `hparking_default`. Nunca `127.0.0.1` ni `host.docker.internal`: dentro
  de un contenedor ambos apuntan al propio contenedor. Ese fue justamente el
  origen del 504 del 2026-09-21 (ver
  `backend/hParkingServer/docs/gateway-502-504-filebeat-incident.md`).
- **La red `hparking_default` es externa**: la crea el compose de
  `hParkingServer`, asi que ese stack debe estar levantado primero.
- **El puerto se publica solo en `127.0.0.1:8000`.** Quien atiende desde fuera es
  nginx-proxy-manager, que llega por la red de Docker. Las reglas de iptables de
  Docker se saltan ufw, asi que publicar en `0.0.0.0` expondria el panel a
  Internet aunque el firewall parezca cerrado.
- **El contenedor se llama `hparking-nginx`** porque es el destino configurado en
  nginx-proxy-manager para `hparking-web.fixwireless.net`. Si se renombra, hay
  que actualizar ese proxy host o el sitio dara 502.

### Apuntar a otro backend

Solo si el panel debe hablar con un backend que no esta en la misma red:

```bash
PANEL_API_URL=https://hparking-api.fixwireless.net/api docker compose up -d
```

En ese caso el backend debe incluir el origen del panel en `ALLOWED_ORIGINS`.

### Verificar el despliegue

```bash
curl -s http://127.0.0.1:8000/config.js                    # API_URL en uso
curl -s -o /dev/null -w '%{http_code}
' http://127.0.0.1:8000/
docker compose logs --tail=20 panel
```

Y desde fuera, con el script del backend:

```bash
./check-services.sh public
```

### Desarrollo local

`npm run dev` no usa Docker: Vite levanta su propio proxy de `/api` hacia el
backend (ver `server.proxy` en `vite.config.js`). Para apuntar a otro backend en
desarrollo, cree un `.env` en la raiz (esta en `.gitignore`):

```sh
VITE_HPARKING_API_URL=https://hparking-api.fixwireless.net
```

### Despliegue manual por sftp (obsoleto)

Hasta 2026-09-21 el panel se publicaba copiando el contenido de `dist/` por sftp
a `/home/parking/ngix/bin` y ejecutando `nginx/restart.sh` en el servidor, con la
configuracion de nginx viviendo solo en esa carpeta del servidor, fuera de git.
Ese procedimiento queda reemplazado por `docker compose up -d --build`. La
carpeta `ngix` del servidor puede retirarse una vez validado el nuevo contenedor.

## Versión de Node.js

Se recomienda usar exactamente `v20.19.4`. Puede manejarlo con [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 20.19.4
nvm use 20.19.4
```