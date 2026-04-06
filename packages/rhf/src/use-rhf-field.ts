import { useController } from 'react-hook-form'
import type { FieldValues, FieldPath, Control } from 'react-hook-form'
import type { FieldState } from '@stackform/core'
import { normalizeValue } from './normalize-value'

export function useRHFField<T = unknown>(
  control: Control<FieldValues>,
  name: string
): FieldState<T> {
  const { field, fieldState } = useController({
    control,
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
    disabled: field.disabled ?? false,
  }
}
