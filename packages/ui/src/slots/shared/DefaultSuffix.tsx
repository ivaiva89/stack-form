import type { ReactNode } from 'react'
import type { SuffixSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

export function DefaultSuffix({
  children,
  className,
}: SuffixSlotProps): ReactNode {
  return (
    <div
      className={cn(
        'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  )
}
