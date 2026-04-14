'use client'

import { createContext, useContext } from 'react'
import type {
  FieldResolver,
  FieldHook,
  CoreFormState,
  AdapterType,
} from '../types'

export interface StackFormContextValue {
  resolver: FieldResolver
  formState: CoreFormState
  adapterType: AdapterType
  formId?: string
  useFieldHook?: FieldHook
}

export const StackFormContext = createContext<StackFormContextValue | null>(
  null
)

export function useStackFormContext(): StackFormContextValue {
  const ctx = useContext(StackFormContext)
  if (!ctx) {
    throw new Error(
      '[StackForm] No form context found. Wrap your fields in ' +
        '<RHFFormProvider>, <TanstackFormProvider>, or <NativeFormProvider>.'
    )
  }
  return ctx
}
