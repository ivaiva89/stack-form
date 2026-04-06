import type { ReactNode } from 'react'
import type { HintSlotProps } from '@stackform/core'

export function DefaultHint({
  id,
  children,
  className,
  hasError,
}: HintSlotProps): ReactNode {
  return (
    <p
      id={id}
      className={[
        'text-muted-foreground text-sm transition-opacity',
        hasError ? 'opacity-0' : 'opacity-100',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  )
}
