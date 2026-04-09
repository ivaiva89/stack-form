import * as clack from '@clack/prompts'
import { execa } from 'execa'
import * as fs from 'fs-extra'
import * as path from 'node:path'
import {
  CONFIG_FILENAME,
  writeConfig,
  type StackformConfig,
} from '../lib/config.js'
import { confirm, log, select } from '../utils/logger.js'

const REGISTRY_URL = 'https://registry.stackform.dev'

const ADAPTER_DEPS: Record<StackformConfig['adapter'], string | null> = {
  rhf: 'react-hook-form',
  tanstack: '@tanstack/react-form',
  native: null,
}

async function detectPackageManager(
  cwd: string
): Promise<'pnpm' | 'yarn' | 'npm'> {
  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) return 'yarn'
  return 'npm'
}

async function installDep(
  manager: 'pnpm' | 'yarn' | 'npm',
  dep: string,
  cwd: string
): Promise<void> {
  const args: Record<'pnpm' | 'yarn' | 'npm', string[]> = {
    pnpm: ['add', dep],
    yarn: ['add', dep],
    npm: ['install', dep],
  }
  await execa(manager, args[manager], { cwd, stdio: 'inherit' })
}

export async function runInit(cwd: string = process.cwd()): Promise<void> {
  if (!(await fs.pathExists(path.join(cwd, 'package.json')))) {
    throw new Error(
      `No package.json found in ${cwd}. Run \`stackform init\` from the root of a Node.js project.`
    )
  }

  clack.intro('StackForm — init')

  const configPath = path.join(cwd, CONFIG_FILENAME)
  if (await fs.pathExists(configPath)) {
    const overwrite = await confirm(
      `${CONFIG_FILENAME} already exists. Overwrite?`
    )
    if (!overwrite) {
      clack.outro('Cancelled.')
      return
    }
  }

  const adapter = await select<StackformConfig['adapter']>('Which adapter?', [
    { value: 'rhf', label: 'React Hook Form', hint: 'react-hook-form' },
    { value: 'tanstack', label: 'TanStack Form', hint: '@tanstack/react-form' },
    {
      value: 'native',
      label: 'Native (useState)',
      hint: 'no extra dependencies',
    },
  ])

  const rawDir = await clack.text({
    message: 'Components directory?',
    placeholder: './src/components/form',
    defaultValue: './src/components/form',
  })
  if (clack.isCancel(rawDir)) {
    clack.cancel('Operation cancelled.')
    process.exit(0)
  }
  const componentsDir = rawDir || './src/components/form'

  if (!(await fs.pathExists(path.join(cwd, 'components.json')))) {
    log.warn(
      'shadcn/ui not detected (no components.json). Some UI primitives may be missing.'
    )
  }

  const dep = ADAPTER_DEPS[adapter]
  if (dep !== null) {
    const manager = await detectPackageManager(cwd)
    const s = clack.spinner()
    s.start(`Installing ${dep} with ${manager}…`)
    try {
      await installDep(manager, dep, cwd)
      s.stop(`Installed ${dep}`)
    } catch {
      s.stop(`Failed to install ${dep} — continuing anyway`)
      log.error(
        `Could not install ${dep}. Install it manually: ${manager} add ${dep}`
      )
    }
  }

  await writeConfig({ adapter, componentsDir, registryUrl: REGISTRY_URL }, cwd)

  clack.outro(
    `Done! ${CONFIG_FILENAME} created.\n  Next: stackform add <component>`
  )
}
