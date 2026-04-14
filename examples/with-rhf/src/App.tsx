import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { ComponentType } from 'react'
import {
  StackFormProvider,
  TextField,
  NumberField,
  TextareaField,
  SelectField,
  CheckboxField,
  SwitchField,
  RadioGroupField,
} from '@stackform/ui'
import type { LabelSlotProps, ErrorSlotProps } from '@stackform/ui'
import { RHFFormProvider } from '@stackform/rhf'

// ─── Custom slot components for the Slot Override demo ───────────────────────

function CustomLabel({ htmlFor, children, required }: LabelSlotProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-xs font-semibold uppercase tracking-widest text-indigo-600"
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  )
}

function CustomError({ id, message }: ErrorSlotProps) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600"
    >
      <span aria-hidden="true">⚠</span>
      {message}
    </p>
  )
}

// ─── Shared country + contact options ────────────────────────────────────────

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
]

const CONTACT_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'post', label: 'Post' },
]

// ─── Page 1 — Registration form ──────────────────────────────────────────────

interface RegistrationValues {
  fullName: string
  email: string
  age: number
  bio: string
  country: string
  agreeTerms: boolean
  newsletter: boolean
  contactMethod: string
}

function RegistrationPage() {
  const form = useForm<RegistrationValues>({
    defaultValues: {
      fullName: '',
      email: '',
      age: 0,
      bio: '',
      country: '',
      agreeTerms: false,
      newsletter: false,
      contactMethod: '',
    },
  })
  const [submitSuccess, setSubmitSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const values = form.getValues()

    let hasErrors = false

    if (!values.fullName.trim()) {
      form.setError('fullName', { message: 'Full name is required' })
      hasErrors = true
    } else {
      form.clearErrors('fullName')
    }

    if (!values.email.trim()) {
      form.setError('email', { message: 'Email is required' })
      hasErrors = true
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      form.setError('email', { message: 'Enter a valid email address' })
      hasErrors = true
    } else {
      form.clearErrors('email')
    }

    if (!values.country) {
      form.setError('country', { message: 'Please select a country' })
      hasErrors = true
    } else {
      form.clearErrors('country')
    }

    if (!values.agreeTerms) {
      form.setError('agreeTerms', { message: 'You must agree to the terms' })
      hasErrors = true
    } else {
      form.clearErrors('agreeTerms')
    }

    if (!values.contactMethod) {
      form.setError('contactMethod', {
        message: 'Please choose a contact method',
      })
      hasErrors = true
    } else {
      form.clearErrors('contactMethod')
    }

    if (!hasErrors) {
      setSubmitSuccess(true)
    }
  }

  if (submitSuccess) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-700">
          Registration complete!
        </p>
        <p className="mt-1 text-sm text-green-600">
          Submitted: {form.getValues('fullName')} — {form.getValues('email')}
        </p>
        <button
          className="mt-4 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          onClick={() => {
            form.reset()
            setSubmitSuccess(false)
          }}
        >
          Reset
        </button>
      </div>
    )
  }

  return (
    <StackFormProvider>
      <RHFFormProvider form={form}>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <TextField
            name="fullName"
            label="Full name"
            placeholder="Jane Smith"
            required
          />
          <TextField
            name="email"
            label="Email address"
            type="email"
            placeholder="jane@example.com"
            hint="We'll never share your email."
            required
          />
          <NumberField
            name="age"
            label="Age"
            min={18}
            max={120}
            hint="Must be 18 or older to register."
          />
          <TextareaField
            name="bio"
            label="Bio"
            placeholder="Tell us a little about yourself…"
            maxLength={300}
            showCount
            hint="Optional — up to 300 characters."
          />
          <SelectField
            name="country"
            label="Country"
            placeholder="Select a country"
            options={COUNTRIES}
            required
          />
          <RadioGroupField
            name="contactMethod"
            label="Preferred contact method"
            options={CONTACT_OPTIONS}
            required
          />
          <SwitchField
            name="newsletter"
            label="Subscribe to newsletter"
            hint="You can unsubscribe at any time."
          />
          <CheckboxField
            name="agreeTerms"
            label="I agree to the terms and conditions"
            required
          />

          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Create account
          </button>

          <p className="text-center text-xs text-slate-500">
            Submit the empty form to see validation errors.
          </p>
        </form>
      </RHFFormProvider>
    </StackFormProvider>
  )
}

