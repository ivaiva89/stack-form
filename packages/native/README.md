# @stackform/native

Native React state adapter for [StackForm](https://stack-form-docs.vercel.app) — no form library required. `useNativeForm` gives you `useState`-backed form state, and `NativeFormProvider` makes it drive any `@stackform/core` field.

Use this when you want StackForm's field components and slot system but don't want to pull in React Hook Form or TanStack Form.

## Install

```bash
npm install @stackform/native @stackform/core
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `@stackform/core`.

## Usage

```tsx
import { NativeFormProvider, useNativeForm } from '@stackform/native'
import { TextField } from '@stackform/core'

function ContactForm() {
  const form = useNativeForm({ name: '', email: '' })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit(async (values) => console.log(values))
      }}
    >
      <NativeFormProvider form={form}>
        <TextField name="name" label="Name" required />
        <TextField name="email" label="Email" required />
      </NativeFormProvider>
      <button type="submit">Send</button>
    </form>
  )
}
```

`useNativeForm` returns `values`, `errors`, `touched`, `setFieldValue`, `setFieldError`, `reset`, and `handleSubmit` — enough for the common case without external dependencies.

## Docs

Full hook reference and patterns: **[stack-form-docs.vercel.app](https://stack-form-docs.vercel.app)**

## License

MIT
