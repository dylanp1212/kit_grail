import {defineConfig, configDefaults} from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    environment: 'node',
    exclude:[
      ...configDefaults.exclude,
      'build/*'
    ],
    coverage: {
      include: [
        'src/**',
      ],
      exclude: [
        'src/server.ts',
        'src/db.ts',           // module-load `??` defaults aren't testable
        'src/app.ts',          // express wiring covered indirectly by all endpoint tests
        '**/index.ts',
        '**/index.d.ts',
      ],
    },
  },
});
