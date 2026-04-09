import { useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import { StackFormContext } from '@stackform/core'
import type {
  StackFormContextValue,
  FieldState,
  CoreFormState,
} from '@stackform/core'
import { NativeFormContext } from './native-form-context'
import type { NativeFormHandle } from './use-native-form'
import { useNativeFieldInternal } from './use-native-field-internal'

interface NativeFormProviderProps {
  form: NativeFormHandle<Record<string, unknown>>
  formId?: string
  disabled?: boolean
  children: ReactNode
}

export function NativeFormProvider({
  form,
  formId,
  disabled = false,
  children,
}: NativeFormProviderProps): ReactNode {
  const formState: CoreFormState = useMemo(
    () => ({
      isSubmitting: form.isSubmitting,
      isSubmitted: form.isSubmitted,
      isValid: Object.keys(form.errors).every((k) => !form.errors[k]),
      isDirty: Object.keys(form.values).some(
        (k) => form.values[k] !== form.initialValues[k]
      ),
      disabled,
    }),
    [
      form.isSubmitting,
      form.isSubmitted,
      form.errors,
      form.values,
      form.initialValues,
      disabled,
    ]
  )

  const resolver = useCallback(
    (name: string): FieldState<unknown> =>
      ({ name }) as unknown as FieldState<unknown>,
    []
  )

  const stackContextValue: StackFormContextValue = useMemo(
    () => ({
      resolver,
      formState,
      adapterType: 'native' as const,
      formId,
      useFieldHook: useNativeFieldInternal,
    }),
    [resolver, formState, formId]
  )

  const nativeContextValue = useMemo(
    () => ({
      values: form.values,
      errors: form.errors,
      touched: form.touched,
      initialValues: form.initialValues,
      setFieldValue: form.setFieldValue,
      setFieldError: form.setFieldError,
      setFieldTouched: form.setFieldTouched,
    }),
    [
      form.values,
      form.errors,
      form.touched,
      form.initialValues,
      form.setFieldValue,
      form.setFieldError,
      form.setFieldTouched,
    ]
  )

  return (
    <NativeFormContext.Provider value={nativeContextValue}>
      <StackFormContext.Provider value={stackContextValue}>
        {children}
      </StackFormContext.Provider>
    </NativeFormContext.Provider>
  )
}
