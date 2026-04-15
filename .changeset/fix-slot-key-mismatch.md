---
"@stackform/core": patch
"@stackform/ui": minor
---

Fix slot key mismatches in CheckboxField, SwitchField, RadioGroupField, NumberField, and TextareaField that caused wrong default slot components to be resolved from StackFormProvider; fix RadioGroupField selecting all options simultaneously due to missing controlled props on RadioOptionSlotProps; add DefaultNumberInput slot component to @stackform/ui
