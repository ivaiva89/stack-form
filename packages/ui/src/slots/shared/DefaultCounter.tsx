import type { ReactNode } from 'react'
import type { CounterSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

const NEAR_LIMIT_THRESHOLD = 0.9

export function DefaultCounter({
  current,
  max,
  className,
}: CounterSlotProps): ReactNode {
  const isNearLimit = max !== undefined && current >= max * NEAR_LIMIT_THRESHOLD

  return (
    <span
      className={cn(
        'text-muted-foreground text-xs text-right',
        isNearLimit && 'text-destructive',
        className
      )}
    >
      {max !== undefined ? `${current}/${max}` : current}
    </span>
  )
}
