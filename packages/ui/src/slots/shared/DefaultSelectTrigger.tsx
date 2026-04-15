import type { ReactNode } from 'react'
import type { SelectTriggerSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

export function DefaultSelectTrigger({
  id,
  name,
  value,
  selectedLabel,
  placeholder,
  disabled,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...rest
}: SelectTriggerSlotProps): ReactNode {
  const displayValue = selectedLabel ?? value
  return (
    <button
      type="button"
      id={id}
      name={name}
      disabled={disabled}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      className={cn(
        'border-input bg-background ring-offset-background flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        ariaInvalid && 'border-destructive',
        className
      )}
      {...rest}
    >
      <span className={cn(!displayValue && 'text-muted-foreground')}>
        {displayValue || placeholder}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 opacity-50"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )
}
