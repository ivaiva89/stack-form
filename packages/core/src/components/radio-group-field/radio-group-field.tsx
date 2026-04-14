'use client'

import { forwardRef } from 'react'
import type { ReactNode, ComponentType, ForwardedRef, Ref } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  RadioOptionSlotProps,
} from '../../types'
import type { ValidateFn } from '../../hooks'
import { useField } from '../../hooks'
import { useFieldRenderers } from '../../hooks/use-field-renderers'

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

export const RadioGroupField = forwardRef(function RadioGroupField<T = string>(
  {
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
  }: RadioGroupFieldProps<T>,
  ref: ForwardedRef<HTMLFieldSetElement>
): ReactNode {
  const field = useField<T>(name, { label, validate })
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
  } = useFieldRenderers<RadioGroupFieldSlots, RadioGroupFieldClassNames>(
    {
      name,
      label,
      hint,
      disabled: disabledProp,
      required,
      slots,
      slotProps,
      classNames,
      labelTag: 'legend',
    },
    field
  )

  const handleChange = (value: T): void => {
    field.onChange(value)
    onValueChange?.(value)
  }

  const handleBlur = (): void => {
    field.onBlur()
    field.runValidation(field.value)
  }

  const OptionSlot = resolvedSlots.Option

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

  const groupContent = (
    <fieldset
      ref={ref}
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

  return renderWrapper(groupContent)
}) as <T = string>(
  props: RadioGroupFieldProps<T> & { ref?: Ref<HTMLFieldSetElement> }
) => ReactNode
