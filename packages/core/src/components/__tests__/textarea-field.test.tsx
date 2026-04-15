import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { TextareaField } from '../textarea-field'
import { TestFormProvider } from './test-harness'

function renderField(
  props: Partial<Parameters<typeof TextareaField>[0]> = {},
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
  const name = props.name ?? 'bio'
  return render(
    <TestFormProvider
      fields={{ [name]: { value: '', ...providerProps.fields?.[name] } }}
      formId={providerProps.formId}
      disabled={providerProps.disabled}
      onFieldChange={providerProps.onFieldChange}
    >
      <TextareaField name={name} {...props} />
    </TestFormProvider>
  )
}

describe('TextareaField', () => {
  it('renders label text correctly', () => {
    renderField({ label: 'Bio' })
    expect(screen.getByText('Bio')).toBeInTheDocument()
    expect(screen.getByLabelText('Bio')).toBeInTheDocument()
  })

  it('shows error with id matching aria-describedby', () => {
    renderField(
      { name: 'bio', label: 'Bio' },
      { fields: { bio: { value: '', error: 'Too short' } } }
    )
    const errorEl = screen.getByRole('alert')
    expect(errorEl).toHaveTextContent('Too short')
    expect(errorEl).toHaveAttribute('id', 'bio-error')
    const textarea = screen.getByRole('textbox')
    expect(textarea.getAttribute('aria-describedby')).toContain('bio-error')
  })

  it('shows hint text with id matching aria-describedby', () => {
    renderField({ name: 'bio', label: 'Bio', hint: 'Tell us about you' })
    const hintEl = screen.getByText('Tell us about you')
    expect(hintEl).toHaveAttribute('id', 'bio-hint')
    const textarea = screen.getByRole('textbox')
    expect(textarea.getAttribute('aria-describedby')).toContain('bio-hint')
  })

  it('aria-invalid=true when error present', () => {
    renderField(
      { name: 'bio', label: 'Bio' },
      { fields: { bio: { value: '', error: 'Bad' } } }
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('no aria-invalid when no error', () => {
    renderField({ name: 'bio', label: 'Bio' })
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })

  it('input disabled when disabled=true', () => {
    renderField({ name: 'bio', label: 'Bio', disabled: true })
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('input disabled when formState.disabled=true', () => {
    renderField({ name: 'bio', label: 'Bio' }, { disabled: true })
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('loading=true renders skeleton, no textarea', () => {
    renderField({ name: 'bio', label: 'Bio', loading: true })
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByTestId('bio-skeleton')).toBeInTheDocument()
  })

  it('renders a textarea element, not an input', () => {
    const { container } = renderField({ name: 'bio', label: 'Bio' })
    expect(container.querySelector('textarea')).toBeInTheDocument()
    expect(container.querySelector('input')).not.toBeInTheDocument()
  })

  it('field-level slots.Textarea is resolved via resolveSlots', () => {
    function CustomTextarea(): ReactNode {
      return <div data-testid="custom-textarea">Custom</div>
    }
    renderField({
      name: 'bio',
      label: 'Bio',
      slots: { Textarea: CustomTextarea },
    })
    expect(screen.getByTestId('custom-textarea')).toBeInTheDocument()
  })

  it('classNames applied to wrapper, label, input', () => {
    const { container } = renderField({
      name: 'bio',
      label: 'Bio',
      classNames: { wrapper: 'w-cls', label: 'l-cls', input: 'i-cls' },
    })
    expect(container.firstElementChild).toHaveClass('w-cls')
    expect(screen.getByText('Bio')).toHaveClass('l-cls')
    expect(screen.getByRole('textbox')).toHaveClass('i-cls')
  })

  it('error classNames applied', () => {
    renderField(
      { name: 'bio', label: 'Bio', classNames: { error: 'e-cls' } },
      { fields: { bio: { value: '', error: 'Bad' } } }
    )
    expect(screen.getByRole('alert')).toHaveClass('e-cls')
  })

  it('onValueChange fires on change with correct value', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    renderField({ name: 'bio', label: 'Bio', onValueChange })

    await user.type(screen.getByRole('textbox'), 'a')
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('showCount renders counter with current/max', () => {
    renderField(
      { name: 'bio', label: 'Bio', showCount: true, maxLength: 500 },
      { fields: { bio: { value: 'hello' } } }
    )
    expect(screen.getByText('5/500')).toBeInTheDocument()
  })

  it('rows attribute set on textarea', () => {
    renderField({ name: 'bio', label: 'Bio', rows: 5 })
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5')
  })

  it('default rows is 3', () => {
    renderField({ name: 'bio', label: 'Bio' })
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3')
  })

  it('placeholder attribute set on textarea', () => {
    renderField({ name: 'bio', label: 'Bio', placeholder: 'Write here...' })
    expect(screen.getByPlaceholderText('Write here...')).toBeInTheDocument()
  })

  it('maxLength attribute set on textarea', () => {
    renderField({ name: 'bio', label: 'Bio', maxLength: 200 })
    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '200')
  })

  it('autoResize renders hidden mirror div', () => {
    const { container } = renderField({
      name: 'bio',
      label: 'Bio',
      autoResize: true,
    })
    const mirror = container.querySelector('[aria-hidden="true"]')
    expect(mirror).toBeInTheDocument()
    expect(mirror).toHaveStyle({ visibility: 'hidden', position: 'absolute' })
  })

  it('resize style is none when autoResize=true', () => {
    renderField({ name: 'bio', label: 'Bio', autoResize: true })
    expect(screen.getByRole('textbox')).toHaveStyle({ resize: 'none' })
  })

  it('formId prefixes element IDs', () => {
    renderField({ name: 'bio', label: 'Bio' }, { formId: 'profile' })
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'profile-bio')
  })
})
