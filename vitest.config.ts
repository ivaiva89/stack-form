import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@stackform/core': path.resolve(__dirname, 'packages/core/src/index.ts'),
      '@stackform/ui': path.resolve(__dirname, 'packages/ui/src/index.ts'),
      '@stackform/rhf': path.resolve(__dirname, 'packages/rhf/src/index.ts'),
      '@stackform/tanstack': path.resolve(
        __dirname,
        'packages/tanstack/src/index.ts'
      ),
      '@stackform/native': path.resolve(
        __dirname,
        'packages/native/src/index.ts'
      ),
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
