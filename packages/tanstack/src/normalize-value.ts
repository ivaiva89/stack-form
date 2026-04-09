export function normalizeValue(value: unknown): unknown {
  if (value === undefined || value === null) {
    return ''
  }
  return value
}
