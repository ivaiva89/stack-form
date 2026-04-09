import { Command } from 'commander'
import { createRequire } from 'node:module'
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
  .action(() => {
    log.info('init — coming soon')
  })

program
  .command('add')
  .description('Add a StackForm component to your project')
  .argument('[component]', 'Component name')
  .action(() => {
    log.info('add — coming soon')
  })

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
