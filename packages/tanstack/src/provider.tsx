import { useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { AnyFormApi } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-form'
import { StackFormContext } from '@stackform/core'
import type {
  StackFormContextValue,
  FieldState,
  CoreFormState,
} from '@stackform/core'
import { useTanstackFieldInternal } from './use-tanstack-field-internal'

interface TanstackResolverResult {
  __tanstackForm: AnyFormApi
  name: string
}

interface TanstackFormProviderProps {
  form: AnyFormApi
  children: ReactNode
}

export function TanstackFormProvider({
  form,
  children,
}: TanstackFormProviderProps): ReactNode {
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
  const canSubmit = useStore(form.store, (state) => state.canSubmit)

  const formState: CoreFormState = useMemo(
    () => ({
      isSubmitting,
      isSubmitted: false,
      isValid: !canSubmit === false,
      isDirty: false,
      disabled: false,
    }),
    [isSubmitting, canSubmit]
  )

  const resolver = useCallback(
    (name: string): FieldState<unknown> =>
      ({ __tanstackForm: form, name }) as unknown as FieldState<unknown>,
    [form]
  )

  const contextValue: StackFormContextValue = useMemo(
    () => ({
      resolver,
      formState,
      adapterType: 'tanstack' as const,
      useFieldHook: useTanstackFieldInternal,
    }),
    [resolver, formState]
  )

  return (
    <StackFormContext.Provider value={contextValue}>
      {children}
    </StackFormContext.Provider>
  )
}

export type { TanstackResolverResult }
