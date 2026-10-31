import { defineConfig } from 'vitest/config';

// Each package/app with tests owns a vitest.config.ts; this root config just runs them all.
export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.ts', 'apps/*/vitest.config.ts'],
  },
});
