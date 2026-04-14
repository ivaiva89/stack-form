import * as clack from '@clack/prompts'
import { execa } from 'execa'
import * as fs from 'fs-extra'
import * as path from 'node:path'
import { readConfig, writeConfig } from '../lib/config.js'
import { applyThreeWayMerge } from '../lib/diff-engine.js'
import {
  fetchComponentFile,
  fetchManifest,
  resolveLatestVersion,
} from '../lib/registry.js'
import { log, select } from '../utils/logger.js'

export async function runUpdate(
  component: string | undefined,
  cwd: string = process.cwd()
): Promise<void> {
  clack.intro('StackForm — update')

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
      clack.outro('Nothing to update.')
      return
    }

    selectedComponent = await select(
      'Select a component to update:',
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
    clack.outro(
      `${selectedComponent} is already up to date (${latestVersion}).`
    )
    return
  }

  let anyConflicts = false
  let filesUpdated = 0
  const conflictPaths: string[] = []

  for (const file of entry.files) {
    const localPath = path.resolve(
      cwd,
      config.componentsDir,
      selectedComponent,
      file
    )

    if (!(await fs.pathExists(localPath))) {
      log.warn(
        `Local file not found, skipping: ${path.join(selectedComponent, file)}`
      )
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
      log.warn(
        `Could not fetch base version ${installedVersion} for ${file}; treating local as base.`
      )
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
        `Failed to fetch latest ${selectedComponent}/${file}: ${err instanceof Error ? err.message : String(err)}`
      )
      continue
    }

    const { output, hasConflicts } = applyThreeWayMerge(base, theirs, yours)

    await fs.writeFile(localPath, output, 'utf-8')
    filesUpdated++

    if (hasConflicts) {
      anyConflicts = true
      conflictPaths.push(localPath)
      log.warn(
        `Conflicts written to ${path.join(selectedComponent, file)} — resolve conflict markers manually.`
      )
    } else {
      log.success(`Updated ${path.join(selectedComponent, file)}`)
    }
  }

  if (anyConflicts && conflictPaths.length > 0) {
    await openEditor(conflictPaths)

    s.start('Running type check…')
    try {
      await execa('tsc', ['--noEmit'], { cwd, stdio: 'pipe' })
      s.stop('Type check passed')
    } catch {
      s.stop('Type check failed — fix errors before committing')
    }
  }

  if (filesUpdated > 0) {
    const updatedConfig = {
      ...config,
      installed: {
        ...config.installed,
        [selectedComponent]: latestVersion,
      },
    }
    await writeConfig(updatedConfig, cwd)
  }

  if (filesUpdated === 0) {
    clack.outro('No files updated.')
  } else if (anyConflicts) {
    clack.outro(
      `Update complete with conflicts — resolve the markers in the files above.`
    )
  } else {
    clack.outro(`${selectedComponent} updated to ${latestVersion}`)
  }
}

async function openEditor(filePaths: string[]): Promise<void> {
  const editor = process.env.EDITOR

  if (editor) {
    try {
      await execa(editor, filePaths, { stdio: 'inherit' })
      return
    } catch {
      // fall through to defaults
    }
  }

  try {
    await execa('code', ['--wait', ...filePaths], { stdio: 'inherit' })
    return
  } catch {
    // fall through to vim
  }

  try {
    await execa('vim', filePaths, { stdio: 'inherit' })
  } catch (err) {
    log.warn(
      `Could not open an editor: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}
