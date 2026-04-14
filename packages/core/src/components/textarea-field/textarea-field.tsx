declare const process: { env: { NODE_ENV?: string } } | undefined

import type { ReactNode, ComponentType } from 'react'
import { useRef, useCallback, useLayoutEffect } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  TextareaSlotProps,
  CounterSlotProps,
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

export interface TextareaFieldSlots extends BaseSlots {
  Input?: ComponentType<TextareaSlotProps>
  Counter?: ComponentType<CounterSlotProps>
}

export interface TextareaFieldClassNames extends BaseClassNames {
  counter?: string
}

export interface TextareaFieldProps extends BaseFieldProps<string> {
  placeholder?: string
  maxLength?: number
  showCount?: boolean
  rows?: number
  maxRows?: number
  autoResize?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  classNames?: TextareaFieldClassNames
  slots?: TextareaFieldSlots
  slotProps?: BaseFieldProps<string>['slotProps'] &
    Partial<{
      input: Partial<TextareaSlotProps>
      counter: Partial<CounterSlotProps>
    }>
  validate?: ValidateFn<string>
}

export function TextareaField({
  name,
  label,
  hint,
  disabled: disabledProp,
  loading = false,
  required,
  placeholder,
  maxLength,
  showCount = false,
  rows = 3,
  maxRows,
  autoResize = false,
  resize = 'vertical',
  classNames,
  slots,
  slotProps,
  onValueChange,
  validate,
}: TextareaFieldProps): ReactNode {
  const ctx = useStackFormContext()
  const slotDefaults = useSlotDefaults()
  const field = useField<string>(name, { label, validate })
  const formId = ctx.formId
  const isDisabled = disabledProp ?? ctx.formState.disabled ?? field.disabled

  const id = toFieldId(name, formId)

  const displayError = field.error
  const hasError = !!displayError
  const hasHint = !!hint
  const describedBy = toDescribedBy(id, { hasError, hasHint }) || undefined

  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV !== 'production' &&
    showCount &&
    maxLength == null
  ) {
    console.warn(
      `[StackForm] TextareaField "${name}": showCount requires maxLength to be set.`
    )
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mirrorRef = useRef<HTMLDivElement>(null)

  const updateHeight = useCallback((): void => {
    const textarea = textareaRef.current
    const mirror = mirrorRef.current
    if (!textarea || !mirror || !autoResize) return

    const computed = getComputedStyle(textarea)
    mirror.style.width = `${textarea.clientWidth}px`
    mirror.style.font = computed.font
    mirror.style.letterSpacing = computed.letterSpacing
    mirror.style.wordSpacing = computed.wordSpacing
    mirror.style.textIndent = computed.textIndent
    mirror.style.textTransform = computed.textTransform
    mirror.style.paddingTop = computed.paddingTop
    mirror.style.paddingRight = computed.paddingRight
    mirror.style.paddingBottom = computed.paddingBottom
    mirror.style.paddingLeft = computed.paddingLeft
    mirror.style.borderTopWidth = computed.borderTopWidth
    mirror.style.borderRightWidth = computed.borderRightWidth
    mirror.style.borderBottomWidth = computed.borderBottomWidth
    mirror.style.borderLeftWidth = computed.borderLeftWidth
    mirror.style.boxSizing = computed.boxSizing
    mirror.style.whiteSpace = 'pre-wrap'
    mirror.style.wordBreak = 'break-word'
    mirror.style.overflowWrap = 'break-word'

    mirror.textContent = textarea.value + '\n'

    let targetHeight = mirror.scrollHeight

    if (maxRows != null) {
      const lineHeight =
        parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.2
      const paddingY =
        parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom)
      const borderY =
        parseFloat(computed.borderTopWidth) +
        parseFloat(computed.borderBottomWidth)
      const maxHeight = lineHeight * maxRows + paddingY + borderY
      targetHeight = Math.min(targetHeight, maxHeight)
    }

    textarea.style.height = `${targetHeight}px`
  }, [autoResize, maxRows])

  useLayoutEffect(() => {
    updateHeight()
  })

  const handleChange = (value: string): void => {
    field.onChange(value)
    onValueChange?.(value)
    requestAnimationFrame(updateHeight)
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
  ) as unknown as TextareaFieldSlots
  const resolvedSlotProps = resolveSlotProps(slotDefaults.slotProps, slotProps)
  const resolvedClassNames = resolveClassNames(
    undefined,
    slotDefaults.classNames as Partial<ClassRecord> | undefined,
    classNames as unknown as Partial<ClassRecord>
  ) as unknown as TextareaFieldClassNames

  const InputSlot = resolvedSlots.Input
  const CounterSlot = resolvedSlots.Counter
  const WrapperSlot = resolvedSlots.Wrapper
  const LabelSlot = resolvedSlots.Label
  const ErrorSlot = resolvedSlots.Error
  const HintSlot = resolvedSlots.Hint

  const current = typeof field.value === 'string' ? field.value.length : 0

  const mirrorElement = autoResize ? (
    <div
      ref={mirrorRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        visibility: 'hidden',
        height: 'auto',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  ) : null

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
      rows={rows}
      required={required}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.input}
      {...(resolvedSlotProps.input as Partial<TextareaSlotProps> | undefined)}
    />
  ) : (
    <textarea
      ref={textareaRef}
      id={id}
      name={name}
      value={field.value ?? ''}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      disabled={isDisabled}
      placeholder={placeholder}
      maxLength={maxLength}
      rows={rows}
      required={required}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.input}
      style={{ resize: autoResize ? 'none' : resize }}
    />
  )

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
      {mirrorElement}
      {inputElement}
      {counterElement}
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

  return (
    <div
      className={resolvedClassNames.wrapper}
      data-error={hasError || undefined}
      data-disabled={isDisabled || undefined}
    >
      {content}
    </div>
  )
}
