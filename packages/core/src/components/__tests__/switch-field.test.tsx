import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { SwitchField } from '../switch-field'
import { TestFormProvider } from './test-harness'

function renderField(
  props: Partial<Parameters<typeof SwitchField>[0]> = {},
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
  const name = props.name ?? 'notify'
  return render(
    <TestFormProvider
      fields={{ [name]: { value: false, ...providerProps.fields?.[name] } }}
      formId={providerProps.formId}
      disabled={providerProps.disabled}
      onFieldChange={providerProps.onFieldChange}
    >
      <SwitchField name={name} {...props} />
    </TestFormProvider>
  )
}

describe('SwitchField', () => {
  it('renders label text correctly', () => {
    renderField({ label: 'Notifications' })
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('shows error with id matching aria-describedby', () => {
    renderField(
      { name: 'notify', label: 'Notify' },
      { fields: { notify: { value: false, error: 'Required' } } }
    )
    const errorEl = screen.getByRole('alert')
    expect(errorEl).toHaveTextContent('Required')
    expect(errorEl).toHaveAttribute('id', 'notify-error')
    const input = screen.getByRole('switch')
    expect(input.getAttribute('aria-describedby')).toContain('notify-error')
  })

  it('shows hint text with id matching aria-describedby', () => {
    renderField({ name: 'notify', label: 'Notify', hint: 'Get alerts' })
    const hintEl = screen.getByText('Get alerts')
    expect(hintEl).toHaveAttribute('id', 'notify-hint')
    const input = screen.getByRole('switch')
    expect(input.getAttribute('aria-describedby')).toContain('notify-hint')
  })

  it('aria-invalid=true when error present', () => {
    renderField(
      { name: 'notify', label: 'Notify' },
      { fields: { notify: { value: false, error: 'Bad' } } }
    )
    expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true')
  })

  it('no aria-invalid when no error', () => {
    renderField({ name: 'notify', label: 'Notify' })
    expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid')
  })

  it('input disabled when disabled=true', () => {
    renderField({ name: 'notify', label: 'Notify', disabled: true })
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('input disabled when formState.disabled=true', () => {
    renderField({ name: 'notify', label: 'Notify' }, { disabled: true })
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('loading=true renders skeleton, no switch', () => {
    renderField({ name: 'notify', label: 'Notify', loading: true })
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
    expect(screen.getByTestId('notify-skeleton')).toBeInTheDocument()
  })

  it('field-level slots.Input is resolved via resolveSlots', () => {
    function CustomSwitch(): ReactNode {
      return <div data-testid="custom-switch">Custom</div>
    }
    renderField({
      name: 'notify',
      label: 'Notify',
      slots: { Switch: CustomSwitch },
    })
    expect(screen.getByTestId('custom-switch')).toBeInTheDocument()
  })

  it('classNames applied to wrapper and label', () => {
    const { container } = renderField({
      name: 'notify',
      label: 'Notify',
      classNames: { wrapper: 'w-cls', label: 'l-cls' },
    })
    expect(container.firstElementChild).toHaveClass('w-cls')
    expect(screen.getByText('Notify')).toHaveClass('l-cls')
  })

  it('onValueChange fires on click with correct value', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    renderField({ name: 'notify', label: 'Notify', onValueChange })

    await user.click(screen.getByRole('switch'))
    expect(onValueChange).toHaveBeenCalledWith(true)
  })

  it('aria-checked reflects current value', () => {
    renderField(
      { name: 'notify', label: 'Notify' },
      { fields: { notify: { value: true } } }
    )
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('aria-checked=false when unchecked', () => {
    renderField(
      { name: 'notify', label: 'Notify' },
      { fields: { notify: { value: false } } }
    )
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('displays onLabel when checked', () => {
    renderField(
      {
        name: 'notify',
        label: 'Notify',
        onLabel: 'Enabled',
        offLabel: 'Disabled',
      },
      { fields: { notify: { value: true } } }
    )
    expect(screen.getByRole('switch')).toHaveTextContent('Enabled')
  })

  it('displays offLabel when unchecked', () => {
    renderField(
      {
        name: 'notify',
        label: 'Notify',
        onLabel: 'Enabled',
        offLabel: 'Disabled',
      },
      { fields: { notify: { value: false } } }
    )
    expect(screen.getByRole('switch')).toHaveTextContent('Disabled')
  })

  it('displays default On/Off when no onLabel/offLabel', () => {
    renderField(
      { name: 'notify', label: 'Notify' },
      { fields: { notify: { value: false } } }
    )
    expect(screen.getByRole('switch')).toHaveTextContent('Off')
  })

  it('labelPosition=left renders label before switch', () => {
    const { container } = renderField({
      name: 'notify',
      label: 'Notify',
      labelPosition: 'left',
    })
    const wrapper = container.firstElementChild!
    const label = wrapper.querySelector('label')!
    const button = wrapper.querySelector('button')!
    const labelIndex = Array.from(wrapper.childNodes).indexOf(label)
    const buttonIndex = Array.from(wrapper.childNodes).indexOf(button)
    expect(labelIndex).toBeLessThan(buttonIndex)
  })

  it('formId prefixes element IDs', () => {
    renderField({ name: 'notify', label: 'Notify' }, { formId: 'settings' })
    expect(screen.getByRole('switch')).toHaveAttribute('id', 'settings-notify')
  })
})
