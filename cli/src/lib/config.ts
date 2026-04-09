import * as fs from 'fs-extra'
import * as path from 'node:path'

export const CONFIG_FILENAME = 'stackform.json'

export interface StackformConfig {
  adapter: 'rhf' | 'tanstack' | 'native'
  componentsDir: string
  registryUrl: string
}

const REQUIRED_FIELDS: Array<keyof StackformConfig> = [
  'adapter',
  'componentsDir',
  'registryUrl',
]

export async function readConfig(cwd?: string): Promise<StackformConfig> {
  const dir = cwd ?? process.cwd()
  const configPath = path.join(dir, CONFIG_FILENAME)

  if (!(await fs.pathExists(configPath))) {
    throw new Error(
      `No ${CONFIG_FILENAME} found in ${dir}. Run \`stackform init\` to create one.`
    )
  }

  const raw = (await fs.readJson(configPath)) as Record<string, unknown>

  for (const field of REQUIRED_FIELDS) {
    if (raw[field] === undefined || raw[field] === null) {
      throw new Error(
        `Invalid ${CONFIG_FILENAME}: missing required field "${field}".`
      )
    }
  }

  return raw as unknown as StackformConfig
}

export async function writeConfig(
  config: StackformConfig,
  cwd?: string
): Promise<void> {
  const dir = cwd ?? process.cwd()
  const configPath = path.join(dir, CONFIG_FILENAME)
  await fs.writeJson(configPath, config, { spaces: 2 })
}
