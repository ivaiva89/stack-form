import type { ComponentType } from 'react'
import { clsx } from 'clsx'

export function resolveSlots<
  S extends Record<string, ComponentType<never> | undefined>,
>(coreDefaults: S, providerSlots?: Partial<S>, fieldSlots?: Partial<S>): S {
  const resolved = { ...coreDefaults }
  for (const key of Object.keys(coreDefaults) as Array<keyof S>) {
    resolved[key] = (fieldSlots?.[key] ??
      providerSlots?.[key] ??
      coreDefaults[key]) as S[keyof S]
  }
  return resolved
}

export function resolveSlotProps<
  P extends Record<string, Record<string, unknown> | undefined>,
>(providerSlotProps?: Partial<P>, fieldSlotProps?: Partial<P>): Partial<P> {
  if (!providerSlotProps && !fieldSlotProps) return {} as Partial<P>
  if (!providerSlotProps) return { ...fieldSlotProps } as Partial<P>
  if (!fieldSlotProps) return { ...providerSlotProps } as Partial<P>

  const merged = { ...providerSlotProps } as Partial<P>
  for (const key of Object.keys(fieldSlotProps) as Array<keyof P>) {
    merged[key] = fieldSlotProps[key]
  }
  return merged
}

export function resolveClassNames<C extends Record<string, string | undefined>>(
  coreClassNames?: Partial<C>,
  providerClassNames?: Partial<C>,
  fieldClassNames?: Partial<C>
): Partial<C> {
  if (!coreClassNames && !providerClassNames && !fieldClassNames)
    return {} as Partial<C>

  const allKeys = new Set<keyof C>([
    ...(Object.keys(coreClassNames ?? {}) as Array<keyof C>),
    ...(Object.keys(providerClassNames ?? {}) as Array<keyof C>),
    ...(Object.keys(fieldClassNames ?? {}) as Array<keyof C>),
  ])

  const result = {} as Partial<C>
  for (const key of allKeys) {
    const merged = clsx(
      coreClassNames?.[key],
      providerClassNames?.[key],
      fieldClassNames?.[key]
    )
    if (merged) {
      result[key] = merged as C[keyof C]
    }
  }
  return result
}
