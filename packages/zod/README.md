# @stackform/zod

[Zod](https://zod.dev) integration for [StackForm](https://stack-form-docs.vercel.app). Extracts constraints (`required`, `min`, `max`, `minLength`, `maxLength`) from a Zod schema and validates field values against it — so a StackForm field can mirror your schema without redeclaring rules in JSX.

## Install

```bash
npm install @stackform/zod zod
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `zod >= 3.0.0`.

## Usage

```tsx
import { z } from 'zod'
import { useZodField } from '@stackform/zod'
import { TextField } from '@stackform/core'

const emailSchema = z.string().email().min(3).max(120)

function EmailField() {
  const { fieldProps, constraints } = useZodField('email', emailSchema)

  return (
    <TextField
      name="email"
      label="Email"
      required={constraints.required}
      maxLength={constraints.maxLength}
      {...fieldProps}
    />
  )
}
```

Use with any adapter — RHF, TanStack, or native — by passing the returned `validate` function through to your form library, or letting StackForm's per-field validation wire it for you.

## Docs

Constraint extraction, error messages, and adapter integration: **[stack-form-docs.vercel.app](https://stack-form-docs.vercel.app)**

## License

MIT
