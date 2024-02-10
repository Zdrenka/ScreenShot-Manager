import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
   build: {
    rollupOptions: {
      input: {
        main: '/src/main.js', // Entry point for your Vue app
        background: '/src/background/background.js', // Entry point for your background script
        index: 'index.html',
        primeiconscss: '/node_modules/primeicons/primeicons.css',
        primeiconcheck: '/node_modules/primeicons/raw-svg/check.svg',
        primeicontimes: '/node_modules/primeicons/raw-svg/times.svg',
        primecard: '/node_modules/primevue/card',
        primecardstyle: '/node_modules/primevue/card/style',
        primetheme: '/node_modules/primevue/resources/themes/lara-dark-green/theme.css',
      }
    }
  }
})
