import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from '@tanstack/react-form'
import type { ReactNode } from 'react'
import { TanstackFormProvider } from '../index'
import { TextField } from '@stackform/core'

// @stackform/ui is not a dependency of this package.
// TextField renders with built-in HTML fallbacks when no slot defaults are provided.
// The integration is tested at the adapter layer: context wiring, field state, and DOM output.

function TanstackWrapper({
  children,
  defaultValues = { name: '' },
}: {
  children: ReactNode
  defaultValues?: Record<string, string>
}): ReactNode {
  const form = useForm({ defaultValues })
  return <TanstackFormProvider form={form}>{children}</TanstackFormProvider>
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

  it('disabled=true disables the input', () => {
    render(
      <TanstackWrapper>
        <TextField name="name" label="Full name" disabled={true} />
      </TanstackWrapper>
    )
    expect(screen.getByRole('textbox')).toBeDisabled()
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
})
