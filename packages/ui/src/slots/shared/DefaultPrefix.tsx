import type { ReactNode } from 'react'
import type { PrefixSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

export function DefaultPrefix({
  children,
  className,
}: PrefixSlotProps): ReactNode {
  return (
    <div
      className={cn(
        'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  )
}
