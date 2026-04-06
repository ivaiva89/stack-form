import type { ReactNode } from 'react'
import { Label } from '@radix-ui/react-label'
import type { LabelSlotProps } from '@stackform/core'

export function DefaultLabel({
  htmlFor,
  required,
  children,
  className,
}: LabelSlotProps): ReactNode {
  return (
    <Label htmlFor={htmlFor} className={className}>
      {children}
      {required && <span aria-hidden="true"> *</span>}
    </Label>
  )
}
