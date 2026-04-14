'use client'

import { useController } from 'react-hook-form'
import type { FieldValues, FieldPath, Control } from 'react-hook-form'
import { useStackFormContext } from '@stackform/core'
import type { FieldState } from '@stackform/core'
import { normalizeValue } from './normalize-value'

interface RHFResolverResult {
  __rhfControl: Control<FieldValues>
  name: string
}

export function useRHFFieldInternal<T = unknown>(name: string): FieldState<T> {
  const ctx = useStackFormContext()
  const resolved = ctx.resolver(name) as unknown as RHFResolverResult
  const { field, fieldState } = useController({
    control: resolved.__rhfControl,
    name: name as FieldPath<FieldValues>,
  })

  return {
    name,
    value: normalizeValue(field.value) as T,
    onChange: field.onChange as (value: T) => void,
    onBlur: field.onBlur,
    error: fieldState.error?.message,
    touched: fieldState.isTouched,
    dirty: fieldState.isDirty,
    disabled: ctx.formState.disabled || (field.disabled ?? false),
  }
}
