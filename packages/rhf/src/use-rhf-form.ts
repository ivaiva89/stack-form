import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form'
import { RHFFormProvider } from './provider'

interface UseRHFFormReturn<TValues extends FieldValues> {
  form: UseFormReturn<TValues>
  FormProvider: (props: { children: ReactNode }) => ReactNode
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

  // TODO: Field — typed field wrapper, wired after M3

  return { form, FormProvider }
}
