import * as clack from '@clack/prompts'
import chalk from 'chalk'
import { createTwoFilesPatch } from 'diff'
import * as fs from 'fs-extra'
import * as path from 'node:path'
import { readConfig } from '../lib/config.js'
import { computeThreeWayDiff } from '../lib/diff-engine.js'
import {
  fetchComponentFile,
  fetchManifest,
  resolveLatestVersion,
} from '../lib/registry.js'
import { log, select } from '../utils/logger.js'

export async function runDiff(
  component: string | undefined,
  cwd: string = process.cwd()
): Promise<void> {
  clack.intro('StackForm — diff')

  const config = await readConfig(cwd)

  const s = clack.spinner()
  s.start('Fetching registry manifest…')
  let manifest: Awaited<ReturnType<typeof fetchManifest>>
  try {
    manifest = await fetchManifest(config.registryUrl)
    s.stop('Registry manifest loaded')
  } catch (err) {
    s.stop('Failed to fetch manifest')
    throw err
  }

  let selectedComponent: string

  if (!component) {
    const localComponents: string[] = []
    for (const name of Object.keys(manifest.components)) {
      const componentDir = path.resolve(cwd, config.componentsDir, name)
      if (await fs.pathExists(componentDir)) {
        localComponents.push(name)
      }
    }

    if (localComponents.length === 0) {
      log.warn('No local components found. Run `stackform add` first.')
      clack.outro('Nothing to diff.')
      return
    }

    selectedComponent = await select(
      'Select a component to diff:',
      localComponents.map((name) => ({ value: name, label: name }))
    )
  } else {
    selectedComponent = component
  }

  const entry = manifest.components[selectedComponent]
  if (!entry) {
    throw new Error(
      `Component "${selectedComponent}" not found in registry manifest.`
    )
  }

  const latestVersion = resolveLatestVersion(manifest, selectedComponent)
  const installedVersion =
    config.installed?.[selectedComponent] ??
    entry.versions[entry.versions.length - 1]

  if (latestVersion === installedVersion) {
    clack.outro(`${selectedComponent} — up to date (${latestVersion})`)
    return
  }

  let totalSafe = 0
  let totalConflicts = 0

  for (const file of entry.files) {
    const localPath = path.resolve(
      cwd,
      config.componentsDir,
      selectedComponent,
      file
    )

    if (!(await fs.pathExists(localPath))) {
      log.warn(`Local file not found: ${path.join(selectedComponent, file)}`)
      continue
    }

    const yours = await fs.readFile(localPath, 'utf-8')

    let base: string
    try {
      base = await fetchComponentFile(
        config.registryUrl,
        selectedComponent,
        installedVersion,
        file
      )
    } catch {
      base = yours
    }

    let theirs: string
    try {
      theirs = await fetchComponentFile(
        config.registryUrl,
        selectedComponent,
        latestVersion,
        file
      )
    } catch (err) {
      log.error(
        `Failed to fetch ${selectedComponent}/${file}: ${err instanceof Error ? err.message : String(err)}`
      )
      continue
    }

    const { safeChanges, conflicts } = computeThreeWayDiff(base, theirs, yours)

    if (safeChanges.length === 0 && conflicts.length === 0) {
      log.info(`${path.join(selectedComponent, file)} — up to date`)
      continue
    }

    totalSafe += safeChanges.length
    totalConflicts += conflicts.length

    const filePath = path.join(selectedComponent, file)

    if (safeChanges.length > 0) {
      const patch = createTwoFilesPatch(
        `installed/${filePath} (${installedVersion})`,
        `registry/${filePath} (${latestVersion})`,
        base,
        theirs
      )
      process.stdout.write(
        chalk.bold(`\n${filePath} — ${safeChanges.length} safe change(s)\n`) +
          colorDiff(patch) +
          '\n'
      )
    }

    if (conflicts.length > 0) {
      process.stdout.write(
        chalk.red.bold(
          `\n${filePath} — ${conflicts.length} conflict(s) (you and the registry both changed these regions)\n`
        )
      )
      for (const conflict of conflicts) {
        process.stdout.write(
          chalk.dim(`  base:   `) +
            conflict.base.replace(/\n$/, '') +
            '\n' +
            chalk.green(`  theirs: `) +
            conflict.theirs.replace(/\n$/, '') +
            '\n' +
            chalk.yellow(`  yours:  `) +
            conflict.yours.replace(/\n$/, '') +
            '\n\n'
        )
      }
    }
  }

  if (totalSafe === 0 && totalConflicts === 0) {
    clack.outro(`${selectedComponent} — up to date`)
  } else {
    const parts: string[] = []
    if (totalSafe > 0) parts.push(`${totalSafe} safe change(s)`)
    if (totalConflicts > 0) parts.push(`${totalConflicts} conflict(s)`)
    clack.outro(
      `${selectedComponent}: ${parts.join(', ')}. Run \`stackform update ${selectedComponent}\` to apply.`
    )
  }
}

function colorDiff(patch: string): string {
  return patch
    .split('\n')
    .map((line) => {
      if (line.startsWith('+++') || line.startsWith('---')) {
        return chalk.bold(line)
      }
      if (line.startsWith('+')) {
        return chalk.green(line)
      }
      if (line.startsWith('-')) {
        return chalk.red(line)
      }
      if (line.startsWith('@@')) {
        return chalk.yellow(line)
      }
      return line
    })
    .join('\n')
}
