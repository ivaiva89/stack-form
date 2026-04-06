import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface FieldSkeletonProps {
  variant?: 'input' | 'textarea' | 'select'
  className?: string
}

const heightMap: Record<NonNullable<FieldSkeletonProps['variant']>, string> = {
  input: 'h-10',
  textarea: 'h-24',
  select: 'h-10',
}

export function FieldSkeleton({
  variant = 'input',
  className,
}: FieldSkeletonProps): ReactNode {
  return (
    <div aria-hidden="true" className={cn('flex flex-col gap-1.5', className)}>
      <div className="animate-pulse bg-muted rounded-md h-4 w-24" />
      <div
        className={cn(
          'animate-pulse bg-muted rounded-md w-full',
          heightMap[variant]
        )}
      />
    </div>
  )
}
