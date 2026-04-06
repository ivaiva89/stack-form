import type { ReactNode } from 'react'
import type { TextInputSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

export function DefaultInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  placeholder,
  type,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...rest
}: TextInputSlotProps): ReactNode {
  return (
    <input
      id={id}
      name={name}
      type={type ?? 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      className={cn(
        'border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
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
