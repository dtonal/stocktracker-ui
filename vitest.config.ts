import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8', // oder 'istanbul'
        reporter: ['text', 'json', 'html'], // Berichte, die generiert werden sollen
        // Optional: Verzeichnisse einschließen/ausschließen
        include: ['src/stores/**'],
        exclude: [
          'src/main.ts',
          'src/router/**',
          'src/types/**',
          'src/**/App.vue',
          'src/**/HomeView.vue', // Beispiel: Views ausschließen, wenn sie keine Logik haben
        ],
      },
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
