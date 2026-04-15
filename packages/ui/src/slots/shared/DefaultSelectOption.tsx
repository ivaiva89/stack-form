import type { ReactNode } from 'react'
import type { SelectOptionSlotProps } from '@stackform/core'
import { cn } from '../../lib/cn'

export function DefaultSelectOption<T = string>({
  label,
  disabled,
  'aria-selected': ariaSelected,
  onSelect,
  className,
}: SelectOptionSlotProps<T>): ReactNode {
  return (
    <div
      role="option"
      aria-selected={ariaSelected}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onSelect}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm',
        'hover:bg-accent hover:text-accent-foreground',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {ariaSelected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </div>
  )
}
