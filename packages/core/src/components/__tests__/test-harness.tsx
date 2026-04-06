import type { ReactNode } from 'react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { StackFormContext } from '../../context'
import type { StackFormContextValue } from '../../context'
import type { FieldState, CoreFormState } from '../../types'

interface FieldConfig {
  value?: unknown
  error?: string
  touched?: boolean
  dirty?: boolean
  disabled?: boolean
}

interface TestFormProviderProps {
  fields: Record<string, FieldConfig>
  formId?: string
  disabled?: boolean
  children: ReactNode
  onFieldChange?: (name: string, value: unknown) => void
}

export function TestFormProvider({
  fields: initialFields,
  formId,
  disabled = false,
  children,
  onFieldChange,
}: TestFormProviderProps): ReactNode {
  const [fields, setFields] = useState(initialFields)
  const onFieldChangeRef = useRef(onFieldChange)
  useEffect(() => {
    onFieldChangeRef.current = onFieldChange
  })

  const resolver = useCallback(
    (name: string): FieldState<unknown> => {
      const config = fields[name] ?? {}
      return {
        name,
        value: config.value ?? '',
        onChange: (value: unknown) => {
          setFields((prev) => ({
            ...prev,
            [name]: { ...prev[name], value },
          }))
          onFieldChangeRef.current?.(name, value)
        },
        onBlur: () => {
          setFields((prev) => ({
            ...prev,
            [name]: { ...prev[name], touched: true },
          }))
        },
        error: config.error,
        touched: config.touched ?? false,
        dirty: config.dirty ?? false,
        disabled: config.disabled ?? false,
      }
    },
    [fields]
  )

  const formState: CoreFormState = {
    isSubmitting: false,
    isSubmitted: false,
    isValid: true,
    isDirty: false,
    disabled,
  }

  const contextValue: StackFormContextValue = {
    resolver,
    formState,
    adapterType: 'native',
    formId,
  }

  return (
    <StackFormContext.Provider value={contextValue}>
      {children}
    </StackFormContext.Provider>
  )
}
