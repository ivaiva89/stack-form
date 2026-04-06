import type { ReactNode, ComponentType } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  RadioOptionSlotProps,
} from '../../types'
import type { ValidateFn } from '../../hooks'
import { useField, useValidate } from '../../hooks'
import { useStackFormContext } from '../../context'
import {
  resolveSlots,
  resolveSlotProps,
  resolveClassNames,
  toFieldId,
  toDescribedBy,
} from '../../utils'

export interface RadioOption<T = string> {
  value: T
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupFieldSlots extends BaseSlots {
  Option?: ComponentType<RadioOptionSlotProps>
}

export interface RadioGroupFieldClassNames extends BaseClassNames {
  option?: string
  optionLabel?: string
  optionDescription?: string
  group?: string
}

export interface RadioGroupFieldProps<T = string> extends BaseFieldProps<T> {
  options: RadioOption<T>[]
  orientation?: 'horizontal' | 'vertical'
  classNames?: RadioGroupFieldClassNames
  slots?: RadioGroupFieldSlots
  slotProps?: BaseFieldProps<T>['slotProps'] &
    Partial<{
      option: Partial<RadioOptionSlotProps>
    }>
  validate?: ValidateFn<T>
}

export function RadioGroupField<T = string>({
  name,
  label,
  hint,
  disabled: disabledProp,
  loading = false,
  required,
  options,
  orientation = 'vertical',
  classNames,
  slots,
  slotProps,
  onValueChange,
  validate,
}: RadioGroupFieldProps<T>): ReactNode {
  const ctx = useStackFormContext()
  const field = useField<T>(name, { label })
  const formId = ctx.formId
  const isDisabled = disabledProp ?? ctx.formState.disabled ?? field.disabled

  const id = toFieldId(name, formId)
  const { validationError, isValidating, runValidation } = useValidate(validate)
  const displayError = field.error ?? validationError
  const hasError = !!displayError
  const hasHint = !!hint
  const describedBy = toDescribedBy(id, { hasError, hasHint }) || undefined

  const handleChange = (value: T): void => {
    field.onChange(value)
    onValueChange?.(value)
  }

  const handleBlur = (): void => {
    field.onBlur()
    runValidation(field.value)
  }

  type SlotRecord = Record<string, React.ComponentType<never> | undefined>
  type ClassRecord = Record<string, string | undefined>

  const resolvedSlots = resolveSlots(
    {} as SlotRecord,
    undefined,
    slots as unknown as Partial<SlotRecord>
  ) as unknown as RadioGroupFieldSlots
  const resolvedSlotProps = resolveSlotProps(undefined, slotProps)
  const resolvedClassNames = resolveClassNames(
    undefined,
    undefined,
    classNames as unknown as Partial<ClassRecord>
  ) as unknown as RadioGroupFieldClassNames

  const OptionSlot = resolvedSlots.Option
  const WrapperSlot = resolvedSlots.Wrapper
  const LabelSlot = resolvedSlots.Label
  const ErrorSlot = resolvedSlots.Error
  const HintSlot = resolvedSlots.Hint

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
        <legend id={`${id}-legend`} className={resolvedClassNames.label}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </legend>
      )
    ) : null

  const optionsElement = loading ? (
    <div
      className={resolvedClassNames.group}
      aria-busy="true"
      data-testid={`${id}-skeleton`}
    />
  ) : (
    options.map((opt) => {
      const optValue = String(opt.value)
      const optId = `${id}-${optValue}`
      const isSelected = field.value === opt.value
      const isOptDisabled = isDisabled || !!opt.disabled

      return OptionSlot ? (
        <OptionSlot
          key={optValue}
          value={opt.value as unknown as string}
          label={opt.label}
          disabled={isOptDisabled}
          className={resolvedClassNames.option}
          {...(resolvedSlotProps.option as
            | Partial<RadioOptionSlotProps>
            | undefined)}
        />
      ) : (
        <div key={optValue} className={resolvedClassNames.option}>
          <input
            type="radio"
            id={optId}
            name={name}
            value={optValue}
            checked={isSelected}
            onChange={() => handleChange(opt.value)}
            onBlur={handleBlur}
            disabled={isOptDisabled}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isOptDisabled || undefined}
          />
          <label htmlFor={optId} className={resolvedClassNames.optionLabel}>
            {opt.label}
          </label>
          {opt.description != null && (
            <span className={resolvedClassNames.optionDescription}>
              {opt.description}
            </span>
          )}
        </div>
      )
    })
  )

  const validatingIndicator = isValidating ? (
    <span aria-live="polite" role="status">
      Validating…
    </span>
  ) : null

  const errorElement = hasError ? (
    ErrorSlot ? (
      <ErrorSlot
        id={`${id}-error`}
        message={displayError!}
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
        {displayError}
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

  const groupContent = (
    <fieldset
      role="radiogroup"
      aria-labelledby={label != null ? `${id}-legend` : undefined}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      aria-disabled={isDisabled || undefined}
      aria-required={required || undefined}
      aria-orientation={orientation}
      disabled={isDisabled}
      className={resolvedClassNames.group}
    >
      {labelElement}
      {optionsElement}
      {validatingIndicator}
      {errorElement ?? hintElement}
    </fieldset>
  )

  if (WrapperSlot) {
    return (
      <WrapperSlot
        className={resolvedClassNames.wrapper}
        {...(resolvedSlotProps.wrapper as
          | Partial<import('../../types').WrapperSlotProps>
          | undefined)}
      >
        {groupContent}
      </WrapperSlot>
    )
  }

  return <div className={resolvedClassNames.wrapper}>{groupContent}</div>
}
