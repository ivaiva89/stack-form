# @stackform/core

Core field components, context, and slot resolution for [StackForm](https://stack-form-docs.vercel.app) — a headless form library that bridges shadcn/ui with React Hook Form, TanStack Form, and native React state.

This package contains the headless field components (`TextField`, `SelectField`, `CheckboxField`, etc.), the slot resolution system, and the `useField` hook. It depends on no specific form library — pair it with one of the adapter packages (`@stackform/rhf`, `@stackform/tanstack`, `@stackform/native`).

## Install

```bash
npm install @stackform/core @stackform/rhf react-hook-form
```

Peer dependencies: `react >= 18`, `react-dom >= 18`.

## Usage

```tsx
import { useForm } from 'react-hook-form'
import { RHFFormProvider } from '@stackform/rhf'
import { TextField } from '@stackform/core'

function SignupForm() {
  const form = useForm({ defaultValues: { email: '' } })

  return (
    <RHFFormProvider form={form}>
      <TextField name="email" label="Email" required />
    </RHFFormProvider>
  )
}
```

Out of the box, fields render unstyled. Plug in `@stackform/ui` for shadcn-flavored defaults, or pass `slots` / `slotProps` / `classNames` to customize any part of any field.

## Docs

Full API reference, slot system guide, and adapter docs: **[stack-form-docs.vercel.app](https://stack-form-docs.vercel.app)**

## License

MIT
