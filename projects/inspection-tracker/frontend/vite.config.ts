import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Hebrew Inspection Tracker Frontend Configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true
  },
  preview: {
    port: 4173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          ui: ['@headlessui/react'],
          data: ['@tanstack/react-query', '@supabase/supabase-js'],
          utils: ['date-fns', 'xlsx', 'zustand']
        }
      }
    }
  },
  define: {
    'process.env': {}
  }
})
