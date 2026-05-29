import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),        // Enforces ultra-fast, crash-free native compilation
    tailwindcss()  // Keeps your pure original Tailwind CSS v4 framework active
  ]
})