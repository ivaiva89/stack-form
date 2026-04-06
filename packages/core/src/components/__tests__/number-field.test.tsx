import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { NumberField } from '../number-field'
import { TestFormProvider } from './test-harness'

function renderField(
  props: Partial<Parameters<typeof NumberField>[0]> = {},
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
  const name = props.name ?? 'qty'
  return render(
    <TestFormProvider
      fields={{ [name]: { value: 0, ...providerProps.fields?.[name] } }}
      formId={providerProps.formId}
      disabled={providerProps.disabled}
      onFieldChange={providerProps.onFieldChange}
    >
      <NumberField name={name} {...props} />
    </TestFormProvider>
  )
}

describe('NumberField', () => {
  it('renders label text correctly', () => {
    renderField({ label: 'Quantity' })
    expect(screen.getByText('Quantity')).toBeInTheDocument()
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument()
  })

  it('shows error with id matching aria-describedby', () => {
    renderField(
      { name: 'qty', label: 'Qty' },
      { fields: { qty: { value: 0, error: 'Too low' } } }
    )
    const errorEl = screen.getByRole('alert')
    expect(errorEl).toHaveTextContent('Too low')
    expect(errorEl).toHaveAttribute('id', 'qty-error')
    const input = screen.getByRole('spinbutton')
    expect(input.getAttribute('aria-describedby')).toContain('qty-error')
  })

  it('shows hint text with id matching aria-describedby', () => {
    renderField({ name: 'qty', label: 'Qty', hint: 'Min 1' })
    const hintEl = screen.getByText('Min 1')
    expect(hintEl).toHaveAttribute('id', 'qty-hint')
    const input = screen.getByRole('spinbutton')
    expect(input.getAttribute('aria-describedby')).toContain('qty-hint')
  })

  it('aria-invalid=true when error present', () => {
    renderField(
      { name: 'qty', label: 'Qty' },
      { fields: { qty: { value: 0, error: 'Bad' } } }
    )
    expect(screen.getByRole('spinbutton')).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })

  it('input disabled when disabled=true', () => {
    renderField({ name: 'qty', label: 'Qty', disabled: true })
    expect(screen.getByRole('spinbutton')).toBeDisabled()
  })

  it('input disabled when formState.disabled=true', () => {
    renderField({ name: 'qty', label: 'Qty' }, { disabled: true })
    expect(screen.getByRole('spinbutton')).toBeDisabled()
  })

  it('loading=true renders skeleton, no input', () => {
    renderField({ name: 'qty', label: 'Qty', loading: true })
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
    expect(screen.getByTestId('qty-skeleton')).toBeInTheDocument()
  })

  it('slots.Input not resolved when core defaults lack Input key (resolveSlots design)', () => {
    function CustomInput(): ReactNode {
      return <div data-testid="custom-num">Custom</div>
    }
    renderField({
      name: 'qty',
      label: 'Qty',
      slots: { Input: CustomInput },
    })
    // resolveSlots iterates coreDefaults keys — empty defaults means field slots are not picked up
    expect(screen.queryByTestId('custom-num')).not.toBeInTheDocument()
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  it('classNames applied to wrapper and label', () => {
    const { container } = renderField({
      name: 'qty',
      label: 'Qty',
      classNames: { wrapper: 'w-cls', label: 'l-cls' },
    })
    expect(container.firstElementChild).toHaveClass('w-cls')
    expect(screen.getByText('Qty')).toHaveClass('l-cls')
  })

  it('onValueChange fires on change with numeric value', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    renderField({ name: 'qty', label: 'Qty', onValueChange })

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '42')
    expect(onValueChange).toHaveBeenLastCalledWith(42)
  })

  it('stepper increment button increases value', async () => {
    const onFieldChange = vi.fn()
    const user = userEvent.setup()
    renderField(
      { name: 'qty', label: 'Qty', showStepper: true, step: 1 },
      { fields: { qty: { value: 5 } }, onFieldChange }
    )

    const incBtn = screen.getByLabelText('Increase Qty')
    await user.click(incBtn)
    expect(onFieldChange).toHaveBeenCalledWith('qty', 6)
  })

  it('stepper decrement button decreases value', async () => {
    const onFieldChange = vi.fn()
    const user = userEvent.setup()
    renderField(
      { name: 'qty', label: 'Qty', showStepper: true, step: 1 },
      { fields: { qty: { value: 5 } }, onFieldChange }
    )

    const decBtn = screen.getByLabelText('Decrease Qty')
    await user.click(decBtn)
    expect(onFieldChange).toHaveBeenCalledWith('qty', 4)
  })

  it('stepper increment disabled when value >= max', () => {
    renderField(
      { name: 'qty', label: 'Qty', showStepper: true, max: 10 },
      { fields: { qty: { value: 10 } } }
    )
    expect(screen.getByLabelText('Increase Qty')).toBeDisabled()
  })

  it('stepper decrement disabled when value <= min', () => {
    renderField(
      { name: 'qty', label: 'Qty', showStepper: true, min: 0 },
      { fields: { qty: { value: 0 } } }
    )
    expect(screen.getByLabelText('Decrease Qty')).toBeDisabled()
  })

  it('min/max/step wired as HTML attributes', () => {
    renderField({ name: 'qty', label: 'Qty', min: 1, max: 100, step: 5 })
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('min', '1')
    expect(input).toHaveAttribute('max', '100')
    expect(input).toHaveAttribute('step', '5')
  })
})
