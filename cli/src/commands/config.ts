import chalk from 'chalk'
import { readConfig, writeConfig } from '../lib/config.js'
import { log } from '../utils/logger.js'

const ALLOWED_KEYS = ['adapter', 'componentsDir', 'registryUrl'] as const
type ConfigKey = (typeof ALLOWED_KEYS)[number]

function assertAllowedKey(key: string): asserts key is ConfigKey {
  if (!(ALLOWED_KEYS as readonly string[]).includes(key)) {
    throw new Error(
      `Unknown config key "${key}". Allowed keys: ${ALLOWED_KEYS.join(', ')}`
    )
  }
}

export async function runConfigGet(
  key: string,
  cwd: string = process.cwd()
): Promise<void> {
  assertAllowedKey(key)
  const config = await readConfig(cwd)
  console.log(config[key])
}

export async function runConfigSet(
  key: string,
  value: string,
  cwd: string = process.cwd()
): Promise<void> {
  assertAllowedKey(key)
  const config = await readConfig(cwd)
  ;(config as Record<string, unknown>)[key] = value
  await writeConfig(config, cwd)
  log.success(`Set ${key} = ${chalk.cyan(value)}`)
}

export async function runConfigList(
  cwd: string = process.cwd()
): Promise<void> {
  const config = await readConfig(cwd)
  const display: Record<string, unknown> = {}
  for (const key of ALLOWED_KEYS) {
    display[key] = config[key]
  }
  console.log(JSON.stringify(display, null, 2))
}
