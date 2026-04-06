import { useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { CheckboxSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

export function DefaultCheckbox({
  id,
  name,
  checked,
  onChange,
  onBlur,
  disabled,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...rest
}: CheckboxSlotProps): ReactNode {
  const ref = useRef<HTMLInputElement>(null)
  const indeterminate = (rest as Record<string, unknown>)['indeterminate'] as
    | boolean
    | undefined

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false
    }
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      onBlur={onBlur}
      disabled={disabled}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      className={cn(
        'border-input h-4 w-4 shrink-0 rounded border',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'accent-primary',
        ariaInvalid && 'border-destructive',
        className
      )}
      {...rest}
    />
  )
}
