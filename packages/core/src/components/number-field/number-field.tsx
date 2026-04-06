import type { ReactNode, ComponentType } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  NumberInputSlotProps,
  StepperButtonSlotProps,
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
  validate?: (value: number) => string | undefined
}

export function NumberField({
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
  validate: _validate,
}: NumberFieldProps): ReactNode {
  const ctx = useStackFormContext()
  const field = useField<number>(name, { label })
  const formId = ctx.formId
  const isDisabled = disabledProp ?? ctx.formState.disabled ?? field.disabled

  const id = toFieldId(name, formId)
  const hasError = !!field.error
  const hasHint = !!hint
  const describedBy = toDescribedBy(id, { hasError, hasHint }) || undefined

  const numericValue = typeof field.value === 'number' ? field.value : 0

  const handleChange = (value: number): void => {
    field.onChange(value)
    onValueChange?.(value)
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

  type SlotRecord = Record<string, React.ComponentType<never> | undefined>
  type ClassRecord = Record<string, string | undefined>

  const resolvedSlots = resolveSlots(
    {} as SlotRecord,
    undefined,
    slots as unknown as Partial<SlotRecord>
  ) as unknown as NumberFieldSlots
  const resolvedSlotProps = resolveSlotProps(undefined, slotProps)
  const resolvedClassNames = resolveClassNames(
    undefined,
    undefined,
    classNames as unknown as Partial<ClassRecord>
  ) as unknown as NumberFieldClassNames

  const InputSlot = resolvedSlots.Input
  const IncrementSlot = resolvedSlots.StepperIncrement
  const DecrementSlot = resolvedSlots.StepperDecrement
  const WrapperSlot = resolvedSlots.Wrapper
  const LabelSlot = resolvedSlots.Label
  const ErrorSlot = resolvedSlots.Error
  const HintSlot = resolvedSlots.Hint

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
      onBlur={field.onBlur}
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
      type="number"
      id={id}
      name={name}
      value={numericValue}
      onChange={(e) => {
        const parsed = parseFloat(e.target.value)
        handleChange(Number.isNaN(parsed) ? 0 : parsed)
      }}
      onBlur={field.onBlur}
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
      {labelElement}
      {inputElement}
      {stepperElement}
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
