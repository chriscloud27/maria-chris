import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      lines: 90,
      functions: 90,
      branches: 80,
      statements: 90,
    },
    globals: true,
  },
  plugins: [tsconfigPaths()],
});
