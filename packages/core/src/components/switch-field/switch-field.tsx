import type { ReactNode, ComponentType } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  SwitchSlotProps,
} from '../../types'
import { useField } from '../../hooks'
import { useStackFormContext } from '../../context'
import {
  resolveSlots,
  resolveSlotProps,
  resolveClassNames,
  toFieldId,
  toDescribedBy,
} from '../../utils'

export interface SwitchFieldSlots extends BaseSlots {
  Input?: ComponentType<SwitchSlotProps>
}

export type SwitchFieldClassNames = BaseClassNames

export interface SwitchFieldProps extends BaseFieldProps<boolean> {
  onLabel?: string
  offLabel?: string
  size?: 'sm' | 'md' | 'lg'
  labelPosition?: 'left' | 'right'
  classNames?: SwitchFieldClassNames
  slots?: SwitchFieldSlots
  slotProps?: BaseFieldProps<boolean>['slotProps'] &
    Partial<{
      input: Partial<SwitchSlotProps>
    }>
  validate?: (value: boolean) => string | undefined
}

export function SwitchField({
  name,
  label,
  hint,
  disabled: disabledProp,
  loading = false,
  required,
  onLabel,
  offLabel,
  size: _size,
  labelPosition = 'right',
  classNames,
  slots,
  slotProps,
  onValueChange,
  validate: _validate,
}: SwitchFieldProps): ReactNode {
  const ctx = useStackFormContext()
  const field = useField<boolean>(name, { label })
  const formId = ctx.formId
  const isDisabled = disabledProp ?? ctx.formState.disabled ?? field.disabled

  const id = toFieldId(name, formId)
  const hasError = !!field.error
  const hasHint = !!hint
  const describedBy = toDescribedBy(id, { hasError, hasHint }) || undefined

  const handleChange = (checked: boolean): void => {
    field.onChange(checked)
    onValueChange?.(checked)
  }

  type SlotRecord = Record<string, React.ComponentType<never> | undefined>
  type ClassRecord = Record<string, string | undefined>

  const resolvedSlots = resolveSlots(
    {} as SlotRecord,
    undefined,
    slots as unknown as Partial<SlotRecord>
  ) as unknown as SwitchFieldSlots
  const resolvedSlotProps = resolveSlotProps(undefined, slotProps)
  const resolvedClassNames = resolveClassNames(
    undefined,
    undefined,
    classNames as unknown as Partial<ClassRecord>
  ) as unknown as SwitchFieldClassNames

  const InputSlot = resolvedSlots.Input
  const WrapperSlot = resolvedSlots.Wrapper
  const LabelSlot = resolvedSlots.Label
  const ErrorSlot = resolvedSlots.Error
  const HintSlot = resolvedSlots.Hint

  const isChecked = !!field.value
  const statusLabel = isChecked ? onLabel : offLabel

  const inputElement = loading ? (
    <div
      className={resolvedClassNames.input}
      aria-busy="true"
      data-testid={`${id}-skeleton`}
    />
  ) : InputSlot ? (
    <InputSlot
      id={id}
      name={name}
      checked={isChecked}
      onChange={handleChange}
      onBlur={field.onBlur}
      disabled={isDisabled}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.input}
      {...(resolvedSlotProps.input as Partial<SwitchSlotProps> | undefined)}
    />
  ) : (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={isChecked}
      aria-disabled={isDisabled || undefined}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      aria-required={required || undefined}
      disabled={isDisabled}
      onClick={() => handleChange(!isChecked)}
      onBlur={field.onBlur}
      className={resolvedClassNames.input}
    >
      {statusLabel ?? (isChecked ? 'On' : 'Off')}
    </button>
  )

  const labelElement =
    label != null ? (
      LabelSlot ? (
        <LabelSlot
          htmlFor={id}
          required={required}
          className={resolvedClassNames.label}
          {...(resolvedSlotProps.label as
            | Partial<import('../../types').LabelSlotProps>
            | undefined)}
        >
          {label}
        </LabelSlot>
      ) : (
        <label htmlFor={id} className={resolvedClassNames.label}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      )
    ) : null

  const errorElement = hasError ? (
    ErrorSlot ? (
      <ErrorSlot
        id={`${id}-error`}
        message={field.error!}
        className={resolvedClassNames.error}
        {...(resolvedSlotProps.error as
          | Partial<import('../../types').ErrorSlotProps>
          | undefined)}
      />
    ) : (
      <span
        id={`${id}-error`}
        className={resolvedClassNames.error}
        role="alert"
      >
        {field.error}
      </span>
    )
  ) : null

  const hintElement =
    hasHint && !hasError ? (
      HintSlot ? (
        <HintSlot
          id={`${id}-hint`}
          className={resolvedClassNames.hint}
          {...(resolvedSlotProps.hint as
            | Partial<import('../../types').HintSlotProps>
            | undefined)}
        >
          {hint}
        </HintSlot>
      ) : (
        <span id={`${id}-hint`} className={resolvedClassNames.hint}>
          {hint}
        </span>
      )
    ) : null

  const content = (
    <>
      {labelPosition === 'left' && labelElement}
      {inputElement}
      {labelPosition === 'right' && labelElement}
      {errorElement ?? hintElement}
    </>
  )

  if (WrapperSlot) {
    return (
      <WrapperSlot
        className={resolvedClassNames.wrapper}
        {...(resolvedSlotProps.wrapper as
          | Partial<import('../../types').WrapperSlotProps>
          | undefined)}
      >
        {content}
      </WrapperSlot>
    )
  }

  return <div className={resolvedClassNames.wrapper}>{content}</div>
}
