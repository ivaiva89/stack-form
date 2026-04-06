declare const process: { env: { NODE_ENV?: string } } | undefined

import type { ReactNode, ComponentType } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  TextInputSlotProps,
  PrefixSlotProps,
  SuffixSlotProps,
  CounterSlotProps,
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
  validate?: (value: string) => string | undefined
}

export function TextField({
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
  validate: _validate,
}: TextFieldProps): ReactNode {
  const ctx = useStackFormContext()
  const field = useField<string>(name, { label })
  const formId = ctx.formId
  const isDisabled = disabledProp ?? ctx.formState.disabled ?? field.disabled

  const id = toFieldId(name, formId)
  const hasError = !!field.error
  const hasHint = !!hint
  const describedBy = toDescribedBy(id, { hasError, hasHint }) || undefined

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

  type TextFieldSlotsRecord = Record<
    string,
    React.ComponentType<never> | undefined
  >
  type TextFieldClassNamesRecord = Record<string, string | undefined>

  const resolvedSlots = resolveSlots(
    {} as TextFieldSlotsRecord,
    undefined,
    slots as unknown as Partial<TextFieldSlotsRecord>
  ) as unknown as TextFieldSlots
  const resolvedSlotProps = resolveSlotProps(undefined, slotProps)
  const resolvedClassNames = resolveClassNames(
    undefined,
    undefined,
    classNames as unknown as Partial<TextFieldClassNamesRecord>
  ) as unknown as TextFieldClassNames

  const handleChange = (value: string): void => {
    field.onChange(value)
    onValueChange?.(value)
  }

  const WrapperSlot = resolvedSlots.Wrapper
  const LabelSlot = resolvedSlots.Label
  const ErrorSlot = resolvedSlots.Error
  const HintSlot = resolvedSlots.Hint
  const InputSlot = resolvedSlots.Input
  const PrefixSlot = resolvedSlots.Prefix
  const SuffixSlot = resolvedSlots.Suffix
  const CounterSlot = resolvedSlots.Counter

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
      value={field.value}
      onChange={handleChange}
      onBlur={field.onBlur}
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
      id={id}
      name={name}
      value={field.value}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={field.onBlur}
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

  const content = (
    <>
      {labelElement}
      {prefixElement}
      {inputElement}
      {suffixElement}
      {counterElement}
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
