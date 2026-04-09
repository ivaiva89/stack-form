// @vitest-environment node

import * as clack from '@clack/prompts'
import { execa } from 'execa'
import * as fs from 'fs-extra'
import * as crypto from 'node:crypto'
import * as os from 'node:os'
import * as path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runAdd } from '../commands/add.js'
import {
  runConfigGet,
  runConfigList,
  runConfigSet,
} from '../commands/config.js'
import { runDiff } from '../commands/diff.js'
import { runInit } from '../commands/init.js'

vi.mock('@clack/prompts', () => ({
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  spinner: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() })),
  confirm: vi.fn(),
  select: vi.fn(),
  text: vi.fn(),
  multiselect: vi.fn(),
  isCancel: vi.fn().mockReturnValue(false),
  log: {
    info: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('execa', () => ({
  execa: vi.fn().mockResolvedValue({ exitCode: 0 }),
}))

const REGISTRY_URL = 'https://registry.stackform.dev'

const BASE_CONFIG = {
  adapter: 'native' as const,
  componentsDir: './src/components/form',
  registryUrl: REGISTRY_URL,
}

const MANIFEST = {
  components: {
    'text-field': {
      versions: ['1.0.0'],
      files: ['index.tsx'],
    },
  },
}

function makeFetchMock(responses: Record<string, string | object>) {
  return vi.fn(async (url: string) => {
    const matchKey = Object.keys(responses).find((k) => url.includes(k))
    if (!matchKey) {
      return { ok: false as const, status: 404, statusText: 'Not Found' }
    }
    const body = responses[matchKey]
    const text = typeof body === 'string' ? body : JSON.stringify(body)
    return {
      ok: true as const,
      status: 200,
      text: async () => text,
      json: async () => (typeof body === 'string' ? JSON.parse(text) : body),
    }
  })
}

let tmpDir: string

beforeEach(async () => {
  tmpDir = path.join(os.tmpdir(), `stackform-test-${crypto.randomUUID()}`)
  await fs.ensureDir(tmpDir)
  vi.clearAllMocks()
  vi.mocked(clack.spinner).mockReturnValue({
    start: vi.fn(),
    stop: vi.fn(),
  } as ReturnType<typeof clack.spinner>)
  vi.mocked(clack.isCancel).mockReturnValue(false)
})

afterEach(async () => {
  vi.unstubAllGlobals()
  await fs.remove(tmpDir)
})

// ─── init ────────────────────────────────────────────────────────────────────

describe('init', () => {
  it('creates stackform.json with correct adapter, componentsDir, and registryUrl', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), { name: 'test' })
    vi.mocked(clack.select).mockResolvedValue('native')
    vi.mocked(clack.text).mockResolvedValue('./src/components/form')

    await runInit(tmpDir)

    const config = await fs.readJson(path.join(tmpDir, 'stackform.json'))
    expect(config.adapter).toBe('native')
    expect(config.componentsDir).toBe('./src/components/form')
    expect(config.registryUrl).toBe(REGISTRY_URL)
  })

  it('skips package install when adapter is native', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), { name: 'test' })
    vi.mocked(clack.select).mockResolvedValue('native')
    vi.mocked(clack.text).mockResolvedValue('./src/components/form')

    await runInit(tmpDir)

    expect(vi.mocked(execa)).not.toHaveBeenCalled()
  })

  it('throws when no package.json is found in the directory', async () => {
    await expect(runInit(tmpDir)).rejects.toThrow('No package.json found')
  })

  it('overwrites existing stackform.json when user confirms', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), { name: 'test' })
    await fs.writeJson(path.join(tmpDir, 'stackform.json'), {
      adapter: 'rhf',
      componentsDir: './old',
      registryUrl: 'https://old.example.com',
    })
    vi.mocked(clack.confirm).mockResolvedValue(true)
    vi.mocked(clack.select).mockResolvedValue('tanstack')
    vi.mocked(clack.text).mockResolvedValue('./src/components')

    await runInit(tmpDir)

    const config = await fs.readJson(path.join(tmpDir, 'stackform.json'))
    expect(config.adapter).toBe('tanstack')
    expect(config.componentsDir).toBe('./src/components')
    expect(config.registryUrl).toBe(REGISTRY_URL)
  })
})

// ─── add ─────────────────────────────────────────────────────────────────────