// ─── Page 2 — Loading / skeleton state ───────────────────────────────────────

function LoadingPage() {
  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      age: 0,
      bio: '',
      country: '',
      contactMethod: '',
      newsletter: false,
      agreeTerms: false,
    },
  })

  return (
    <StackFormProvider>
      <RHFFormProvider form={form}>
        <div className="space-y-5">
          <p className="text-sm text-slate-500">
            All fields below are in{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
              loading=true
            </code>{' '}
            state — the input is replaced with a shimmer skeleton.
          </p>
          <TextField name="fullName" label="Full name" loading />
          <TextField name="email" label="Email address" loading />
          <NumberField name="age" label="Age" loading />
          <TextareaField name="bio" label="Bio" loading />
          <SelectField
            name="country"
            label="Country"
            options={COUNTRIES}
            loading
          />
          <RadioGroupField
            name="contactMethod"
            label="Preferred contact method"
            options={CONTACT_OPTIONS}
            loading
          />
          <SwitchField
            name="newsletter"
            label="Subscribe to newsletter"
            loading
          />
          <CheckboxField
            name="agreeTerms"
            label="I agree to the terms"
            loading
          />
        </div>
      </RHFFormProvider>
    </StackFormProvider>
  )
}

// ─── Page 3 — Slot override demo ─────────────────────────────────────────────

function SlotOverridePage() {
  const form = useForm({
    defaultValues: {
      username: '',
      role: '',
      bio: '',
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const values = form.getValues()

    if (!values.username.trim()) {
      form.setError('username', { message: 'Username cannot be blank' })
      return
    }
    form.clearErrors('username')

    if (!values.role) {
      form.setError('role', { message: 'Please choose a role' })
      return
    }
    form.clearErrors('role')
  }

  const customSlots = {
    Label: CustomLabel as ComponentType<LabelSlotProps>,
    Error: CustomError as ComponentType<ErrorSlotProps>,
  }

  return (
    <StackFormProvider>
      <RHFFormProvider form={form}>
        <div className="space-y-6">
          <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
            <strong>What this shows:</strong> the{' '}
            <code className="rounded bg-indigo-100 px-1 text-xs">Label</code>{' '}
            and{' '}
            <code className="rounded bg-indigo-100 px-1 text-xs">Error</code>{' '}
            slots are replaced with custom components via the{' '}
            <code className="rounded bg-indigo-100 px-1 text-xs">slots</code>{' '}
            prop on each field.
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <TextField
              name="username"
              label="Username"
              placeholder="janedoe"
              required
              slots={customSlots}
            />
            <SelectField
              name="role"
              label="Role"
              placeholder="Choose a role"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'editor', label: 'Editor' },
                { value: 'viewer', label: 'Viewer' },
              ]}
              required
              slots={customSlots}
            />
            <TextareaField
              name="bio"
              label="Bio"
              placeholder="Optional…"
              maxLength={200}
              showCount
              slots={customSlots}
            />

            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Save profile
            </button>
            <p className="text-xs text-slate-500">
              Submit empty to see the custom error style.
            </p>
          </form>
        </div>
      </RHFFormProvider>
    </StackFormProvider>
  )
}

// ─── Navigation ──────────────────────────────────────────────────────────────

type PageId = 'registration' | 'loading' | 'slots'

const PAGES: { id: PageId; label: string }[] = [
  { id: 'registration', label: 'Registration' },
  { id: 'loading', label: 'Loading state' },
  { id: 'slots', label: 'Slot override' },
]

// ─── Root ─────────────────────────────────────────────────────────────────────

export function App() {
  const [page, setPage] = useState<PageId>('registration')

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">
        StackForm + React Hook Form
      </h1>
      <p className="mb-8 text-sm text-slate-500">
        Reference app demonstrating all 7 Tier 1 field components.
      </p>

      {/* Tab navigation */}
      <nav
        className="mb-8 flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1"
        aria-label="Demo sections"
      >
        {PAGES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            aria-current={page === id ? 'page' : undefined}
            className={[
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              page === id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </nav>

      {page === 'registration' && <RegistrationPage />}
      {page === 'loading' && <LoadingPage />}
      {page === 'slots' && <SlotOverridePage />}
    </div>
  )
}
