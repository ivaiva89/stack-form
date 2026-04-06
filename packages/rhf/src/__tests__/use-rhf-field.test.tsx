import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import type { UseFormReturn, FieldValues } from 'react-hook-form'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { RHFFormProvider, useRHFField, useRHFFieldInternal } from '../index'

interface FieldDisplayProps {
  name: string
  control: UseFormReturn<FieldValues>['control']
}

function FieldDisplay({ name, control }: FieldDisplayProps): ReactNode {
  const field = useRHFField<string>(control, name)
  return (
    <div>
      <span data-testid="value">{field.value}</span>
      <span data-testid="error">{field.error ?? ''}</span>
      <span data-testid="touched">{String(field.touched)}</span>
      <span data-testid="dirty">{String(field.dirty)}</span>
      <span data-testid="disabled">{String(field.disabled)}</span>
      <input
        data-testid="input"
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        disabled={field.disabled}
      />
    </div>
  )
}

function TestHarness({
  defaultValues,
  disabled,
  fieldName = 'name',
}: {
  defaultValues: Record<string, unknown>
  disabled?: boolean
  fieldName?: string
}): ReactNode {
  const form = useForm({
    defaultValues,
    mode: 'onChange',
  })

  return (
    <RHFFormProvider form={form} disabled={disabled}>
      <FieldDisplay name={fieldName} control={form.control} />
    </RHFFormProvider>
  )
}

describe('useRHFField', () => {
  it('reads initial value correctly', () => {
    render(<TestHarness defaultValues={{ name: 'Alice' }} />)
    expect(screen.getByTestId('value')).toHaveTextContent('Alice')
  })

  it('onChange updates form value', async () => {
    const user = userEvent.setup()
    render(<TestHarness defaultValues={{ name: '' }} />)

    const input = screen.getByTestId('input')
    await user.clear(input)
    await user.type(input, 'Bob')

    expect(screen.getByTestId('value')).toHaveTextContent('Bob')
  })

  it('RHF validation error appears in FieldState.error', async () => {
    function RequiredFieldHarness(): ReactNode {
      const form = useForm({
        defaultValues: { email: '' },
        mode: 'onChange',
      })

      const { register } = form
      useEffect(() => {
        register('email', { required: 'Email is required' })
      }, [register])

      const field = useRHFField<string>(
        form.control as unknown as UseFormReturn<FieldValues>['control'],
        'email'
      )

      return (
        <RHFFormProvider form={form}>
          <div>
            <input
              data-testid="input"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            />
            <span data-testid="error">{field.error ?? ''}</span>
            <button
              data-testid="trigger"
              type="button"
              onClick={() => {
                form.trigger('email')
              }}
            >
              trigger
            </button>
          </div>
        </RHFFormProvider>
      )
    }

    const user = userEvent.setup()
    render(<RequiredFieldHarness />)

    await user.click(screen.getByTestId('trigger'))

    expect(screen.getByTestId('error')).toHaveTextContent('Email is required')
  })

  it('touched=false initially, true after onBlur', async () => {
    const user = userEvent.setup()
    render(<TestHarness defaultValues={{ name: '' }} />)

    expect(screen.getByTestId('touched')).toHaveTextContent('false')

    const input = screen.getByTestId('input')
    await user.click(input)
    await user.tab()

    expect(screen.getByTestId('touched')).toHaveTextContent('true')
  })

  it('field disabled when provider disabled=true (via useRHFFieldInternal)', () => {
    function InternalFieldDisplay({ name }: { name: string }): ReactNode {
      const field = useRHFFieldInternal<string>(name)
      return (
        <input
          data-testid="input"
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          disabled={field.disabled}
        />
      )
    }

    function DisabledHarness(): ReactNode {
      const form = useForm({ defaultValues: { name: '' } })
      return (
        <RHFFormProvider form={form} disabled={true}>
          <InternalFieldDisplay name="name" />
        </RHFFormProvider>
      )
    }

    render(<DisabledHarness />)
    expect(screen.getByTestId('input')).toBeDisabled()
  })

  it('undefined value normalised to empty string', () => {
    render(
      <TestHarness defaultValues={{ name: undefined as unknown as string }} />
    )
    expect(screen.getByTestId('value')).toHaveTextContent('')
  })
})
