import type {
  ComponentType,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ButtonHTMLAttributes,
} from 'react'

export interface WrapperSlotProps {
  className?: string
  children: React.ReactNode
  error?: boolean
  disabled?: boolean
}

export interface LabelSlotProps {
  htmlFor: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export interface ErrorSlotProps {
  id: string
  message: string
  className?: string
}

export interface HintSlotProps {
  id: string
  children: React.ReactNode
  className?: string
  hasError?: boolean
}

export interface PrefixSlotProps {
  children: React.ReactNode
  className?: string
}

export interface SuffixSlotProps {
  children: React.ReactNode
  className?: string
}

export interface CounterSlotProps {
  current: number
  max?: number
  className?: string
}

export interface TextInputSlotProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export interface TextareaSlotProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange'
> {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export interface NumberInputSlotProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  id: string
  name: string
  value: number
  onChange: (value: number) => void
  onBlur: () => void
  min?: number
  max?: number
  step?: number
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export interface SelectTriggerSlotProps {
  id: string
  name: string
  value: string
  selectedLabel?: string
  placeholder?: string
  isOpen: boolean
  onToggle: () => void
  disabled?: boolean
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  className?: string
}

export interface SelectOptionSlotProps<T = string> {
  value: T
  label: string
  disabled?: boolean
  'aria-selected'?: boolean
  onSelect: () => void
  className?: string
}

export interface CheckboxSlotProps {
  id: string
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  onBlur: () => void
  disabled?: boolean
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  className?: string
}

export interface SwitchSlotProps {
  id: string
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  onBlur: () => void
  disabled?: boolean
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  className?: string
}

export interface RadioOptionSlotProps<T = string> {
  value: T
  label: string
  disabled?: boolean
  className?: string
}

export interface StepperButtonSlotProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'increment' | 'decrement'
  className?: string
}

export interface EmptyStateSlotProps {
  message?: string
  className?: string
}

export interface LoadingStateSlotProps {
  className?: string
}

export interface SlotComponentMap {
  Wrapper: ComponentType<WrapperSlotProps>
  Label: ComponentType<LabelSlotProps>
  Error: ComponentType<ErrorSlotProps>
  Hint: ComponentType<HintSlotProps>
  Prefix: ComponentType<PrefixSlotProps>
  Suffix: ComponentType<SuffixSlotProps>
  Counter: ComponentType<CounterSlotProps>
  TextInput: ComponentType<TextInputSlotProps>
  Textarea: ComponentType<TextareaSlotProps>
  NumberInput: ComponentType<NumberInputSlotProps>
  SelectTrigger: ComponentType<SelectTriggerSlotProps>
  SelectOption: ComponentType<SelectOptionSlotProps>
  Checkbox: ComponentType<CheckboxSlotProps>
  Switch: ComponentType<SwitchSlotProps>
  RadioOption: ComponentType<RadioOptionSlotProps>
  StepperIncrement: ComponentType<StepperButtonSlotProps>
  StepperDecrement: ComponentType<StepperButtonSlotProps>
  EmptyState: ComponentType<EmptyStateSlotProps>
  LoadingState: ComponentType<LoadingStateSlotProps>
}
