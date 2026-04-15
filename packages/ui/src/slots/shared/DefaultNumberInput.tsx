import type { ReactNode } from 'react'
import type { NumberInputSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

export function DefaultNumberInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  placeholder,
  min,
  max,
  step,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...rest
}: NumberInputSlotProps): ReactNode {
  return (
    <input
      id={id}
      name={name}
      type="number"
      value={value}
      onChange={(e) => {
        const parsed = parseFloat(e.target.value)
        onChange(Number.isNaN(parsed) ? 0 : parsed)
      }}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      className={cn(
        'border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm',
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
