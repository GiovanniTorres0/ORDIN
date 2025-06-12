// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redireciona qualquer requisição que comece com /api para o seu backend
      '/api': {
        target: 'http://localhost:3000', // A URL do seu servidor backend
        changeOrigin: true, // Necessário para o redirecionamento funcionar
        // Não precisa mais de rewrite, pois o backend já espera /api/templates
      }
    }
  }
})