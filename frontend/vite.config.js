import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vuetify': ['vuetify'],
          'chart': ['chart.js'],
          'vendor': ['vue'],
        },
      },
    },
    chunkSizeWarningLimit: 300,
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: false,
    target: 'es2018',
  },
  server: {
    hmr: { overlay: false },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
