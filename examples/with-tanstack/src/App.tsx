import { useForm } from '@tanstack/react-form'
import { StackFormProvider, TextField, CheckboxField } from '@stackform/ui'
import { TanstackFormProvider } from '@stackform/tanstack'

export function App() {
  const form = useForm({
    defaultValues: { name: '', email: '', terms: false },
    onSubmit: async ({ value }) => {
      console.log('Submitted:', value)
    },
  })

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">StackForm + TanStack Form</h1>
      <StackFormProvider>
        <TanstackFormProvider form={form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <TextField name="name" label="Name" placeholder="Your name" />
            <TextField
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              hint="We'll never share your email."
            />
            <CheckboxField
              name="terms"
              label="I agree to the terms and conditions"
            />
            <button
              type="submit"
              disabled={form.state.isSubmitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {form.state.isSubmitting ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </TanstackFormProvider>
      </StackFormProvider>
    </div>
  )
}
