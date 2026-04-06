import { useStackFormContext } from '@stackform/core'
import type { CoreFormState } from '@stackform/core'

export function useRHFFormState(): CoreFormState {
  return useStackFormContext().formState
}
