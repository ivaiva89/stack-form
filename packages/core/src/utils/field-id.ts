export function toFieldId(name: string, formId?: string): string {
  const sanitized = name
    .replace(/\[/g, '-')
    .replace(/\]/g, '')
    .replace(/\./g, '-')
  return formId ? `${formId}-${sanitized}` : sanitized
}

export function toDescribedBy(
  id: string,
  opts: { hasError: boolean; hasHint: boolean }
): string {
  const parts: string[] = []
  if (opts.hasError) parts.push(`${id}-error`)
  if (opts.hasHint) parts.push(`${id}-hint`)
  return parts.join(' ')
}
