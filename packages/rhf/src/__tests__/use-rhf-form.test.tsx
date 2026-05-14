import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRHFForm } from '../use-rhf-form'

interface TestValues {
  email: string
  password: string
  rememberMe: boolean
}

describe('useRHFForm', () => {
  it('returns form, FormProvider, and field', () => {
    const { result } = renderHook(() => useRHFForm<TestValues>())
    expect(result.current.form).toBeDefined()
    expect(result.current.FormProvider).toBeTypeOf('function')
    expect(result.current.field).toBeDefined()
    expect(result.current.field.name).toBeTypeOf('function')
  })

  it('field.name returns the name unchanged', () => {
    const { result } = renderHook(() => useRHFForm<TestValues>())
    expect(result.current.field.name('email')).toBe('email')
    expect(result.current.field.name('password')).toBe('password')
    expect(result.current.field.name('rememberMe')).toBe('rememberMe')
  })

  it('field.name is stable across rerenders', () => {
    const { result, rerender } = renderHook(() => useRHFForm<TestValues>())
    const first = result.current.field.name
    rerender()
    expect(result.current.field.name).toBe(first)
  })

  it('FormProvider is stable across rerenders', () => {
    const { result, rerender } = renderHook(() => useRHFForm<TestValues>())
    const first = result.current.FormProvider
    rerender()
    expect(result.current.FormProvider).toBe(first)
  })
})
