# StackForm

Headless form component library for React and Next.js. Bridges [shadcn/ui](https://ui.shadcn.com) with React Hook Form, TanStack Form, and native React state through a unified, accessible, slot-based field API.

**[Documentation →](https://stack-form-docs.vercel.app)**

---

## Features

- Unified field API across React Hook Form, TanStack Form, and native state
- Zero boilerplate for error display, loading states, hints, and character counts
- Slot system — swap any part of a field (label, input, error, wrapper) without rewriting logic
- Accessible by default — correct `aria-describedby`, IDs, and disabled states wired automatically
- Full TypeScript support with strict types

## Packages

| Package | Description |
|---|---|
| `@stackform/core` | Core field components and slot system |
| `@stackform/ui` | shadcn/ui-based default slot implementations |
| `@stackform/rhf` | React Hook Form adapter |
| `@stackform/tanstack` | TanStack Form adapter |
| `@stackform/native` | Native React state adapter |
| `@stackform/zod` | Zod schema adapter |
| `@stackform/valibot` | Valibot schema adapter |

## Installation

```bash
npm install @stackform/core @stackform/ui @stackform/rhf
```

## Quick start

```tsx
import { RHFFormProvider } from '@stackform/rhf'
import { TextField, SelectField } from '@stackform/core'
import { useForm } from 'react-hook-form'

function SignupForm() {
  const form = useForm({ defaultValues: { email: '', role: '' } })

  return (
    <RHFFormProvider form={form} onSubmit={form.handleSubmit(console.log)}>
      <TextField name="email" label="Email" />
      <SelectField
        name="role"
        label="Role"
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'Member', value: 'member' },
        ]}
      />
      <button type="submit">Sign up</button>
    </RHFFormProvider>
  )
}
```

For full API docs, guides, and examples see **[stack-form-docs.vercel.app](https://stack-form-docs.vercel.app)**.

## License

MIT
