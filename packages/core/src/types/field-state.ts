export interface FieldState<T = unknown> {
  name: string
  value: T
  onChange: (value: T) => void
  onBlur: () => void
  error?: string
  touched: boolean
  dirty: boolean
  disabled: boolean
}

export type FieldResolver = (name: string) => FieldState<unknown>

export interface CoreFormState {
  isSubmitting: boolean
  isSubmitted: boolean
  isValid: boolean
  isDirty: boolean
  disabled: boolean
}

export type AdapterType = 'rhf' | 'tanstack' | 'native'
