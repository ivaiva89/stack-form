import type { ReactNode } from 'react'
import type { ErrorSlotProps } from '@stackform/core'

export function DefaultError({
  id,
  message,
  className,
}: ErrorSlotProps): ReactNode {
  return (
    <p
      id={id}
      role="alert"
      className={[
        'text-destructive text-sm',
        'animate-in fade-in slide-in-from-top-1',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {message}
    </p>
  )
}
