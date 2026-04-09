import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()]
    viteConfig.resolve = viteConfig.resolve ?? {}
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias as Record<string, string>),
      '@stackform/core': path.resolve(__dirname, '../../../packages/core/src'),
      '@stackform/ui': path.resolve(__dirname, '../../../packages/ui/src'),
      '@stackform/rhf': path.resolve(__dirname, '../../../packages/rhf/src'),
      '@stackform/zod': path.resolve(__dirname, '../../../packages/zod/src'),
    }
    return viteConfig
  },
}

export default config
