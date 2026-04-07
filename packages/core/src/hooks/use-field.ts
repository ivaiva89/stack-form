declare const process: { env: { NODE_ENV?: string } } | undefined

import type { FieldState } from '../types'
import { useStackFormContext } from '../context'

export function useField<T = unknown>(
  name: string,
  opts?: { label?: string; ariaLabel?: string }
): FieldState<T> {
  const ctx = useStackFormContext()

  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    if (!opts?.label && !opts?.ariaLabel) {
      console.warn(
        `[StackForm] Field "${name}" has neither a label nor an aria-label. ` +
          'This may cause accessibility issues.'
      )
    }
  }

  const resolveField = ctx.useFieldHook ?? ctx.resolver
  return resolveField(name) as unknown as FieldState<T>
}
