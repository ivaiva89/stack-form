import { useStackFormContext } from '@stackform/core'
import type { FieldState } from '@stackform/core'
import { useNativeFormContext } from './native-form-context'
import { normalizeValue } from './normalize-value'

export function useNativeFieldInternal<T = unknown>(
  name: string
): FieldState<T> {
  const ctx = useStackFormContext()
  const native = useNativeFormContext()

  return {
    name,
    value: normalizeValue(native.values[name]) as T,
    onChange: (val: T) => {
      native.setFieldValue(name, val)
    },
    onBlur: () => {
      native.setFieldTouched(name, true)
    },
    error: native.errors[name],
    touched: native.touched[name] ?? false,
    dirty: native.values[name] !== native.initialValues[name],
    disabled: ctx.formState.disabled,
  }
}
