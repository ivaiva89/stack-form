---
"@stackform/rhf": minor
---

Add `field.name()` to `useRHFForm` for schema-aware field names. The helper is type-only — it returns the name unchanged at runtime but constrains the argument to valid paths on the form's generic, so `<TextField name={field.name('email')} />` catches typos at compile time.
