import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

//hash corto del commit actual, usado como identificador de la compilacion en el footer del login
//dentro de Docker no hay .git (ver .dockerignore), asi que el Dockerfile lo pasa
//como VITE_BUILD_COMMIT; en local se sigue sacando de git igual que antes
const commitHash = (() => {
  if (process.env.VITE_BUILD_COMMIT) return process.env.VITE_BUILD_COMMIT
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return null
  }
})()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_BUILD_COMMIT__: JSON.stringify(commitHash),
    __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.100.250:8080',
        changeOrigin: true,
        secure: true,
        headers: {
          Origin: 'http://192.168.100.250:8080'
        },
        //evita que un fallo de conexion hacia el backend (ej. certificado TLS vencido, backend caido)
        //tumbe el dev server; en vez de eso responde un error con el mismo shape que usa el resto de la app
        //(ver axiosInstance.js / manejo de error.response?.data?.errors)
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.error('[vite] error de proxy hacia el backend:', err.message)
            if (!res.writeHead || res.headersSent) return
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
              errors: [{ issue: 'No se pudo conectar con el servidor. Verifica que esté disponible e inténtalo nuevamente.' }]
            }))
          })
        }
      }
    }
  }
})
