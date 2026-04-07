import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { TextField } from '../text-field'
import { TestFormProvider } from './test-harness'

function renderField(
  props: Partial<Parameters<typeof TextField>[0]> = {},
  providerProps: {
    fields?: Record<
      string,
      { value?: unknown; error?: string; disabled?: boolean }
    >
    formId?: string
    disabled?: boolean
    onFieldChange?: (name: string, value: unknown) => void
  } = {}
): ReturnType<typeof render> {
  const name = props.name ?? 'email'
  return render(
    <TestFormProvider
      fields={{ [name]: { value: '', ...providerProps.fields?.[name] } }}
      formId={providerProps.formId}
      disabled={providerProps.disabled}
      onFieldChange={providerProps.onFieldChange}
    >
      <TextField name={name} {...props} />
    </TestFormProvider>
  )
}

describe('TextField', () => {
  it('renders label text correctly', () => {
    renderField({ label: 'Email' })
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('shows error with id matching aria-describedby', () => {
    renderField(
      { name: 'email', label: 'Email' },
      { fields: { email: { value: '', error: 'Required' } } }
    )
    const errorEl = screen.getByRole('alert')
    expect(errorEl).toHaveTextContent('Required')
    expect(errorEl).toHaveAttribute('id', 'email-error')
    const input = screen.getByRole('textbox')
    expect(input.getAttribute('aria-describedby')).toContain('email-error')
  })

  it('shows hint text with id matching aria-describedby', () => {
    renderField({ name: 'email', label: 'Email', hint: "We won't share it" })
    const hintEl = screen.getByText("We won't share it")
    expect(hintEl).toHaveAttribute('id', 'email-hint')
    const input = screen.getByRole('textbox')
    expect(input.getAttribute('aria-describedby')).toContain('email-hint')
  })

  it('aria-invalid=true when error present', () => {
    renderField(
      { name: 'email', label: 'Email' },
      { fields: { email: { value: '', error: 'Bad' } } }
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('no aria-invalid when no error', () => {
    renderField({ name: 'email', label: 'Email' })
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })

  it('input disabled when disabled=true', () => {
    renderField({ name: 'email', label: 'Email', disabled: true })
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('input disabled when formState.disabled=true', () => {
    renderField({ name: 'email', label: 'Email' }, { disabled: true })
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('loading=true renders skeleton, no input', () => {
    renderField({ name: 'email', label: 'Email', loading: true })
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByTestId('email-skeleton')).toBeInTheDocument()
  })

  it('field-level slots.Input is resolved via resolveSlots', () => {
    function CustomInput(): ReactNode {
      return <input data-testid="custom-input" data-custom="true" />
    }
    renderField({
      name: 'email',
      label: 'Email',
      slots: { Input: CustomInput },
    })
    expect(screen.getByTestId('custom-input')).toBeInTheDocument()
  })

  it('classNames applied to wrapper, label, input, error, hint', () => {
    const { container } = renderField(
      {
        name: 'email',
        label: 'Email',
        hint: 'Help text',
        classNames: {
          wrapper: 'w-cls',
          label: 'l-cls',
          input: 'i-cls',
          hint: 'h-cls',
        },
      },
      { fields: { email: { value: '' } } }
    )
    expect(container.firstElementChild).toHaveClass('w-cls')
    expect(screen.getByText('Email')).toHaveClass('l-cls')
    expect(screen.getByRole('textbox')).toHaveClass('i-cls')
    expect(screen.getByText('Help text')).toHaveClass('h-cls')
  })

  it('error classNames applied', () => {
    renderField(
      {
        name: 'email',
        label: 'Email',
        classNames: { error: 'e-cls' },
      },
      { fields: { email: { value: '', error: 'Bad' } } }
    )
    expect(screen.getByRole('alert')).toHaveClass('e-cls')
  })

  it('onValueChange fires on change with correct value', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    renderField({ name: 'email', label: 'Email', onValueChange })

    await user.type(screen.getByRole('textbox'), 'a')
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('showCount renders counter with current/max', () => {
    renderField(
      { name: 'email', label: 'Email', showCount: true, maxLength: 100 },
      { fields: { email: { value: 'hello' } } }
    )
    expect(screen.getByText('5/100')).toBeInTheDocument()
  })

  it('formId prefixes element IDs', () => {
    renderField({ name: 'email', label: 'Email' }, { formId: 'login' })
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'login-email')
  })
})
