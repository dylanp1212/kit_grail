import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      include: ['src/**'],
      exclude: [
        'src/server.ts',
        'src/**/index.ts',
      ],
    },
  },
})
