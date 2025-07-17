import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    // Diese Optionen gelten für alle Vitest-Läufe
    globals: true, // Macht vi, expect etc. global verfügbar
    environment: 'jsdom', // Simuliert eine Browser-Umgebung

    // Spezifische Konfiguration für den Coverage-Lauf
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],

      // Korrigiertes 'include'-Array
      // Wir wollen die Abdeckung für alle Komponenten, Views und Stores messen.
      include: ['src/components/**', 'src/stores/**', 'src/views/**'],

      // Die 'exclude'-Liste ist immer noch nützlich, um irrelevante Dateien auszuschließen
      exclude: [
        'src/main.ts',
        'src/router/**',
        'src/types/**',
        'src/assets/**',
        'src/App.vue',
        '**/__tests__/**', // Schließt die Testdateien selbst aus dem Bericht aus
      ],
    },
  },
})
