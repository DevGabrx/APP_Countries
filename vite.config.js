import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.RESTCOUNTRIES_API_KEY

  if (!apiKey) {
    console.warn('RESTCOUNTRIES_API_KEY no está configurada. Agrégala en el archivo .env local.')
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.restcountries.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/countries/v5'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (apiKey) {
                proxyReq.setHeader('Authorization', 'Bearer ' + apiKey)
              }
            })
          },
        },
      },
    },
  }
})
