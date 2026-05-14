# @stackform/valibot

[Valibot](https://valibot.dev) integration for [StackForm](https://stack-form-docs.vercel.app). Extracts constraints (`required`, `min`, `max`, `minLength`, `maxLength`) from a Valibot schema and validates field values against it — same API surface as `@stackform/zod`, picked at install time.

## Install

```bash
npm install @stackform/valibot valibot
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `valibot >= 1.0.0`.

## Usage

```tsx
import * as v from 'valibot'
import { useValibotField } from '@stackform/valibot'
import { TextField } from '@stackform/core'

const emailSchema = v.pipe(
  v.string(),
  v.email(),
  v.minLength(3),
  v.maxLength(120)
)

function EmailField() {
  const { fieldProps, constraints } = useValibotField('email', emailSchema)

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

Works with any adapter — RHF, TanStack, or native — by handing the returned `validate` function to your form library or relying on StackForm's per-field validation.

## Docs

Constraint extraction, error messages, and adapter integration: **[stack-form-docs.vercel.app](https://stack-form-docs.vercel.app)**

## License

MIT
