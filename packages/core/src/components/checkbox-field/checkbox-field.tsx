import type { ReactNode, ComponentType } from 'react'
import { useRef, useEffect } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  CheckboxSlotProps,
} from '../../types'
import type { ValidateFn } from '../../hooks'
import { useField } from '../../hooks'
import { useStackFormContext, useSlotDefaults } from '../../context'
import {
  resolveSlots,
  resolveSlotProps,
  resolveClassNames,
  toFieldId,
  toDescribedBy,
} from '../../utils'

export interface CheckboxFieldSlots extends BaseSlots {
  Input?: ComponentType<CheckboxSlotProps>
}

export type CheckboxFieldClassNames = BaseClassNames

export interface CheckboxFieldProps extends BaseFieldProps<boolean> {
  indeterminate?: boolean
  labelPosition?: 'left' | 'right'
  classNames?: CheckboxFieldClassNames
  slots?: CheckboxFieldSlots
  slotProps?: BaseFieldProps<boolean>['slotProps'] &
    Partial<{
      input: Partial<CheckboxSlotProps>
    }>
  validate?: ValidateFn<boolean>
}

export function CheckboxField({
  name,
  label,
  hint,
  disabled: disabledProp,
  loading = false,
  required,
  indeterminate = false,
  labelPosition = 'right',
  classNames,
  slots,
  slotProps,
  onValueChange,
  validate,
}: CheckboxFieldProps): ReactNode {
  const ctx = useStackFormContext()
  const slotDefaults = useSlotDefaults()
  const field = useField<boolean>(name, { label, validate })
  const formId = ctx.formId
  const isDisabled = disabledProp ?? ctx.formState.disabled ?? field.disabled

  const id = toFieldId(name, formId)
  const displayError = field.error
  const hasError = !!displayError
  const hasHint = !!hint
  const describedBy = toDescribedBy(id, { hasError, hasHint }) || undefined

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const handleChange = (checked: boolean): void => {
    field.onChange(checked)
    onValueChange?.(checked)
  }

  const handleBlur = (): void => {
    field.onBlur()
    field.runValidation(field.value)
  }

  type SlotRecord = Record<string, React.ComponentType<never> | undefined>
  type ClassRecord = Record<string, string | undefined>

  const resolvedSlots = resolveSlots(
    {} as SlotRecord,
    slotDefaults.slots as Partial<SlotRecord> | undefined,
    slots as unknown as Partial<SlotRecord>
  ) as unknown as CheckboxFieldSlots
  const resolvedSlotProps = resolveSlotProps(slotDefaults.slotProps, slotProps)
  const resolvedClassNames = resolveClassNames(
    undefined,
    slotDefaults.classNames as Partial<ClassRecord> | undefined,
    classNames as unknown as Partial<ClassRecord>
  ) as unknown as CheckboxFieldClassNames

  const InputSlot = resolvedSlots.Input
  const WrapperSlot = resolvedSlots.Wrapper
  const LabelSlot = resolvedSlots.Label
  const ErrorSlot = resolvedSlots.Error
  const HintSlot = resolvedSlots.Hint

  const ariaChecked: 'true' | 'false' | 'mixed' = indeterminate
    ? 'mixed'
    : field.value
      ? 'true'
      : 'false'

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
      checked={!!field.value}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={isDisabled}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.input}
      {...(resolvedSlotProps.input as Partial<CheckboxSlotProps> | undefined)}
    />
  ) : (
    <input
      ref={inputRef}
      type="checkbox"
      id={id}
      name={name}
      checked={!!field.value}
      onChange={(e) => handleChange(e.target.checked)}
      onBlur={handleBlur}
      disabled={isDisabled}
      required={required}
      aria-checked={ariaChecked}
      aria-disabled={isDisabled || undefined}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.input}
    />
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

  const validatingIndicator = field.isValidating ? (
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

  const content = (
    <>
      {labelPosition === 'left' && labelElement}
      {inputElement}
      {labelPosition === 'right' && labelElement}
      {validatingIndicator}
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
