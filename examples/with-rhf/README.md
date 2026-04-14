# examples/with-rhf

Reference application for **StackForm + React Hook Form**, demonstrating all 7 Tier 1 field components.

## Stack

- [Vite](https://vitejs.dev/) + React 19
- [react-hook-form](https://react-hook-form.com/)
- `@stackform/core`, `@stackform/ui`, `@stackform/rhf`
- Tailwind CSS v4

## Running

```bash
# from the monorepo root
pnpm install
pnpm build          # build all workspace packages first
cd examples/with-rhf
pnpm dev            # http://localhost:5173
```

Or from the example directory directly after building the packages:

```bash
pnpm dev
```

## What each demo shows

### Registration (tab 1)

A full user-registration form using all 7 Tier 1 components:

| Field | Component |
|---|---|
| Full name | `TextField` |
| Email address | `TextField` (type="email") |
| Age | `NumberField` |
| Bio | `TextareaField` with character counter |
| Country | `SelectField` with static options |
| Preferred contact | `RadioGroupField` |
| Newsletter | `SwitchField` |
| Agree to terms | `CheckboxField` |

**Error state:** click "Create account" without filling in required fields to see inline validation errors wired through RHF's `setError`.

### Loading state (tab 2)

All 7 fields rendered with `loading={true}`. Each input element is replaced by a shimmer skeleton placeholder — useful for data-fetching scenarios where default values are loaded asynchronously.

### Slot override (tab 3)

Demonstrates the slot customisation API. A custom `Label` (indigo, uppercase) and `Error` (red with warning icon) component are passed via the `slots` prop at the field level. The standard StackForm wrapper and hint slots remain unchanged, showing how slots can be overridden selectively.

## Key patterns

```tsx
// Wrap once at the page level
<StackFormProvider>
  <RHFFormProvider form={form}>
    <form>
      <TextField name="email" label="Email" type="email" required />
      {/* ... */}
    </form>
  </RHFFormProvider>
</StackFormProvider>
```

```tsx
// Field-level slot override
<TextField
  name="username"
  label="Username"
  slots={{ Label: MyCustomLabel, Error: MyCustomError }}
/>
```

```tsx
// Loading skeleton — no input rendered, shimmer shown instead
<TextField name="email" label="Email" loading />
```
