import type { ReactNode } from 'react'
import type { WrapperSlotProps } from '@stackform/core'

export function DefaultWrapper({
  className,
  children,
  error,
  disabled,
}: WrapperSlotProps): ReactNode {
  return (
    <div
      className={['flex flex-col gap-1.5', className].filter(Boolean).join(' ')}
      data-error={error ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
    >
      {children}
    </div>
  )
}
