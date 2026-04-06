import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import type { ReactNode } from 'react'
import { useStackFormContext } from '@stackform/core'
import { RHFFormProvider, useRHFFormState } from '../index'

function Wrapper({
  formId,
  disabled,
  children,
}: {
  formId?: string
  disabled?: boolean
  children: ReactNode
}): ReactNode {
  const form = useForm({ defaultValues: { name: '' } })
  return (
    <RHFFormProvider form={form} formId={formId} disabled={disabled}>
      {children}
    </RHFFormProvider>
  )
}

describe('RHFFormProvider', () => {
  it('renders children without throwing', () => {
    render(
      <Wrapper>
        <span data-testid="child">hello</span>
      </Wrapper>
    )
    expect(screen.getByTestId('child')).toHaveTextContent('hello')
  })

  it('useStackFormContext() throws outside provider', () => {
    function Orphan(): ReactNode {
      useStackFormContext()
      return null
    }

    expect(() => render(<Orphan />)).toThrow(
      '[StackForm] No form context found'
    )
  })

  it('formState.isSubmitting is false initially', () => {
    function Reader(): ReactNode {
      const ctx = useStackFormContext()
      return <span data-testid="sub">{String(ctx.formState.isSubmitting)}</span>
    }

    render(
      <Wrapper>
        <Reader />
      </Wrapper>
    )
    expect(screen.getByTestId('sub')).toHaveTextContent('false')
  })

  it('formState.disabled=true when provider disabled prop is true', () => {
    function Reader(): ReactNode {
      const ctx = useStackFormContext()
      return <span data-testid="dis">{String(ctx.formState.disabled)}</span>
    }

    render(
      <Wrapper disabled={true}>
        <Reader />
      </Wrapper>
    )
    expect(screen.getByTestId('dis')).toHaveTextContent('true')
  })

  it('formId is available in context', () => {
    function Reader(): ReactNode {
      const ctx = useStackFormContext()
      return <span data-testid="fid">{ctx.formId ?? 'none'}</span>
    }

    render(
      <Wrapper formId="login-form">
        <Reader />
      </Wrapper>
    )
    expect(screen.getByTestId('fid')).toHaveTextContent('login-form')
  })

  it('resolver(name) returns object with __rhfControl', () => {
    function Reader(): ReactNode {
      const ctx = useStackFormContext()
      const result = ctx.resolver('email') as unknown as Record<string, unknown>
      return (
        <span data-testid="resolver">
          {JSON.stringify({
            hasControl: '__rhfControl' in result,
            name: result.name,
          })}
        </span>
      )
    }

    render(
      <Wrapper>
        <Reader />
      </Wrapper>
    )

    const parsed = JSON.parse(screen.getByTestId('resolver').textContent!)
    expect(parsed.hasControl).toBe(true)
    expect(parsed.name).toBe('email')
  })

  it('useRHFFormState returns correct CoreFormState shape', () => {
    function Reader(): ReactNode {
      const state = useRHFFormState()
      return (
        <span data-testid="state">
          {JSON.stringify({
            isSubmitting: state.isSubmitting,
            isSubmitted: state.isSubmitted,
            isValid: state.isValid,
            isDirty: state.isDirty,
            disabled: state.disabled,
          })}
        </span>
      )
    }

    render(
      <Wrapper>
        <Reader />
      </Wrapper>
    )

    const parsed = JSON.parse(screen.getByTestId('state').textContent!)
    expect(parsed).toEqual({
      isSubmitting: false,
      isSubmitted: false,
      isValid: expect.any(Boolean),
      isDirty: false,
      disabled: false,
    })
  })
})
