import * as clack from '@clack/prompts'

export const log = {
  info: (message: string): void => clack.log.info(message),
  success: (message: string): void => clack.log.success(message),
  warn: (message: string): void => clack.log.warn(message),
  error: (message: string): void => clack.log.error(message),
}

export function spinner(): ReturnType<typeof clack.spinner> {
  return clack.spinner()
}

export async function confirm(message: string): Promise<boolean> {
  const result = await clack.confirm({ message })
  if (clack.isCancel(result)) {
    clack.cancel('Operation cancelled.')
    process.exit(0)
  }
  return result
}

export async function select<T>(
  message: string,
  options: Array<{ value: T; label: string; hint?: string }>
): Promise<T> {
  const result = await clack.select({ message, options })
  if (clack.isCancel(result)) {
    clack.cancel('Operation cancelled.')
    process.exit(0)
  }
  return result as T
}
