'use client'

declare const process: { env: { NODE_ENV?: string } } | undefined

import type { FieldState } from '../types'
import type { ValidateFn } from './use-validate'
import { useValidate } from './use-validate'
import { useStackFormContext } from '../context'

export interface UseFieldReturn<T> extends FieldState<T> {
  isValidating: boolean
  runValidation: (value: unknown) => void
}

export function useField<T = unknown>(
  name: string,
  opts?: { label?: string; ariaLabel?: string; validate?: ValidateFn<T> }
): UseFieldReturn<T> {
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
  const state = resolveField(name) as unknown as FieldState<T>

  const { validationError, isValidating, runValidation } = useValidate<T>(
    opts?.validate
  )

  return {
    ...state,
    error: validationError ?? state.error,
    isValidating,
    runValidation,
  }
}
