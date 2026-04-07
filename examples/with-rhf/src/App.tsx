import { useForm } from 'react-hook-form'
import { StackFormProvider, TextField } from '@stackform/ui'
import { RHFFormProvider } from '@stackform/rhf'

interface FormValues {
  email: string
  name: string
}

export function App() {
  const form = useForm<FormValues>({
    defaultValues: { email: '', name: '' },
  })

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data)
  }

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">StackForm + React Hook Form</h1>
      <StackFormProvider>
        <RHFFormProvider form={form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TextField name="name" label="Name" placeholder="Your name" />
            <TextField
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              hint="We'll never share your email."
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Submit
            </button>
          </form>
        </RHFFormProvider>
      </StackFormProvider>
    </div>
  )
}
