# @stackform/tanstack

[TanStack Form](https://tanstack.com/form) adapter for [StackForm](https://stack-form-docs.vercel.app). Wraps a TanStack form instance so any `@stackform/core` field drives TanStack Form state and validation.

## Install

```bash
npm install @stackform/tanstack @stackform/core @tanstack/react-form
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `@tanstack/react-form >= 1.0.0`, `@stackform/core`.

## Usage

```tsx
import { useForm } from '@tanstack/react-form'
import { TanstackFormProvider } from '@stackform/tanstack'
import { TextField } from '@stackform/core'

function SignupForm() {
  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: ({ value }) => console.log(value),
  })

  return (
    <TanstackFormProvider form={form}>
      <TextField name="email" label="Email" required />
      <button onClick={form.handleSubmit}>Sign up</button>
    </TanstackFormProvider>
  )
}
```

Field components read TanStack Form state through `useTanstackField` under the hood, but you'll rarely call it directly — write `<TextField name="..." />` and the adapter handles the rest.

## Docs

Adapter details and TanStack-specific patterns: **[stack-form-docs.vercel.app](https://stack-form-docs.vercel.app)**

## License

MIT
