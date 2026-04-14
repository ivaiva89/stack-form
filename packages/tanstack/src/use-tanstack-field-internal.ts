'use client'

import { useField } from '@tanstack/react-form'
import type { AnyFormApi } from '@tanstack/react-form'
import { useStackFormContext } from '@stackform/core'
import type { FieldState } from '@stackform/core'
import { normalizeValue } from './normalize-value'

interface TanstackResolverResult {
  __tanstackForm: AnyFormApi
  name: string
}

export function useTanstackFieldInternal<T = unknown>(
  name: string
): FieldState<T> {
  const ctx = useStackFormContext()
  const resolved = ctx.resolver(name) as unknown as TanstackResolverResult
  const field = useField({ form: resolved.__tanstackForm, name })

  return {
    name,
    value: normalizeValue(field.state.value) as unknown as T,
    onChange: (val: T) => {
      field.handleChange(val)
    },
    onBlur: () => {
      field.handleBlur()
    },
    error: (field.state.meta.errors as unknown[])[0]?.toString() ?? undefined,
    touched: field.state.meta.isTouched,
    dirty: field.state.meta.isDirty,
    disabled: ctx.formState.disabled,
  }
}
