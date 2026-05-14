'use client'

import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import type {
  UseFormProps,
  UseFormReturn,
  FieldValues,
  Path,
} from 'react-hook-form'
import { RHFFormProvider } from './provider'

interface TypedField<TValues extends FieldValues> {
  /**
   * Type-only helper: returns the field name unchanged at runtime, but
   * constrains the argument to valid paths on your form's generic so typos
   * fail at compile time. No runtime cost — the helper is a pure identity
   * function over a `Path<TValues>` constraint.
   *
   * @example
   * const { field } = useRHFForm<LoginSchema>()
   * <TextField name={field.name('email')} />
   */
  name: <K extends Path<TValues>>(name: K) => K
}

interface UseRHFFormReturn<TValues extends FieldValues> {
  form: UseFormReturn<TValues>
  FormProvider: (props: { children: ReactNode }) => ReactNode
  field: TypedField<TValues>
}

export function useRHFForm<TValues extends FieldValues>(
  props?: UseFormProps<TValues>
): UseRHFFormReturn<TValues> {
  const form = useForm<TValues>(props)

  const FormProvider = useMemo(() => {
    function RHFFormProviderWrapper({
      children,
    }: {
      children: ReactNode
    }): ReactNode {
      return RHFFormProvider({ form, children })
    }
    return RHFFormProviderWrapper
  }, [form])

  const field = useMemo<TypedField<TValues>>(
    () => ({
      name: <K extends Path<TValues>>(name: K): K => name,
    }),
    []
  )

  return { form, FormProvider, field }
}
