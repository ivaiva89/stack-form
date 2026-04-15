import type { ReactNode } from 'react'
import type { RadioOptionSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

export function DefaultRadioOption<T = string>({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  onBlur,
  description,
  disabled,
  className,
}: RadioOptionSlotProps<T>): ReactNode {
  return (
    <div className={cn('flex items-start gap-2', className)}>
      <input
        type="radio"
        id={id}
        name={name}
        value={String(value)}
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={cn(
          'border-input mt-0.5 h-4 w-4 shrink-0 rounded-full border',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'accent-primary'
        )}
      />
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-none',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {label}
        </label>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>
    </div>
  )
}
