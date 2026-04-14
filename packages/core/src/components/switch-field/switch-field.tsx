'use client'

import { forwardRef } from 'react'
import type { ReactNode, ComponentType, ForwardedRef, Ref } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  SwitchSlotProps,
} from '../../types'
import type { ValidateFn } from '../../hooks'
import { useField } from '../../hooks'
import { useFieldRenderers } from '../../hooks/use-field-renderers'

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
  validate?: ValidateFn<boolean>
}

export const SwitchField = forwardRef(function SwitchField(
  {
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
    validate,
  }: SwitchFieldProps,
  ref: ForwardedRef<HTMLButtonElement>
): ReactNode {
  const field = useField<boolean>(name, { label, validate })
  const {
    id,
    isDisabled,
    hasError,
    describedBy,
    resolvedSlots,
    resolvedSlotProps,
    resolvedClassNames,
    labelElement,
    errorElement,
    hintElement,
    validatingIndicator,
    renderWrapper,
  } = useFieldRenderers<SwitchFieldSlots, SwitchFieldClassNames>(
    {
      name,
      label,
      hint,
      disabled: disabledProp,
      required,
      slots,
      slotProps,
      classNames,
    },
    field
  )

  const handleChange = (checked: boolean): void => {
    field.onChange(checked)
    onValueChange?.(checked)
  }

  const handleBlur = (): void => {
    field.onBlur()
    field.runValidation(field.value)
  }

  const InputSlot = resolvedSlots.Input

  const isChecked = (field.value ?? false) as boolean
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
      onBlur={handleBlur}
      disabled={isDisabled}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.input}
      {...(resolvedSlotProps.input as Partial<SwitchSlotProps> | undefined)}
    />
  ) : (
    <button
      ref={ref}
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
      onBlur={handleBlur}
      className={resolvedClassNames.input}
    >
      {statusLabel ?? (isChecked ? 'On' : 'Off')}
    </button>
  )

  return renderWrapper(
    <>
      {labelPosition === 'left' && labelElement}
      {inputElement}
      {labelPosition === 'right' && labelElement}
      {validatingIndicator}
      {errorElement ?? hintElement}
    </>
  )
}) as (props: SwitchFieldProps & { ref?: Ref<HTMLButtonElement> }) => ReactNode
