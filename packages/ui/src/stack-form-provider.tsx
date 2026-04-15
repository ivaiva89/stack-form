'use client'

import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { SlotDefaultsContext } from '@stackform/core'
import type { SlotDefaultsContextValue } from '@stackform/core'
import { DefaultWrapper } from './slots/shared/DefaultWrapper'
import { DefaultLabel } from './slots/shared/DefaultLabel'
import { DefaultError } from './slots/shared/DefaultError'
import { DefaultHint } from './slots/shared/DefaultHint'
import { DefaultInput } from './slots/shared/DefaultInput'
import { DefaultNumberInput } from './slots/shared/DefaultNumberInput'
import { DefaultTextarea } from './slots/shared/DefaultTextarea'
import { DefaultCounter } from './slots/shared/DefaultCounter'
import { DefaultPrefix } from './slots/shared/DefaultPrefix'
import { DefaultSuffix } from './slots/shared/DefaultSuffix'
import { DefaultSelectTrigger } from './slots/shared/DefaultSelectTrigger'
import { DefaultSelectOption } from './slots/shared/DefaultSelectOption'
import { DefaultCheckbox } from './slots/shared/DefaultCheckbox'
import { DefaultSwitch } from './slots/shared/DefaultSwitch'
import { DefaultRadioOption } from './slots/shared/DefaultRadioOption'

const DEFAULT_SLOTS: SlotDefaultsContextValue['slots'] = {
  Wrapper: DefaultWrapper,
  Label: DefaultLabel,
  Error: DefaultError,
  Hint: DefaultHint,
  Input: DefaultInput,
  NumberInput: DefaultNumberInput,
  Textarea: DefaultTextarea,
  Counter: DefaultCounter,
  Prefix: DefaultPrefix,
  Suffix: DefaultSuffix,
  Trigger: DefaultSelectTrigger,
  Option: DefaultSelectOption,
  Checkbox: DefaultCheckbox,
  Switch: DefaultSwitch,
  RadioOption: DefaultRadioOption,
}

export interface StackFormProviderProps {
  children: ReactNode
  formId?: string
  disabled?: boolean
}

export function StackFormProvider({
  children,
}: StackFormProviderProps): ReactNode {
  const value = useMemo<SlotDefaultsContextValue>(
    () => ({
      slots: DEFAULT_SLOTS,
    }),
    []
  )

  return (
    <SlotDefaultsContext.Provider value={value}>
      {children}
    </SlotDefaultsContext.Provider>
  )
}
