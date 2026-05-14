# @stackform/rhf

[React Hook Form](https://react-hook-form.com) adapter for [StackForm](https://stack-form-docs.vercel.app). Wraps your `useForm()` instance so any `@stackform/core` field — `TextField`, `SelectField`, `CheckboxField`, etc. — drives RHF state and validation without per-field boilerplate.

## Install

```bash
npm install @stackform/rhf @stackform/core react-hook-form
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `react-hook-form >= 7`, `@stackform/core`.

## Usage

```tsx
import { useForm } from 'react-hook-form'
import { RHFFormProvider } from '@stackform/rhf'
import { TextField } from '@stackform/core'

interface LoginValues {
  email: string
  password: string
}

function LoginForm() {
  const form = useForm<LoginValues>({
    defaultValues: { email: '', password: '' },
  })

  return (
    <RHFFormProvider form={form}>
      <TextField name="email" label="Email" required />
      <TextField name="password" label="Password" type="password" required />
      <button type="submit">Log in</button>
    </RHFFormProvider>
  )
}
```

### Typed field names

Use the `useRHFForm` shortcut for a `field.name()` helper that validates field names against your form schema at compile time:

```tsx
import { useRHFForm } from '@stackform/rhf'
import { TextField } from '@stackform/core'

function LoginForm() {
  const { form, FormProvider, field } = useRHFForm<LoginValues>()

  return (
    <FormProvider>
      <TextField name={field.name('email')} label="Email" />
    </FormProvider>
  )
}
```

## Docs

Full adapter API, validation integration, and migration guide: **[stack-form-docs.vercel.app](https://stack-form-docs.vercel.app)**

## License

MIT
