'use client'

import { useStackFormContext } from '../context'

export function useFieldValue<T = unknown>(name: string): T {
  const { resolver, useFieldHook } = useStackFormContext()
  const resolveField = useFieldHook ?? resolver
  return resolveField(name).value as unknown as T
}
