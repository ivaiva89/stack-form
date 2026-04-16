# @stackform/ui

## 2.0.0

### Minor Changes

- 78ca128: Fix slot key mismatches in CheckboxField, SwitchField, RadioGroupField, NumberField, and TextareaField that caused wrong default slot components to be resolved from StackFormProvider; fix RadioGroupField selecting all options simultaneously due to missing controlled props on RadioOptionSlotProps; add DefaultNumberInput slot component to @stackform/ui

### Patch Changes

- e34dfd4: Fix SelectField trigger displaying raw value instead of label, and fix broken open/close behavior when using custom trigger slots
  - `SelectTriggerSlotProps` now includes `selectedLabel?: string` (the human-readable label of the selected option), `isOpen: boolean`, and `onToggle: () => void`
  - `SelectOptionSlotProps` now includes `onSelect: () => void` and `'aria-selected'?: boolean` as a proper typed prop
  - `SelectField` renders the listbox conditionally based on `isOpen` state — it was always visible before
  - `SelectField` adds click-outside handling to close the dropdown
  - `SelectField` separates the custom trigger path from the native `<select>` path — the listbox was previously rendered even for native select (invalid HTML)
  - `DefaultSelectTrigger` wires `onClick={onToggle}`, adds `aria-expanded`/`aria-haspopup`, and rotates the chevron when open
  - `DefaultSelectOption` wires `onClick={onSelect}` and adds `role="option"` — options were previously unclickable

- Updated dependencies [e34dfd4]
- Updated dependencies [78ca128]
- Updated dependencies [e9ada87]
  - @stackform/core@2.0.0

## 1.0.0

### Minor Changes

- 14b7d3f: Add TanStack Form adapter, forwardRef support, CheckboxField tests, NativeFormProvider improvements, WCAG-compliant field ID utils, useFieldRenderers hook, data-error/data-disabled wrapper attributes, and bundle size tracking

### Patch Changes

- Updated dependencies [14b7d3f]
  - @stackform/core@1.0.0

## 0.1.0

### Minor Changes

- Initial public release (0.1.0). Includes all Tier 1 field components (TextField, TextareaField, NumberField, SelectField, CheckboxField, SwitchField, RadioGroupField), RHF/TanStack/Native adapters, Zod and Valibot schema adapters, ref forwarding, slot system, and CLI scaffolding.

### Patch Changes

- Updated dependencies
  - @stackform/core@1.0.0
