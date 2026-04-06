import type { ComponentType } from 'react'
import type {
  WrapperSlotProps,
  LabelSlotProps,
  ErrorSlotProps,
  HintSlotProps,
} from './slots'

export interface BaseSlots {
  Wrapper?: ComponentType<WrapperSlotProps>
  Label?: ComponentType<LabelSlotProps>
  Error?: ComponentType<ErrorSlotProps>
  Hint?: ComponentType<HintSlotProps>
}

export interface BaseClassNames {
  wrapper?: string
  label?: string
  error?: string
  hint?: string
  input?: string
}

export interface BaseFieldProps<T = unknown> {
  name: string
  label?: string
  hint?: string
  disabled?: boolean
  loading?: boolean
  required?: boolean
  classNames?: BaseClassNames
  slots?: BaseSlots
  slotProps?: Partial<{
    wrapper: Partial<WrapperSlotProps>
    label: Partial<LabelSlotProps>
    error: Partial<ErrorSlotProps>
    hint: Partial<HintSlotProps>
  }>
  onValueChange?: (value: T) => void
}
