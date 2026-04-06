import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { RadioGroupField } from '../radio-group-field'
import type { RadioOption } from '../radio-group-field'
import { TestFormProvider } from './test-harness'

const OPTIONS: RadioOption<string>[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]

function renderField(
  props: Partial<Parameters<typeof RadioGroupField>[0]> = {},
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
  const name = props.name ?? 'size'
  return render(
    <TestFormProvider
      fields={{ [name]: { value: '', ...providerProps.fields?.[name] } }}
      formId={providerProps.formId}
      disabled={providerProps.disabled}
      onFieldChange={providerProps.onFieldChange}
    >
      <RadioGroupField name={name} options={OPTIONS} {...props} />
    </TestFormProvider>
  )
}

describe('RadioGroupField', () => {
  it('renders label text correctly', () => {
    renderField({ label: 'Size' })
    expect(screen.getByText('Size')).toBeInTheDocument()
  })

  it('shows error with id matching aria-describedby', () => {
    renderField(
      { name: 'size', label: 'Size' },
      { fields: { size: { value: '', error: 'Pick one' } } }
    )
    const errorEl = screen.getByRole('alert')
    expect(errorEl).toHaveTextContent('Pick one')
    expect(errorEl).toHaveAttribute('id', 'size-error')
  })

  it('shows hint text', () => {
    renderField({ name: 'size', label: 'Size', hint: 'Choose carefully' })
    expect(screen.getByText('Choose carefully')).toHaveAttribute(
      'id',
      'size-hint'
    )
  })

  it('fieldset has aria-invalid=true when error present', () => {
    renderField(
      { name: 'size', label: 'Size' },
      { fields: { size: { value: '', error: 'Bad' } } }
    )
    expect(screen.getByRole('radiogroup')).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })

  it('all radios disabled when disabled=true', () => {
    renderField({ name: 'size', label: 'Size', disabled: true })
    const radios = screen.getAllByRole('radio')
    radios.forEach((radio) => expect(radio).toBeDisabled())
  })

  it('all radios disabled when formState.disabled=true', () => {
    renderField({ name: 'size', label: 'Size' }, { disabled: true })
    const radios = screen.getAllByRole('radio')
    radios.forEach((radio) => expect(radio).toBeDisabled())
  })

  it('loading=true renders skeleton, no radio inputs', () => {
    renderField({ name: 'size', label: 'Size', loading: true })
    expect(screen.queryAllByRole('radio')).toHaveLength(0)
    expect(screen.getByTestId('size-skeleton')).toBeInTheDocument()
  })

  it('slots.Option not resolved when core defaults lack Option key (resolveSlots design)', () => {
    function CustomOption(props: { value: string; label: string }): ReactNode {
      return <div data-testid={`custom-${props.value}`}>{props.label}</div>
    }
    renderField({
      name: 'size',
      label: 'Size',
      slots: { Option: CustomOption },
    })
    // resolveSlots iterates coreDefaults keys — empty defaults means field slots are not picked up
    expect(screen.queryByTestId('custom-sm')).not.toBeInTheDocument()
    // native radio inputs render instead
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('classNames applied to wrapper', () => {
    const { container } = renderField({
      name: 'size',
      label: 'Size',
      classNames: { wrapper: 'w-cls' },
    })
    expect(container.firstElementChild).toHaveClass('w-cls')
  })

  it('onValueChange fires on radio selection', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    renderField({ name: 'size', label: 'Size', onValueChange })

    await user.click(screen.getByLabelText('Medium'))
    expect(onValueChange).toHaveBeenCalledWith('md')
  })

  it('all options render with correct labels', () => {
    renderField({ label: 'Size' })
    expect(screen.getByLabelText('Small')).toBeInTheDocument()
    expect(screen.getByLabelText('Medium')).toBeInTheDocument()
    expect(screen.getByLabelText('Large')).toBeInTheDocument()
  })

  it('correct aria-checked per option', () => {
    renderField(
      { name: 'size', label: 'Size' },
      { fields: { size: { value: 'md' } } }
    )
    const small = screen.getByLabelText('Small')
    const medium = screen.getByLabelText('Medium')
    const large = screen.getByLabelText('Large')
    expect(small).toHaveAttribute('aria-checked', 'false')
    expect(medium).toHaveAttribute('aria-checked', 'true')
    expect(large).toHaveAttribute('aria-checked', 'false')
  })

  it('radiogroup role is present on fieldset', () => {
    renderField({ label: 'Size' })
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })
})
