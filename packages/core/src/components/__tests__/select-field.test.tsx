import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode, ComponentType } from 'react'
import { SelectField } from '../select-field'
import type { SelectOption } from '../select-field'
import type { SelectTriggerSlotProps } from '../../types'
import { TestFormProvider } from './test-harness'

const OPTIONS: SelectOption<string>[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Charlie' },
]

function renderField(
  props: Partial<Parameters<typeof SelectField>[0]> = {},
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
  const name = props.name ?? 'color'
  return render(
    <TestFormProvider
      fields={{ [name]: { value: '', ...providerProps.fields?.[name] } }}
      formId={providerProps.formId}
      disabled={providerProps.disabled}
      onFieldChange={providerProps.onFieldChange}
    >
      <SelectField name={name} options={OPTIONS} {...props} />
    </TestFormProvider>
  )
}

describe('SelectField', () => {
  it('renders label text correctly', () => {
    renderField({ label: 'Color' })
    expect(screen.getByText('Color')).toBeInTheDocument()
  })

  it('shows error with id matching aria-describedby', () => {
    renderField(
      { name: 'color', label: 'Color' },
      { fields: { color: { value: '', error: 'Pick one' } } }
    )
    const errorEl = screen.getByRole('alert')
    expect(errorEl).toHaveTextContent('Pick one')
    expect(errorEl).toHaveAttribute('id', 'color-error')
    const select = screen.getByRole('combobox')
    expect(select.getAttribute('aria-describedby')).toContain('color-error')
  })

  it('shows hint text with id matching aria-describedby', () => {
    renderField({ name: 'color', label: 'Color', hint: 'Pick a color' })
    const hintEl = screen.getByText('Pick a color')
    expect(hintEl).toHaveAttribute('id', 'color-hint')
    const select = screen.getByRole('combobox')
    expect(select.getAttribute('aria-describedby')).toContain('color-hint')
  })

  it('aria-invalid=true when error present', () => {
    renderField(
      { name: 'color', label: 'Color' },
      { fields: { color: { value: '', error: 'Bad' } } }
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('input disabled when disabled=true', () => {
    renderField({ name: 'color', label: 'Color', disabled: true })
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('input disabled when formState.disabled=true', () => {
    renderField({ name: 'color', label: 'Color' }, { disabled: true })
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('loading=true renders skeleton, no select element', () => {
    renderField({ name: 'color', label: 'Color', loading: true })
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByTestId('color-skeleton')).toBeInTheDocument()
  })

  it('field-level slots.Trigger is resolved via resolveSlots', () => {
    function CustomTrigger(): ReactNode {
      return <div data-testid="custom-trigger">Custom</div>
    }
    renderField({
      name: 'color',
      label: 'Color',
      slots: { Trigger: CustomTrigger },
    })
    expect(screen.getByTestId('custom-trigger')).toBeInTheDocument()
  })

  it('classNames applied to wrapper and label', () => {
    const { container } = renderField({
      name: 'color',
      label: 'Color',
      classNames: { wrapper: 'w-cls', label: 'l-cls' },
    })
    expect(container.firstElementChild).toHaveClass('w-cls')
    expect(screen.getByText('Color')).toHaveClass('l-cls')
  })

  it('onValueChange fires on select change', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    renderField({ name: 'color', label: 'Color', onValueChange })

    await user.selectOptions(screen.getByRole('combobox'), 'b')
    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('loadOptions called on mount with empty string', async () => {
    const loadOptions = vi
      .fn()
      .mockResolvedValue([{ value: 'x', label: 'X-ray' }])
    render(
      <TestFormProvider fields={{ color: { value: '' } }}>
        <SelectField name="color" label="Color" loadOptions={loadOptions} />
      </TestFormProvider>
    )

    await waitFor(() => {
      expect(loadOptions).toHaveBeenCalledWith('')
    })
  })

  it('renders all static options (native select + listbox both render options)', () => {
    renderField({ name: 'color', label: 'Color' })
    // Native fallback renders both <select> and <div role="listbox"> with duplicate option text
    expect(screen.getAllByText('Alpha').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Beta').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Charlie').length).toBeGreaterThanOrEqual(1)
  })

  it('passes selectedLabel (not raw value) to custom Trigger slot', () => {
    const SpyTrigger: ComponentType<SelectTriggerSlotProps> = ({
      selectedLabel,
      value,
    }) => (
      <button type="button" data-testid="spy-trigger">
        {selectedLabel ?? value}
      </button>
    )

    const name = 'color'
    render(
      <TestFormProvider fields={{ [name]: { value: 'b' } }}>
        <SelectField
          name={name}
          options={OPTIONS}
          slots={{ Trigger: SpyTrigger }}
        />
      </TestFormProvider>
    )

    expect(screen.getByTestId('spy-trigger')).toHaveTextContent('Beta')
    expect(screen.getByTestId('spy-trigger')).not.toHaveTextContent('b')
  })
})
