export interface ComponentManifest {
  versions: string[]
  files: string[]
}

export interface RegistryManifest {
  components: Record<string, ComponentManifest>
}

export async function fetchManifest(
  registryUrl: string
): Promise<RegistryManifest> {
  const url = `${registryUrl}/manifest.json`
  let response: Response

  try {
    response = await fetch(url)
  } catch (cause) {
    throw new Error(
      `Network error fetching manifest from ${url}: ${String(cause)}`
    )
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch manifest from ${url}: HTTP ${response.status} ${response.statusText}`
    )
  }

  const json = (await response.json()) as unknown

  if (
    typeof json !== 'object' ||
    json === null ||
    !('components' in json) ||
    typeof (json as Record<string, unknown>).components !== 'object' ||
    (json as Record<string, unknown>).components === null
  ) {
    throw new Error(`Invalid manifest shape received from ${url}`)
  }

  return json as RegistryManifest
}

export async function fetchComponentFile(
  registryUrl: string,
  component: string,
  version: string,
  file: string
): Promise<string> {
  const url = `${registryUrl}/components/${component}/${version}/${file}`
  let response: Response

  try {
    response = await fetch(url)
  } catch (cause) {
    throw new Error(`Network error fetching ${url}: ${String(cause)}`)
  }

  if (response.status === 404) {
    throw new Error(
      `Component file not found: ${component}@${version}/${file} (${url})`
    )
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: HTTP ${response.status} ${response.statusText}`
    )
  }

  return response.text()
}

export function resolveLatestVersion(
  manifest: RegistryManifest,
  component: string
): string {
  const entry = manifest.components[component]

  if (!entry) {
    throw new Error(
      `Component "${component}" not found in registry manifest. Available: ${Object.keys(manifest.components).join(', ')}`
    )
  }

  return entry.versions[0]
}

export function listAvailableComponents(manifest: RegistryManifest): string[] {
  return Object.keys(manifest.components)
}
