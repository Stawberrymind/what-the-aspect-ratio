import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/what-the-aspect-ratio/',
  plugins: [react()],
})
