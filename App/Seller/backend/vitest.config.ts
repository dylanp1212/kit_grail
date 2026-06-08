import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./test/authMock.ts'],
    coverage: {
      exclude: ['build/**'],
    },
  },
})
