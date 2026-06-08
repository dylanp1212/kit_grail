import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      include: ['src/**'],
      exclude: [
        'src/build/**',
        'src/types/**',
        'src/server.ts',
        'src/app.ts',
        'src/db.ts',
        'src/**/index.ts',
      ],
    },
  },
})
