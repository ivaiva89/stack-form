'use client'

import { createContext, useContext } from 'react'
import type { ComponentType } from 'react'

export interface SlotDefaultsContextValue {
  slots?: Record<string, ComponentType<never> | undefined>
  slotProps?: Record<string, Record<string, unknown> | undefined>
  classNames?: Record<string, string | undefined>
}

export const SlotDefaultsContext =
  createContext<SlotDefaultsContextValue | null>(null)

export function useSlotDefaults(): SlotDefaultsContextValue {
  return useContext(SlotDefaultsContext) ?? {}
}
