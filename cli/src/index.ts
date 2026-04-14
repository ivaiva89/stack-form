import { Command } from 'commander'
import { createRequire } from 'node:module'
import { runAdd } from './commands/add.js'
import { runConfigGet, runConfigList, runConfigSet } from './commands/config.js'
import { runDiff } from './commands/diff.js'
import { runInit } from './commands/init.js'
import { runUpdate } from './commands/update.js'
import { log } from './utils/logger.js'

const require = createRequire(import.meta.url)
const pkg = require('../package.json') as { version: string }

const program = new Command()

program
  .name('stackform')
  .description('StackForm CLI — scaffold, add components, and diff your config')
  .version(pkg.version)

program
  .command('init')
  .description('Initialise StackForm in a project')
  .action(async () => {
    try {
      await runInit()
    } catch (err) {
      log.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

program
  .command('add')
  .description('Add a StackForm component to your project')
  .argument('[components...]', 'Component names')
  .option('--force', 'Overwrite existing files without prompting')
  .option('--registry <url>', 'Override the registry URL from stackform.json')
  .action(
    async (
      components: string[],
      options: { force?: boolean; registry?: string }
    ) => {
      try {
        await runAdd(components, options)
      } catch (err) {
        log.error(err instanceof Error ? err.message : String(err))
        process.exit(1)
      }
    }
  )

program
  .command('diff')
  .description('Show diff between local components and the registry')
  .argument('[component]', 'Component name to diff')
  .action(async (component: string | undefined) => {
    try {
      await runDiff(component)
    } catch (err) {
      log.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

program
  .command('update')
  .description('Update a local component to the latest registry version')
  .argument('[component]', 'Component name to update')
  .action(async (component: string | undefined) => {
    try {
      await runUpdate(component)
    } catch (err) {
      log.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

const configCmd = program
  .command('config')
  .description('Read or update stackform.json configuration')

configCmd
  .command('get <key>')
  .description('Print a config value')
  .action(async (key: string) => {
    try {
      await runConfigGet(key)
    } catch (err) {
      log.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

configCmd
  .command('set <key> <value>')
  .description('Update a config value in stackform.json')
  .action(async (key: string, value: string) => {
    try {
      await runConfigSet(key, value)
    } catch (err) {
      log.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

configCmd
  .command('list')
  .description('Print full config as JSON')
  .action(async () => {
    try {
      await runConfigList()
    } catch (err) {
      log.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

program.parse()
