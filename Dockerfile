# Panel de administracion hParking — build reproducible en dos etapas.
#
#   docker compose up -d --build
#
# El resultado es nginx sirviendo dist/ y haciendo de proxy de /api/ hacia el
# contenedor del backend. Ver nginx/default.conf.

# --- Etapa 1: compilar la SPA ------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# npm ci necesita package-lock.json; se copian primero para aprovechar la cache
# de capas: si no cambian las dependencias, no se vuelve a instalar.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# vite.config.js normalmente saca el hash del commit con `git rev-parse`, que
# aqui no existe (.git esta en .dockerignore). Se pasa como build arg para que
# el pie de pagina del login siga identificando la compilacion.
ARG BUILD_COMMIT=""
ENV VITE_BUILD_COMMIT=$BUILD_COMMIT

RUN npm run build

# --- Etapa 2: servir ---------------------------------------------------------
FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# La imagen de nginx ejecuta /docker-entrypoint.d/*.sh antes de arrancar.
COPY nginx/20-config-js.sh /docker-entrypoint.d/20-config-js.sh
RUN chmod +x /docker-entrypoint.d/20-config-js.sh

EXPOSE 80
