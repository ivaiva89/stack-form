import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { NativeFormProvider, useNativeForm } from '../index'
import { TextField } from '@stackform/core'

// @stackform/ui is not a dependency of this package.
// TextField renders with built-in HTML fallbacks when no slot defaults are provided.
// The integration is tested at the adapter layer: context wiring, field state, and DOM output.

describe('NativeFormProvider', () => {
  it('renders a TextField inside NativeFormProvider — label visible', () => {
    function Fixture(): ReactNode {
      const form = useNativeForm({ name: '' })
      return (
        <NativeFormProvider form={form}>
          <TextField name="name" label="Full name" />
        </NativeFormProvider>
      )
    }
    render(<Fixture />)
    expect(screen.getByText('Full name')).toBeInTheDocument()
    expect(screen.getByLabelText('Full name')).toBeInTheDocument()
  })

  it('onChange updates values in useNativeForm state', async () => {
    const user = userEvent.setup()
    function Fixture(): ReactNode {
      const form = useNativeForm({ username: '' })
      return (
        <NativeFormProvider form={form}>
          <TextField name="username" label="Username" />
          <span data-testid="value">{form.values.username as string}</span>
        </NativeFormProvider>
      )
    }
    render(<Fixture />)
    await user.type(screen.getByLabelText('Username'), 'hello')
    expect(screen.getByTestId('value')).toHaveTextContent('hello')
  })

  it('error set via setFieldError appears in the error slot', async () => {
    const user = userEvent.setup()
    function Fixture(): ReactNode {
      const form = useNativeForm({ email: '' })
      return (
        <NativeFormProvider form={form}>
          <TextField name="email" label="Email" />
          <button
            type="button"
            onClick={() => form.setFieldError('email', 'Invalid email address')}
          >
            Set error
          </button>
        </NativeFormProvider>
      )
    }
    render(<Fixture />)
    await user.click(screen.getByRole('button', { name: 'Set error' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address')
  })

  it('disabled=true disables the input', () => {
    function Fixture(): ReactNode {
      const form = useNativeForm({ name: '' })
      return (
        <NativeFormProvider form={form} disabled={true}>
          <TextField name="name" label="Full name" />
        </NativeFormProvider>
      )
    }
    render(<Fixture />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('validate prop fires on blur, not on change', async () => {
    const user = userEvent.setup()
    const validate = vi.fn().mockReturnValue('Field is required')
    function Fixture(): ReactNode {
      const form = useNativeForm({ name: '' })
      return (
        <NativeFormProvider form={form}>
          <TextField name="name" label="Full name" validate={validate} />
        </NativeFormProvider>
      )
    }
    render(<Fixture />)
    const input = screen.getByLabelText('Full name')
    await user.type(input, 'test')
    expect(validate).not.toHaveBeenCalled()
    await user.tab()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Field is required')
    })
    expect(validate).toHaveBeenCalledTimes(1)
  })
})
