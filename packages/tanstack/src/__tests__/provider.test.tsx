import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from '@tanstack/react-form'
import type { ReactNode } from 'react'
import { TanstackFormProvider } from '../index'
import { TextField, CheckboxField, SelectField } from '@stackform/core'
import type { SelectOption } from '@stackform/core'

// @stackform/ui is not a dependency of this package.
// TextField renders with built-in HTML fallbacks when no slot defaults are provided.
// The integration is tested at the adapter layer: context wiring, field state, and DOM output.

const SELECT_OPTIONS: SelectOption<string>[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
]

function TanstackWrapper({
  children,
  defaultValues = { name: '' },
  formId,
  disabled,
}: {
  children: ReactNode
  defaultValues?: Record<string, unknown>
  formId?: string
  disabled?: boolean
}): ReactNode {
  const form = useForm({ defaultValues })
  return (
    <TanstackFormProvider form={form} formId={formId} disabled={disabled}>
      {children}
    </TanstackFormProvider>
  )
}

describe('TanstackFormProvider', () => {
  it('renders a TextField inside TanstackFormProvider — label visible', () => {
    render(
      <TanstackWrapper>
        <TextField name="name" label="Full name" />
      </TanstackWrapper>
    )
    expect(screen.getByText('Full name')).toBeInTheDocument()
    expect(screen.getByLabelText('Full name')).toBeInTheDocument()
  })

  it('TextField reads initial value from TanStack form defaultValues', () => {
    render(
      <TanstackWrapper defaultValues={{ name: 'Alice' }}>
        <TextField name="name" label="Full name" />
      </TanstackWrapper>
    )
    expect(screen.getByRole('textbox')).toHaveValue('Alice')
  })

  it('onChange updates form state — new value appears in DOM after typing', async () => {
    const user = userEvent.setup()
    render(
      <TanstackWrapper defaultValues={{ name: '' }}>
        <TextField name="name" label="Full name" />
      </TanstackWrapper>
    )
    const input = screen.getByLabelText('Full name')
    await user.type(input, 'Alice')
    expect(input).toHaveValue('Alice')
  })

  it('validation error is displayed in the error slot after blur', async () => {
    const user = userEvent.setup()
    render(
      <TanstackWrapper defaultValues={{ name: '' }}>
        <TextField
          name="name"
          label="Full name"
          validate={(v) => (!v ? 'Name is required' : undefined)}
        />
      </TanstackWrapper>
    )
    await user.click(screen.getByLabelText('Full name'))
    await user.tab()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Name is required')
    })
  })

  it('field-level disabled=true disables the input', () => {
    render(
      <TanstackWrapper>
        <TextField name="name" label="Full name" disabled={true} />
      </TanstackWrapper>
    )
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('provider-level disabled=true disables all fields', () => {
    render(
      <TanstackWrapper disabled={true}>
        <TextField name="name" label="Full name" />
        <CheckboxField name="agree" label="Agree" />
      </TanstackWrapper>
    )
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('formId namespaces field element IDs', () => {
    render(
      <TanstackWrapper formId="login" defaultValues={{ email: '' }}>
        <TextField name="email" label="Email" />
      </TanstackWrapper>
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'login-email')
  })

  it('async validate prop shows error after blur, not after typing', async () => {
    const user = userEvent.setup()
    const asyncValidate = vi.fn().mockResolvedValue('Username already taken')
    render(
      <TanstackWrapper defaultValues={{ username: '' }}>
        <TextField name="username" label="Username" validate={asyncValidate} />
      </TanstackWrapper>
    )
    const input = screen.getByLabelText('Username')
    await user.type(input, 'john')
    expect(asyncValidate).not.toHaveBeenCalled()
    await user.tab()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Username already taken'
      )
    })
    expect(asyncValidate).toHaveBeenCalledWith('john')
  })

  describe('CheckboxField', () => {
    it('renders label correctly', () => {
      render(
        <TanstackWrapper defaultValues={{ agree: false }}>
          <CheckboxField name="agree" label="I agree" />
        </TanstackWrapper>
      )
      expect(screen.getByText('I agree')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('reads initial checked state from TanStack form defaultValues', () => {
      render(
        <TanstackWrapper defaultValues={{ agree: true }}>
          <CheckboxField name="agree" label="Agree" />
        </TanstackWrapper>
      )
      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('toggling fires onChange and updates checked state', async () => {
      const user = userEvent.setup()
      render(
        <TanstackWrapper defaultValues={{ agree: false }}>
          <CheckboxField name="agree" label="Agree" />
        </TanstackWrapper>
      )
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    it('shows error slot when validation fails', async () => {
      const user = userEvent.setup()
      render(
        <TanstackWrapper defaultValues={{ agree: false }}>
          <CheckboxField
            name="agree"
            label="Agree"
            validate={(v) => (!v ? 'Must agree' : undefined)}
          />
        </TanstackWrapper>
      )
      await user.click(screen.getByRole('checkbox'))
      await user.click(screen.getByRole('checkbox'))
      await user.tab()
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Must agree')
      })
    })
  })

  describe('SelectField', () => {
    it('renders label and options correctly', () => {
      render(
        <TanstackWrapper defaultValues={{ color: '' }}>
          <SelectField name="color" label="Color" options={SELECT_OPTIONS} />
        </TanstackWrapper>
      )
      expect(screen.getByText('Color')).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('reads initial value from TanStack form defaultValues', () => {
      render(
        <TanstackWrapper defaultValues={{ color: 'b' }}>
          <SelectField name="color" label="Color" options={SELECT_OPTIONS} />
        </TanstackWrapper>
      )
      expect(screen.getByRole('combobox')).toHaveValue('b')
    })

    it('onChange fires and updates selected value', async () => {
      const user = userEvent.setup()
      render(
        <TanstackWrapper defaultValues={{ color: '' }}>
          <SelectField name="color" label="Color" options={SELECT_OPTIONS} />
        </TanstackWrapper>
      )
      await user.selectOptions(screen.getByRole('combobox'), 'b')
      expect(screen.getByRole('combobox')).toHaveValue('b')
    })

    it('shows error slot when validation fails', async () => {
      const user = userEvent.setup()
      render(
        <TanstackWrapper defaultValues={{ color: '' }}>
          <SelectField
            name="color"
            label="Color"
            options={SELECT_OPTIONS}
            validate={(v) => (!v ? 'Pick one' : undefined)}
          />
        </TanstackWrapper>
      )
      await user.click(screen.getByRole('combobox'))
      await user.tab()
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Pick one')
      })
    })
  })
})
