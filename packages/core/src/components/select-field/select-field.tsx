import type { ReactNode, ComponentType } from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import type {
  BaseFieldProps,
  BaseSlots,
  BaseClassNames,
  SelectTriggerSlotProps,
  SelectOptionSlotProps,
  EmptyStateSlotProps,
  LoadingStateSlotProps,
} from '../../types'
import type { ValidateFn } from '../../hooks'
import { useField } from '../../hooks'
import { useFieldRenderers } from '../../hooks/use-field-renderers'

export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  group?: string
}

export interface SelectFieldSlots extends BaseSlots {
  Trigger?: ComponentType<SelectTriggerSlotProps>
  Option?: ComponentType<SelectOptionSlotProps>
  EmptyState?: ComponentType<EmptyStateSlotProps>
  LoadingState?: ComponentType<LoadingStateSlotProps>
}

export interface SelectFieldClassNames extends BaseClassNames {
  trigger?: string
  option?: string
  optionGroup?: string
  emptyState?: string
  loadingState?: string
  listbox?: string
}

export interface SelectFieldProps<T = string> extends BaseFieldProps<T> {
  placeholder?: string
  options?: SelectOption<T>[]
  loadOptions?: (search: string) => Promise<SelectOption<T>[]>
  searchable?: boolean
  debounceMs?: number
  classNames?: SelectFieldClassNames
  slots?: SelectFieldSlots
  slotProps?: BaseFieldProps<T>['slotProps'] &
    Partial<{
      trigger: Partial<SelectTriggerSlotProps>
      option: Partial<SelectOptionSlotProps>
      emptyState: Partial<EmptyStateSlotProps>
      loadingState: Partial<LoadingStateSlotProps>
    }>
  validate?: ValidateFn<T>
}

export function SelectField<T = string>({
  name,
  label,
  hint,
  disabled: disabledProp,
  loading = false,
  required,
  placeholder,
  options: staticOptions,
  loadOptions,
  searchable = false,
  debounceMs = 300,
  classNames,
  slots,
  slotProps,
  onValueChange,
  validate,
}: SelectFieldProps<T>): ReactNode {
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
  } = useFieldRenderers<SelectFieldSlots, SelectFieldClassNames>(
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

  const [asyncOptions, setAsyncOptions] = useState<SelectOption<T>[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(!!loadOptions)
  const [searchTerm, setSearchTerm] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!loadOptions) return

    loadOptions('').then(
      (result) => {
        if (mountedRef.current) {
          setAsyncOptions(result)
          setIsLoadingOptions(false)
        }
      },
      () => {
        if (mountedRef.current) {
          setIsLoadingOptions(false)
        }
      }
    )
  }, [loadOptions])

  const handleSearch = useCallback(
    (search: string): void => {
      setSearchTerm(search)

      if (!loadOptions) return

      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        debounceRef.current = null
        setIsLoadingOptions(true)
        loadOptions(search).then(
          (result) => {
            if (mountedRef.current) {
              setAsyncOptions(result)
              setIsLoadingOptions(false)
            }
          },
          () => {
            if (mountedRef.current) {
              setIsLoadingOptions(false)
            }
          }
        )
      }, debounceMs)
    },
    [loadOptions, debounceMs]
  )

  const options = loadOptions ? asyncOptions : (staticOptions ?? [])

  const handleChange = (value: T): void => {
    field.onChange(value)
    onValueChange?.(value)
  }

  const handleBlur = (): void => {
    field.onBlur()
    field.runValidation(field.value)
  }

  const TriggerSlot = resolvedSlots.Trigger
  const OptionSlot = resolvedSlots.Option
  const EmptySlot = resolvedSlots.EmptyState
  const LoadingSlot = resolvedSlots.LoadingState

  const grouped = new Map<string | undefined, SelectOption<T>[]>()
  for (const opt of options) {
    const key = opt.group
    const arr = grouped.get(key)
    if (arr) {
      arr.push(opt)
    } else {
      grouped.set(key, [opt])
    }
  }

  const valueAsString = String(field.value ?? '')

  const triggerElement = loading ? (
    <div
      className={resolvedClassNames.trigger}
      aria-busy="true"
      data-testid={`${id}-skeleton`}
    />
  ) : TriggerSlot ? (
    <TriggerSlot
      id={id}
      name={name}
      value={valueAsString}
      placeholder={placeholder}
      disabled={isDisabled}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.trigger}
      {...(resolvedSlotProps.trigger as
        | Partial<SelectTriggerSlotProps>
        | undefined)}
    />
  ) : (
    <select
      id={id}
      name={name}
      value={valueAsString}
      onChange={(e) => handleChange(e.target.value as unknown as T)}
      onBlur={handleBlur}
      disabled={isDisabled}
      required={required}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      className={resolvedClassNames.trigger}
    >
      {placeholder != null && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {Array.from(grouped.entries()).map(([group, groupOptions]) =>
        group != null ? (
          <optgroup key={group} label={group}>
            {groupOptions.map((opt) => (
              <option
                key={String(opt.value)}
                value={String(opt.value)}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
          </optgroup>
        ) : (
          groupOptions.map((opt) => (
            <option
              key={String(opt.value)}
              value={String(opt.value)}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))
        )
      )}
    </select>
  )

  const renderOption = (opt: SelectOption<T>): ReactNode => {
    const optionValue = String(opt.value)
    return OptionSlot ? (
      <OptionSlot
        key={optionValue}
        value={opt.value as unknown as string}
        label={opt.label}
        disabled={opt.disabled}
        className={resolvedClassNames.option}
        {...(resolvedSlotProps.option as
          | Partial<SelectOptionSlotProps>
          | undefined)}
      />
    ) : (
      <option
        key={optionValue}
        value={optionValue}
        disabled={opt.disabled}
        className={resolvedClassNames.option}
      >
        {opt.label}
      </option>
    )
  }

  const listContent = isLoadingOptions ? (
    LoadingSlot ? (
      <LoadingSlot className={resolvedClassNames.loadingState} />
    ) : (
      <div
        className={resolvedClassNames.loadingState}
        role="status"
        aria-label="Loading options"
      >
        Loading…
      </div>
    )
  ) : options.length === 0 ? (
    EmptySlot ? (
      <EmptySlot
        message="No options"
        className={resolvedClassNames.emptyState}
      />
    ) : (
      <div className={resolvedClassNames.emptyState}>No options</div>
    )
  ) : (
    <div
      role="listbox"
      id={`${id}-listbox`}
      className={resolvedClassNames.listbox}
    >
      {Array.from(grouped.entries()).map(([group, groupOptions]) =>
        group != null ? (
          <div
            key={group}
            role="group"
            aria-label={group}
            className={resolvedClassNames.optionGroup}
          >
            <div role="presentation">{group}</div>
            {groupOptions.map(renderOption)}
          </div>
        ) : (
          groupOptions.map(renderOption)
        )
      )}
    </div>
  )

  const searchElement =
    searchable && !loading ? (
      <input
        type="search"
        aria-label={`Search ${label ?? name}`}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        disabled={isDisabled}
      />
    ) : null

  return renderWrapper(
    <>
      {labelElement}
      {triggerElement}
      {searchElement}
      {!loading && listContent}
      {validatingIndicator}
      {errorElement ?? hintElement}
    </>
  )
}
