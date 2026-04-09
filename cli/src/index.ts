import { Command } from 'commander'
import { createRequire } from 'node:module'
import { runAdd } from './commands/add.js'
import { runInit } from './commands/init.js'
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
  .action(() => {
    log.info('diff — coming soon')
  })

program
  .command('config')
  .description('Read or update stackform.json configuration')
  .action(() => {
    log.info('config — coming soon')
  })

program.parse()
