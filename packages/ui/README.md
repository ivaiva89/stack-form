# @stackform/ui

shadcn-flavored default slot components for [StackForm](https://stack-form-docs.vercel.app). Drop this in via `StackFormProvider` to get sensible-looking fields without writing a single style.

Re-exports everything from `@stackform/core` (fields, hooks, types) so you only need to install one package for the typical setup.

## Install

```bash
npm install @stackform/ui @stackform/rhf react-hook-form
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `@radix-ui/react-label`, `class-variance-authority`, `clsx`, `tailwind-merge`. Tailwind CSS is expected in your app.

## Usage

```tsx
import { useForm } from 'react-hook-form'
import { RHFFormProvider } from '@stackform/rhf'
import { StackFormProvider, TextField, SelectField } from '@stackform/ui'

function SignupForm() {
  const form = useForm({ defaultValues: { email: '', role: 'member' } })

  return (
    <RHFFormProvider form={form}>
      <StackFormProvider>
        <TextField name="email" label="Email" required />
        <SelectField
          name="role"
          label="Role"
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'Member', value: 'member' },
          ]}
        />
      </StackFormProvider>
    </RHFFormProvider>
  )
}
```

`StackFormProvider` injects the default slot components. Override any one of them per-field via the `slots` prop, or globally via `StackFormProvider`'s `slots` prop.

## Docs

Slot system, theming, and component reference: **[stack-form-docs.vercel.app](https://stack-form-docs.vercel.app)**

## License

MIT
