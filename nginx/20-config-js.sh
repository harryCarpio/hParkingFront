#!/bin/sh
# Genera /config.js en cada arranque del contenedor.
#
# La imagen nginx ejecuta todo lo que encuentre en /docker-entrypoint.d/ antes
# de arrancar nginx, asi que este script corre solo.
#
# Asi la URL del API es configuracion de despliegue y no algo compilado dentro
# del bundle: la misma imagen sirve para cualquier entorno cambiando API_URL.
# Antes habia que acordarse de NO sobreescribir el config.js del servidor al
# subir dist/ por sftp; ese paso manual desaparece.
#
# El valor por defecto "/api" hace que el navegador pida al mismo origen y que
# nginx (default.conf) haga de proxy hacia hparking-app:8080 — sin CORS.
set -eu

: "${API_URL:=/api}"

cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__={
    API_URL: "${API_URL}"
}
EOF

echo "config.js generado con API_URL=${API_URL}"
