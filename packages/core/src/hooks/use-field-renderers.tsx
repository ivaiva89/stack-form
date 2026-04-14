'use client'

import type { ReactNode, ComponentType } from 'react'
import type {
  BaseSlots,
  BaseClassNames,
  LabelSlotProps,
  ErrorSlotProps,
  HintSlotProps,
  WrapperSlotProps,
} from '../types'
import {
  resolveSlots,
  resolveSlotProps,
  resolveClassNames,
  toFieldId,
  toDescribedBy,
} from '../utils'
import { useStackFormContext, useSlotDefaults } from '../context'

type SlotRecord = Record<string, ComponentType<never> | undefined>
type ClassRecord = Record<string, string | undefined>
type SlotPropsRecord = Record<string, Record<string, unknown> | undefined>

export interface FieldStateForRenderers {
  error?: string
  isValidating: boolean
  disabled: boolean
}

export interface UseFieldRenderersInput<
  TSlots extends BaseSlots,
  TClassNames extends BaseClassNames,
> {
  name: string
  label?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  slots?: TSlots
  slotProps?: Partial<SlotPropsRecord>
  classNames?: TClassNames
  labelTag?: 'label' | 'legend'
}

export interface UseFieldRenderersReturn<
  TSlots extends BaseSlots,
  TClassNames extends BaseClassNames,
> {
  id: string
  isDisabled: boolean
  hasError: boolean
  displayError: string | undefined
  describedBy: string | undefined
  resolvedSlots: TSlots
  resolvedSlotProps: Partial<SlotPropsRecord>
  resolvedClassNames: TClassNames
  labelElement: ReactNode
  errorElement: ReactNode
  hintElement: ReactNode
  validatingIndicator: ReactNode
  renderWrapper: (content: ReactNode) => ReactNode
}

export function useFieldRenderers<
  TSlots extends BaseSlots = BaseSlots,
  TClassNames extends BaseClassNames = BaseClassNames,
>(
  props: UseFieldRenderersInput<TSlots, TClassNames>,
  fieldState: FieldStateForRenderers
): UseFieldRenderersReturn<TSlots, TClassNames> {
  const {
    name,
    label,
    hint,
    disabled: disabledProp,
    required,
    slots,
    slotProps,
    classNames,
    labelTag = 'label',
  } = props

  const ctx = useStackFormContext()
  const slotDefaults = useSlotDefaults()

  const formId = ctx.formId
  const isDisabled =
    disabledProp ?? ctx.formState.disabled ?? fieldState.disabled

  const id = toFieldId(name, formId)
  const displayError = fieldState.error
  const hasError = !!displayError
  const hasHint = !!hint
  const describedBy = toDescribedBy(id, { hasError, hasHint }) || undefined

  const resolvedSlots = resolveSlots(
    {} as SlotRecord,
    slotDefaults.slots as Partial<SlotRecord> | undefined,
    slots as unknown as Partial<SlotRecord>
  ) as unknown as TSlots

  const resolvedSlotProps = resolveSlotProps(slotDefaults.slotProps, slotProps)

  const resolvedClassNames = resolveClassNames(
    undefined,
    slotDefaults.classNames as Partial<ClassRecord> | undefined,
    classNames as unknown as Partial<ClassRecord>
  ) as unknown as TClassNames

  const LabelSlot = resolvedSlots.Label
  const ErrorSlot = resolvedSlots.Error
  const HintSlot = resolvedSlots.Hint
  const WrapperSlot = resolvedSlots.Wrapper

  const labelElement: ReactNode =
    label != null ? (
      LabelSlot ? (
        <LabelSlot
          htmlFor={id}
          required={required}
          className={resolvedClassNames.label}
          {...(resolvedSlotProps.label as Partial<LabelSlotProps> | undefined)}
        >
          {label}
        </LabelSlot>
      ) : labelTag === 'legend' ? (
        <legend id={`${id}-legend`} className={resolvedClassNames.label}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </legend>
      ) : (
        <label htmlFor={id} className={resolvedClassNames.label}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      )
    ) : null

  const errorElement: ReactNode = hasError ? (
    ErrorSlot ? (
      <ErrorSlot
        id={`${id}-error`}
        message={displayError!}
        className={resolvedClassNames.error}
        {...(resolvedSlotProps.error as Partial<ErrorSlotProps> | undefined)}
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

  const hintElement: ReactNode =
    hasHint && !hasError ? (
      HintSlot ? (
        <HintSlot
          id={`${id}-hint`}
          className={resolvedClassNames.hint}
          {...(resolvedSlotProps.hint as Partial<HintSlotProps> | undefined)}
        >
          {hint}
        </HintSlot>
      ) : (
        <span id={`${id}-hint`} className={resolvedClassNames.hint}>
          {hint}
        </span>
      )
    ) : null

  const validatingIndicator: ReactNode = fieldState.isValidating ? (
    <span aria-live="polite" role="status">
      Validating…
    </span>
  ) : null

  const renderWrapper = (content: ReactNode): ReactNode => {
    if (WrapperSlot) {
      return (
        <WrapperSlot
          className={resolvedClassNames.wrapper}
          {...(resolvedSlotProps.wrapper as
            | Partial<WrapperSlotProps>
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

  return {
    id,
    isDisabled,
    hasError,
    displayError,
    describedBy,
    resolvedSlots,
    resolvedSlotProps,
    resolvedClassNames,
    labelElement,
    errorElement,
    hintElement,
    validatingIndicator,
    renderWrapper,
  }
}
