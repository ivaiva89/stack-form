import * as clack from '@clack/prompts'
import * as fs from 'fs-extra'
import * as path from 'node:path'
import { readConfig } from '../lib/config.js'
import {
  fetchComponentFile,
  fetchManifest,
  listAvailableComponents,
  resolveLatestVersion,
} from '../lib/registry.js'
import { confirm, log } from '../utils/logger.js'

export interface AddOptions {
  force?: boolean
  registry?: string
}

export async function runAdd(
  components: string[],
  options: AddOptions,
  cwd: string = process.cwd()
): Promise<void> {
  clack.intro('StackForm — add')

  const config = await readConfig(cwd)
  const registryUrl = options.registry ?? config.registryUrl

  const s = clack.spinner()
  s.start('Fetching registry manifest…')
  let manifest: Awaited<ReturnType<typeof fetchManifest>>
  try {
    manifest = await fetchManifest(registryUrl)
    s.stop('Registry manifest loaded')
  } catch (err) {
    s.stop('Failed to fetch manifest')
    throw err
  }

  let selected = components

  if (selected.length === 0) {
    const available = listAvailableComponents(manifest)
    const result = await clack.multiselect<
      { value: string; label: string }[],
      string
    >({
      message: 'Select components to add:',
      options: available.map((name) => ({ value: name, label: name })),
    })
    if (clack.isCancel(result)) {
      clack.cancel('Operation cancelled.')
      process.exit(0)
    }
    selected = result
  }

  let totalFiles = 0

  for (const component of selected) {
    let version: string
    try {
      version = resolveLatestVersion(manifest, component)
    } catch (err) {
      log.error(err instanceof Error ? err.message : String(err))
      continue
    }

    const entry = manifest.components[component]

    for (const file of entry.files) {
      const outputPath = path.resolve(
        cwd,
        config.componentsDir,
        component,
        file
      )

      if (!options.force && (await fs.pathExists(outputPath))) {
        const overwrite = await confirm(
          `${path.join(component, file)} already exists. Overwrite?`
        )
        if (!overwrite) {
          log.warn(`Skipped ${path.join(component, file)}`)
          continue
        }
      }

      let content: string
      try {
        content = await fetchComponentFile(
          registryUrl,
          component,
          version,
          file
        )
      } catch (err) {
        log.error(
          `Failed to fetch ${component}/${file}: ${err instanceof Error ? err.message : String(err)}`
        )
        continue
      }

      await fs.ensureDir(path.dirname(outputPath))
      await fs.writeFile(outputPath, content, 'utf-8')
      log.success(`Wrote ${path.join(component, file)}`)
      totalFiles++
    }
  }

  clack.outro(
    `Done — ${totalFiles} file${totalFiles === 1 ? '' : 's'} written.`
  )
}
