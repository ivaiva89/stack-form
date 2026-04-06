import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { CheckboxField } from '../checkbox-field'
import { TestFormProvider } from './test-harness'

function renderField(
  props: Partial<Parameters<typeof CheckboxField>[0]> = {},
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
  const name = props.name ?? 'agree'
  return render(
    <TestFormProvider
      fields={{ [name]: { value: false, ...providerProps.fields?.[name] } }}
      formId={providerProps.formId}
      disabled={providerProps.disabled}
      onFieldChange={providerProps.onFieldChange}
    >
      <CheckboxField name={name} {...props} />
    </TestFormProvider>
  )
}

describe('CheckboxField', () => {
  it('renders label text correctly', () => {
    renderField({ label: 'I agree' })
    expect(screen.getByText('I agree')).toBeInTheDocument()
    expect(screen.getByLabelText('I agree')).toBeInTheDocument()
  })

  it('shows error with id matching aria-describedby', () => {
    renderField(
      { name: 'agree', label: 'Agree' },
      { fields: { agree: { value: false, error: 'Must agree' } } }
    )
    const errorEl = screen.getByRole('alert')
    expect(errorEl).toHaveTextContent('Must agree')
    expect(errorEl).toHaveAttribute('id', 'agree-error')
    const input = screen.getByRole('checkbox')
    expect(input.getAttribute('aria-describedby')).toContain('agree-error')
  })

  it('shows hint text with id matching aria-describedby', () => {
    renderField({ name: 'agree', label: 'Agree', hint: 'Please check' })
    const hintEl = screen.getByText('Please check')
    expect(hintEl).toHaveAttribute('id', 'agree-hint')
    const input = screen.getByRole('checkbox')
    expect(input.getAttribute('aria-describedby')).toContain('agree-hint')
  })

  it('aria-invalid=true when error present', () => {
    renderField(
      { name: 'agree', label: 'Agree' },
      { fields: { agree: { value: false, error: 'Bad' } } }
    )
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('input disabled when disabled=true', () => {
    renderField({ name: 'agree', label: 'Agree', disabled: true })
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('input disabled when formState.disabled=true', () => {
    renderField({ name: 'agree', label: 'Agree' }, { disabled: true })
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('loading=true renders skeleton, no checkbox', () => {
    renderField({ name: 'agree', label: 'Agree', loading: true })
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.getByTestId('agree-skeleton')).toBeInTheDocument()
  })

  it('slots.Input not resolved when core defaults lack Input key (resolveSlots design)', () => {
    function CustomCheck(): ReactNode {
      return <div data-testid="custom-check">Custom</div>
    }
    renderField({
      name: 'agree',
      label: 'Agree',
      slots: { Input: CustomCheck },
    })
    // resolveSlots iterates coreDefaults keys — empty defaults means field slots are not picked up
    expect(screen.queryByTestId('custom-check')).not.toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('classNames applied to wrapper and label', () => {
    const { container } = renderField({
      name: 'agree',
      label: 'Agree',
      classNames: { wrapper: 'w-cls', label: 'l-cls' },
    })
    expect(container.firstElementChild).toHaveClass('w-cls')
    expect(screen.getByText('Agree')).toHaveClass('l-cls')
  })

  it('onValueChange fires on check with correct value', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    renderField({ name: 'agree', label: 'Agree', onValueChange })

    await user.click(screen.getByRole('checkbox'))
    expect(onValueChange).toHaveBeenCalledWith(true)
  })

  it('indeterminate=true sets element.indeterminate via ref', () => {
    renderField({ name: 'agree', label: 'Agree', indeterminate: true })
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
  })

  it('aria-checked=mixed when indeterminate', () => {
    renderField({ name: 'agree', label: 'Agree', indeterminate: true })
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'mixed'
    )
  })

  it('labelPosition=left renders label before input', () => {
    const { container } = renderField({
      name: 'agree',
      label: 'Agree',
      labelPosition: 'left',
    })
    const wrapper = container.firstElementChild!
    const label = wrapper.querySelector('label')!
    const input = wrapper.querySelector('input')!
    const labelIndex = Array.from(wrapper.childNodes).indexOf(label)
    const inputIndex = Array.from(wrapper.childNodes).indexOf(input)
    expect(labelIndex).toBeLessThan(inputIndex)
  })
})
