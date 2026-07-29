//metadatos de compilacion inyectados en build-time por vite.config.js (ver `define`)
export const APP_VERSION = __APP_VERSION__
export const BUILD_COMMIT = __APP_BUILD_COMMIT__
export const BUILD_TIME = __APP_BUILD_TIME__

export const versionEtiqueta = () => (
    BUILD_COMMIT ? `v${APP_VERSION} (${BUILD_COMMIT})` : `v${APP_VERSION}`
)
