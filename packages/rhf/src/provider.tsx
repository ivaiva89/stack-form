import { useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { UseFormReturn, FieldValues } from 'react-hook-form'
import { useFormState } from 'react-hook-form'
import { StackFormContext } from '@stackform/core'
import type {
  StackFormContextValue,
  FieldState,
  CoreFormState,
} from '@stackform/core'
import { useRHFFieldInternal } from './use-rhf-field-internal'

interface RHFFormProviderProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>
  formId?: string
  disabled?: boolean
  children: ReactNode
}

export function RHFFormProvider<T extends FieldValues = FieldValues>({
  form,
  formId,
  disabled = false,
  children,
}: RHFFormProviderProps<T>): ReactNode {
  const { isSubmitting, isSubmitted, isValid, isDirty } = useFormState({
    control: form.control,
    exact: true,
  })

  const formState: CoreFormState = useMemo(
    () => ({
      isSubmitting,
      isSubmitted,
      isValid,
      isDirty,
      disabled,
    }),
    [isSubmitting, isSubmitted, isValid, isDirty, disabled]
  )

  const resolver = useCallback(
    (name: string): FieldState<unknown> => {
      return {
        __rhfControl: form.control,
        name,
      } as unknown as FieldState<unknown>
    },
    [form.control]
  )

  const contextValue: StackFormContextValue = useMemo(
    () => ({
      resolver,
      formState,
      adapterType: 'rhf' as const,
      formId,
      useFieldHook: useRHFFieldInternal,
    }),
    [resolver, formState, formId]
  )

  return (
    <StackFormContext.Provider value={contextValue}>
      {children}
    </StackFormContext.Provider>
  )
}
