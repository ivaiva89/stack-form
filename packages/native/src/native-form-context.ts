'use client'

import { createContext, useContext } from 'react'

export interface NativeFormContextValue {
  values: Record<string, unknown>
  errors: Record<string, string | undefined>
  touched: Record<string, boolean>
  initialValues: Record<string, unknown>
  setFieldValue: (name: string, value: unknown) => void
  setFieldError: (name: string, error: string | undefined) => void
  setFieldTouched: (name: string, touched: boolean) => void
}

export const NativeFormContext = createContext<NativeFormContextValue | null>(
  null
)

export function useNativeFormContext(): NativeFormContextValue {
  const ctx = useContext(NativeFormContext)
  if (!ctx) {
    throw new Error(
      '[StackForm] No NativeFormContext found. Wrap your fields in <NativeFormProvider>.'
    )
  }
  return ctx
}