describe('add', () => {
  beforeEach(async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), { name: 'test' })
    await fs.writeJson(path.join(tmpDir, 'stackform.json'), BASE_CONFIG)
  })

  it('fetches manifest and writes component files to correct paths', async () => {
    vi.stubGlobal(
      'fetch',
      makeFetchMock({
        'manifest.json': MANIFEST,
        'text-field/1.0.0/index.tsx': 'export const TextField = () => null',
      })
    )

    await runAdd(['text-field'], {}, tmpDir)

    const outputPath = path.join(
      tmpDir,
      'src/components/form/text-field/index.tsx'
    )
    expect(await fs.pathExists(outputPath)).toBe(true)
    expect(await fs.readFile(outputPath, 'utf-8')).toBe(
      'export const TextField = () => null'
    )
  })

  it('creates componentsDir when it does not exist', async () => {
    vi.stubGlobal(
      'fetch',
      makeFetchMock({
        'manifest.json': MANIFEST,
        'text-field/1.0.0/index.tsx': 'export const TextField = () => null',
      })
    )

    const componentDir = path.join(tmpDir, 'src/components/form')
    expect(await fs.pathExists(componentDir)).toBe(false)

    await runAdd(['text-field'], {}, tmpDir)

    expect(await fs.pathExists(componentDir)).toBe(true)
  })

  it('skips existing file when overwrite is declined', async () => {
    const outputPath = path.join(
      tmpDir,
      'src/components/form/text-field/index.tsx'
    )
    await fs.ensureDir(path.dirname(outputPath))
    await fs.writeFile(outputPath, 'original content', 'utf-8')

    vi.stubGlobal(
      'fetch',
      makeFetchMock({
        'manifest.json': MANIFEST,
        'text-field/1.0.0/index.tsx': 'new content from registry',
      })
    )
    vi.mocked(clack.confirm).mockResolvedValue(false)

    await runAdd(['text-field'], {}, tmpDir)

    expect(await fs.readFile(outputPath, 'utf-8')).toBe('original content')
  })

  it('overwrites existing file when --force is set without prompting', async () => {
    const outputPath = path.join(
      tmpDir,
      'src/components/form/text-field/index.tsx'
    )
    await fs.ensureDir(path.dirname(outputPath))
    await fs.writeFile(outputPath, 'original content', 'utf-8')

    vi.stubGlobal(
      'fetch',
      makeFetchMock({
        'manifest.json': MANIFEST,
        'text-field/1.0.0/index.tsx': 'new content from registry',
      })
    )

    await runAdd(['text-field'], { force: true }, tmpDir)

    expect(await fs.readFile(outputPath, 'utf-8')).toBe(
      'new content from registry'
    )
    expect(vi.mocked(clack.confirm)).not.toHaveBeenCalled()
  })

  it('logs error for unknown component and continues with remaining components', async () => {
    vi.stubGlobal(
      'fetch',
      makeFetchMock({
        'manifest.json': MANIFEST,
        'text-field/1.0.0/index.tsx': 'export const TextField = () => null',
      })
    )

    await runAdd(['unknown-component', 'text-field'], {}, tmpDir)

    // unknown-component fails, but text-field must still be written
    expect(
      await fs.pathExists(
        path.join(tmpDir, 'src/components/form/text-field/index.tsx')
      )
    ).toBe(true)
  })
})

// ─── diff ────────────────────────────────────────────────────────────────────

// NOTE: diff tests necessarily assert on stdout/outro because the command's
// purpose is to display output, not write files. File system state (local files)
// is pre-established as real on-disk content in each test.

describe('diff', () => {
  beforeEach(async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), { name: 'test' })
    await fs.writeJson(path.join(tmpDir, 'stackform.json'), BASE_CONFIG)
  })

  it('reports up to date when local file matches registry', async () => {
    const content = 'export const TextField = () => null'
    const localPath = path.join(
      tmpDir,
      'src/components/form/text-field/index.tsx'
    )
    await fs.ensureDir(path.dirname(localPath))
    await fs.writeFile(localPath, content, 'utf-8')

    vi.stubGlobal(
      'fetch',
      makeFetchMock({
        'manifest.json': MANIFEST,
        'text-field/1.0.0/index.tsx': content,
      })
    )

    await runDiff('text-field', tmpDir)

    expect(vi.mocked(clack.outro)).toHaveBeenCalledWith(
      expect.stringContaining('up to date')
    )
  })

  it('writes diff patch to stdout when local file differs from registry', async () => {
    const localPath = path.join(
      tmpDir,
      'src/components/form/text-field/index.tsx'
    )
    await fs.ensureDir(path.dirname(localPath))
    await fs.writeFile(localPath, 'old content line', 'utf-8')

    vi.stubGlobal(
      'fetch',
      makeFetchMock({
        'manifest.json': MANIFEST,
        'text-field/1.0.0/index.tsx': 'new content line',
      })
    )

    const stdoutSpy = vi
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true)

    await runDiff('text-field', tmpDir)

    const written = stdoutSpy.mock.calls.map((c) => String(c[0])).join('')
    expect(written).toMatch(/old content line/)
    expect(written).toMatch(/new content line/)

    stdoutSpy.mockRestore()
  })
})

// ─── config ──────────────────────────────────────────────────────────────────

describe('config', () => {
  beforeEach(async () => {
    await fs.writeJson(path.join(tmpDir, 'stackform.json'), BASE_CONFIG)
  })

  it('get prints the correct value for a valid key', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await runConfigGet('adapter', tmpDir)

    expect(consoleSpy).toHaveBeenCalledWith('native')
    consoleSpy.mockRestore()
  })

  it('set updates the value in stackform.json on disk', async () => {
    await runConfigSet('componentsDir', './new/path', tmpDir)

    const config = await fs.readJson(path.join(tmpDir, 'stackform.json'))
    expect(config.componentsDir).toBe('./new/path')
    expect(config.adapter).toBe('native') // other fields unchanged
  })

  it('list prints all allowed keys as formatted JSON', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await runConfigList(tmpDir)

    expect(consoleSpy).toHaveBeenCalledTimes(1)
    const output = JSON.parse(consoleSpy.mock.calls[0][0] as string) as Record<
      string,
      unknown
    >
    expect(output).toMatchObject({
      adapter: 'native',
      componentsDir: './src/components/form',
      registryUrl: REGISTRY_URL,
    })
    consoleSpy.mockRestore()
  })

  it('throws on an invalid config key', async () => {
    await expect(runConfigGet('invalidKey', tmpDir)).rejects.toThrow(
      'Unknown config key'
    )
  })
})
