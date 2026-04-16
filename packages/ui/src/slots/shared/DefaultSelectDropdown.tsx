import type { ReactNode } from 'react'
import type { DropdownSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

export function DefaultSelectDropdown({
  children,
  className,
}: DropdownSlotProps): ReactNode {
  return (
    <div
      className={cn(
        'bg-background border border-border rounded-md shadow-md max-h-60 overflow-y-auto',
        className
      )}
    >
      {children}
    </div>
  )
}
