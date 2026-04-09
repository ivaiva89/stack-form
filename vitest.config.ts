import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@stackform/zod': path.resolve(__dirname, 'packages/zod/src/index.ts'),
      '@stackform/valibot': path.resolve(
        __dirname,
        'packages/valibot/src/index.ts'
      ),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    passWithNoTests: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
    },
  },
})
