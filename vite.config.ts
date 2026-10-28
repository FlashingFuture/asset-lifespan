import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages(/asset-lifespan/)와 로컬 모두에서 동작하도록 상대 경로
  base: './',
})
