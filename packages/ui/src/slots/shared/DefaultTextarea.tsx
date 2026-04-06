import type { ReactNode } from 'react'
import type { TextareaSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

export function DefaultTextarea({
  id,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  placeholder,
  rows,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...rest
}: TextareaSlotProps): ReactNode {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      rows={rows ?? 4}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      className={cn(
        'border-input bg-background ring-offset-background flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        ariaInvalid && 'border-destructive',
        className
      )}
      {...rest}
    />
  )
}
