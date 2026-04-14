'use client'

import { forwardRef, useRef, useEffect, useCallback } from 'react'
import type { ReactNode, ComponentType, ForwardedRef, Ref } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  CheckboxSlotProps,
} from '../../types'
import type { ValidateFn } from '../../hooks'
import { useField } from '../../hooks'
import { useFieldRenderers } from '../../hooks/use-field-renderers'

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

export const CheckboxField = forwardRef(function CheckboxField(
  {
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
  }: CheckboxFieldProps,
  ref: ForwardedRef<HTMLInputElement>
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
  } = useFieldRenderers<CheckboxFieldSlots, CheckboxFieldClassNames>(
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

  const inputRef = useRef<HTMLInputElement | null>(null)

  const setRef = useCallback(
    (el: HTMLInputElement | null) => {
      inputRef.current = el
      if (typeof ref === 'function') {
        ref(el)
      } else if (ref != null) {
        ref.current = el
      }
    },
    [ref]
  )

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

  const InputSlot = resolvedSlots.Input

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
      checked={(field.value ?? false) as boolean}
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
      ref={setRef}
      type="checkbox"
      id={id}
      name={name}
      checked={(field.value ?? false) as boolean}
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

  return renderWrapper(
    <>
      {labelPosition === 'left' && labelElement}
      {inputElement}
      {labelPosition === 'right' && labelElement}
      {validatingIndicator}
      {errorElement ?? hintElement}
    </>
  )
}) as (props: CheckboxFieldProps & { ref?: Ref<HTMLInputElement> }) => ReactNode
