import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

//hash corto del commit actual, usado como identificador de la compilacion en el footer del login
const commitHash = (() => {
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
        }
      }
    }
  }
})
