'use client'

declare const process: { env: { NODE_ENV?: string } } | undefined

import { forwardRef } from 'react'
import type { ReactNode, ComponentType, ForwardedRef, Ref } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  TextInputSlotProps,
  PrefixSlotProps,
  SuffixSlotProps,
  CounterSlotProps,
} from '../../types'
import type { ValidateFn } from '../../hooks'
import { useField } from '../../hooks'
import { useFieldRenderers } from '../../hooks/use-field-renderers'

export interface TextFieldSlots extends BaseSlots {
  Input?: ComponentType<TextInputSlotProps>
  Prefix?: ComponentType<PrefixSlotProps>
  Suffix?: ComponentType<SuffixSlotProps>
  Counter?: ComponentType<CounterSlotProps>
}

export interface TextFieldClassNames extends BaseClassNames {
  prefix?: string
  suffix?: string
  counter?: string
}

export interface TextFieldProps extends BaseFieldProps<string> {
  placeholder?: string
  maxLength?: number
  showCount?: boolean
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
  prefix?: ReactNode
  suffix?: ReactNode
  classNames?: TextFieldClassNames
  slots?: TextFieldSlots
  slotProps?: BaseFieldProps<string>['slotProps'] &
    Partial<{
      input: Partial<TextInputSlotProps>
      prefix: Partial<PrefixSlotProps>
      suffix: Partial<SuffixSlotProps>
      counter: Partial<CounterSlotProps>
    }>
  validate?: ValidateFn<string>
}

export const TextField = forwardRef(function TextField(
  {
    name,
    label,
    hint,
    disabled: disabledProp,
    loading = false,
    required,
    placeholder,
    maxLength,
    showCount = false,
    type = 'text',
    prefix,
    suffix,
    classNames,
    slots,
    slotProps,
    onValueChange,
    validate,
  }: TextFieldProps,
  ref: ForwardedRef<HTMLInputElement>
): ReactNode {
  const field = useField<string>(name, { label, validate })
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
  } = useFieldRenderers<TextFieldSlots, TextFieldClassNames>(
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

  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV !== 'production' &&
    showCount &&
    maxLength == null
  ) {
    console.warn(
      `[StackForm] TextField "${name}": showCount requires maxLength to be set.`
    )
  }

  const InputSlot = resolvedSlots.Input
  const PrefixSlot = resolvedSlots.Prefix
  const SuffixSlot = resolvedSlots.Suffix
  const CounterSlot = resolvedSlots.Counter

  const handleChange = (value: string): void => {
    field.onChange(value)
    onValueChange?.(value)
  }

  const handleBlur = (): void => {
    field.onBlur()
    field.runValidation(field.value)
  }

  const current = typeof field.value === 'string' ? field.value.length : 0

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
      value={field.value ?? ''}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={isDisabled}
      placeholder={placeholder}
      maxLength={maxLength}
      type={type}
      required={required}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.input}
      {...(resolvedSlotProps.input as Partial<TextInputSlotProps> | undefined)}
    />
  ) : (
    <input
      ref={ref}
      id={id}
      name={name}
      value={field.value ?? ''}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      disabled={isDisabled}
      placeholder={placeholder}
      maxLength={maxLength}
      type={type}
      required={required}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.input}
    />
  )

  const prefixElement =
    prefix != null ? (
      PrefixSlot ? (
        <PrefixSlot
          className={resolvedClassNames.prefix}
          {...(resolvedSlotProps.prefix as
            | Partial<PrefixSlotProps>
            | undefined)}
        >
          {prefix}
        </PrefixSlot>
      ) : (
        <span className={resolvedClassNames.prefix}>{prefix}</span>
      )
    ) : null

  const suffixElement =
    suffix != null ? (
      SuffixSlot ? (
        <SuffixSlot
          className={resolvedClassNames.suffix}
          {...(resolvedSlotProps.suffix as
            | Partial<SuffixSlotProps>
            | undefined)}
        >
          {suffix}
        </SuffixSlot>
      ) : (
        <span className={resolvedClassNames.suffix}>{suffix}</span>
      )
    ) : null

  const counterElement =
    showCount && maxLength != null ? (
      CounterSlot ? (
        <CounterSlot
          current={current}
          max={maxLength}
          className={resolvedClassNames.counter}
          {...(resolvedSlotProps.counter as
            | Partial<CounterSlotProps>
            | undefined)}
        />
      ) : (
        <span className={resolvedClassNames.counter}>
          {current}/{maxLength}
        </span>
      )
    ) : null

  return renderWrapper(
    <>
      {labelElement}
      {prefixElement}
      {inputElement}
      {suffixElement}
      {counterElement}
      {validatingIndicator}
      {errorElement ?? hintElement}
    </>
  )
}) as (props: TextFieldProps & { ref?: Ref<HTMLInputElement> }) => ReactNode
