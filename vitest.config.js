import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.js'],
    exclude: ['test/perf/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.js'],
      reporter: ['lcov', 'text-summary', 'html']
    },
    testTimeout: 1000
  }
});
