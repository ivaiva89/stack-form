// Provider
export { StackFormProvider } from './stack-form-provider'
export type { StackFormProviderProps } from './stack-form-provider'

// Slot components
export { DefaultLabel } from './slots/shared/DefaultLabel'
export { DefaultError } from './slots/shared/DefaultError'
export { DefaultHint } from './slots/shared/DefaultHint'
export { DefaultWrapper } from './slots/shared/DefaultWrapper'
export { DefaultInput } from './slots/shared/DefaultInput'
export { DefaultNumberInput } from './slots/shared/DefaultNumberInput'
export { DefaultTextarea } from './slots/shared/DefaultTextarea'
export { DefaultCounter } from './slots/shared/DefaultCounter'
export { DefaultPrefix } from './slots/shared/DefaultPrefix'
export { DefaultSuffix } from './slots/shared/DefaultSuffix'
export { FieldSkeleton } from './slots/shared/FieldSkeleton'
export type { FieldSkeletonProps } from './slots/shared/FieldSkeleton'
export { DefaultSelectTrigger } from './slots/shared/DefaultSelectTrigger'
export { DefaultSelectOption } from './slots/shared/DefaultSelectOption'
export { DefaultCheckbox } from './slots/shared/DefaultCheckbox'
export { DefaultSwitch } from './slots/shared/DefaultSwitch'
export { DefaultRadioOption } from './slots/shared/DefaultRadioOption'

// Re-export core types for consumer convenience
export type {
  FieldState,
  FieldResolver,
  CoreFormState,
  AdapterType,
  WrapperSlotProps,
  LabelSlotProps,
  ErrorSlotProps,
  HintSlotProps,
  PrefixSlotProps,
  SuffixSlotProps,
  CounterSlotProps,
  TextInputSlotProps,
  TextareaSlotProps,
  NumberInputSlotProps,
  SelectTriggerSlotProps,
  SelectOptionSlotProps,
  CheckboxSlotProps,
  SwitchSlotProps,
  RadioOptionSlotProps,
  StepperButtonSlotProps,
  EmptyStateSlotProps,
  LoadingStateSlotProps,
  SlotComponentMap,
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
} from '@stackform/core'

// Re-export core components
export {
  TextField,
  SelectField,
  CheckboxField,
  SwitchField,
  RadioGroupField,
  NumberField,
  TextareaField,
} from '@stackform/core'

// Re-export core component types
export type {
  TextFieldProps,
  TextFieldSlots,
  TextFieldClassNames,
  SelectFieldProps,
  SelectFieldSlots,
  SelectFieldClassNames,
  SelectOption,
  CheckboxFieldProps,
  CheckboxFieldSlots,
  CheckboxFieldClassNames,
  SwitchFieldProps,
  SwitchFieldSlots,
  SwitchFieldClassNames,
  RadioGroupFieldProps,
  RadioGroupFieldSlots,
  RadioGroupFieldClassNames,
  RadioOption,
  NumberFieldProps,
  NumberFieldSlots,
  NumberFieldClassNames,
  TextareaFieldProps,
  TextareaFieldSlots,
  TextareaFieldClassNames,
} from '@stackform/core'

// Re-export hooks
export { useField, useFieldValue, useValidate } from '@stackform/core'

// Re-export utilities
export {
  resolveSlots,
  resolveSlotProps,
  resolveClassNames,
  toFieldId,
  toDescribedBy,
} from '@stackform/core'
