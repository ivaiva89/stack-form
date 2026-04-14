'use client'

import { forwardRef } from 'react'
import type { ReactNode, ComponentType, ForwardedRef, Ref } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  NumberInputSlotProps,
  StepperButtonSlotProps,
} from '../../types'
import type { ValidateFn } from '../../hooks'
import { useField } from '../../hooks'
import { useFieldRenderers } from '../../hooks/use-field-renderers'

export interface NumberFieldSlots extends BaseSlots {
  Input?: ComponentType<NumberInputSlotProps>
  StepperIncrement?: ComponentType<StepperButtonSlotProps>
  StepperDecrement?: ComponentType<StepperButtonSlotProps>
}

export interface NumberFieldClassNames extends BaseClassNames {
  stepperIncrement?: string
  stepperDecrement?: string
}

export interface NumberFieldProps extends BaseFieldProps<number> {
  min?: number
  max?: number
  step?: number
  placeholder?: string
  showStepper?: boolean
  format?: Intl.NumberFormatOptions
  classNames?: NumberFieldClassNames
  slots?: NumberFieldSlots
  slotProps?: BaseFieldProps<number>['slotProps'] &
    Partial<{
      input: Partial<NumberInputSlotProps>
      stepperIncrement: Partial<StepperButtonSlotProps>
      stepperDecrement: Partial<StepperButtonSlotProps>
    }>
  validate?: ValidateFn<number>
}

export const NumberField = forwardRef(function NumberField(
  {
    name,
    label,
    hint,
    disabled: disabledProp,
    loading = false,
    required,
    min,
    max,
    step = 1,
    placeholder,
    showStepper = false,
    format: _format,
    classNames,
    slots,
    slotProps,
    onValueChange,
    validate,
  }: NumberFieldProps,
  ref: ForwardedRef<HTMLInputElement>
): ReactNode {
  const field = useField<number>(name, { label, validate })
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
  } = useFieldRenderers<NumberFieldSlots, NumberFieldClassNames>(
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

  const numericValue = typeof field.value === 'number' ? field.value : 0

  const handleChange = (value: number): void => {
    field.onChange(value)
    onValueChange?.(value)
  }

  const handleBlur = (): void => {
    field.onBlur()
    field.runValidation(field.value)
  }

  const handleIncrement = (): void => {
    const next = numericValue + step
    if (max != null && next > max) return
    handleChange(next)
  }

  const handleDecrement = (): void => {
    const next = numericValue - step
    if (min != null && next < min) return
    handleChange(next)
  }

  const isIncrementDisabled = isDisabled || (max != null && numericValue >= max)
  const isDecrementDisabled = isDisabled || (min != null && numericValue <= min)

  const InputSlot = resolvedSlots.Input
  const IncrementSlot = resolvedSlots.StepperIncrement
  const DecrementSlot = resolvedSlots.StepperDecrement

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
      value={numericValue}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={isDisabled}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      required={required}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.input}
      {...(resolvedSlotProps.input as
        | Partial<NumberInputSlotProps>
        | undefined)}
    />
  ) : (
    <input
      ref={ref}
      type="number"
      id={id}
      name={name}
      value={numericValue}
      onChange={(e) => {
        const parsed = parseFloat(e.target.value)
        handleChange(Number.isNaN(parsed) ? 0 : parsed)
      }}
      onBlur={handleBlur}
      disabled={isDisabled}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      required={required}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.input}
    />
  )

  const stepperElement =
    showStepper && !loading ? (
      <>
        {DecrementSlot ? (
          <DecrementSlot
            direction="decrement"
            onClick={handleDecrement}
            disabled={isDecrementDisabled}
            className={resolvedClassNames.stepperDecrement}
            {...(resolvedSlotProps.stepperDecrement as
              | Partial<StepperButtonSlotProps>
              | undefined)}
          />
        ) : (
          <button
            type="button"
            onClick={handleDecrement}
            disabled={isDecrementDisabled}
            aria-label={`Decrease ${label ?? name}`}
            className={resolvedClassNames.stepperDecrement}
          >
            −
          </button>
        )}
        {IncrementSlot ? (
          <IncrementSlot
            direction="increment"
            onClick={handleIncrement}
            disabled={isIncrementDisabled}
            className={resolvedClassNames.stepperIncrement}
            {...(resolvedSlotProps.stepperIncrement as
              | Partial<StepperButtonSlotProps>
              | undefined)}
          />
        ) : (
          <button
            type="button"
            onClick={handleIncrement}
            disabled={isIncrementDisabled}
            aria-label={`Increase ${label ?? name}`}
            className={resolvedClassNames.stepperIncrement}
          >
            +
          </button>
        )}
      </>
    ) : null

  return renderWrapper(
    <>
      {labelElement}
      {inputElement}
      {stepperElement}
      {validatingIndicator}
      {errorElement ?? hintElement}
    </>
  )
}) as (props: NumberFieldProps & { ref?: Ref<HTMLInputElement> }) => ReactNode
