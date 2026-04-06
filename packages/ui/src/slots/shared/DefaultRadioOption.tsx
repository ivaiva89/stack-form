import type { ReactNode } from 'react'
import type { RadioOptionSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

export function DefaultRadioOption<T = string>({
  value,
  label,
  disabled,
  className,
  ...rest
}: RadioOptionSlotProps<T>): ReactNode {
  const inputId = (rest as Record<string, unknown>)['id'] as string | undefined
  const inputName = (rest as Record<string, unknown>)['name'] as
    | string
    | undefined
  const description = (rest as Record<string, unknown>)['description'] as
    | string
    | undefined

  return (
    <div className={cn('flex items-start gap-2', className)}>
      <input
        type="radio"
        id={inputId}
        name={inputName}
        value={String(value)}
        disabled={disabled}
        className={cn(
          'border-input mt-0.5 h-4 w-4 shrink-0 rounded-full border',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'accent-primary'
        )}
        {...rest}
      />
      <div className="flex flex-col gap-0.5">
        {inputId ? (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </label>
        ) : (
          <span className="text-sm font-medium leading-none">{label}</span>
        )}
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>
    </div>
  )
}
