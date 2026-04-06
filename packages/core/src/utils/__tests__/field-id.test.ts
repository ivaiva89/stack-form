// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { toFieldId, toDescribedBy } from '../../index'

describe('toFieldId', () => {
  it('returns simple name unchanged', () => {
    expect(toFieldId('email')).toBe('email')
  })

  it('replaces dots with dashes', () => {
    expect(toFieldId('address.city')).toBe('address-city')
  })

  it('replaces bracket notation with dashes', () => {
    expect(toFieldId('items[0].name')).toBe('items-0-name')
  })

  it('handles nested bracket + dot notation', () => {
    expect(toFieldId('items[0].address.city')).toBe('items-0-address-city')
  })

  it('prefixes with formId when provided', () => {
    expect(toFieldId('email', 'login-form')).toBe('login-form-email')
  })

  it('prefixes formId with complex name', () => {
    expect(toFieldId('address.city', 'signup')).toBe('signup-address-city')
  })
})

describe('toDescribedBy', () => {
  it('returns both error and hint IDs when both present', () => {
    expect(toDescribedBy('email', { hasError: true, hasHint: true })).toBe(
      'email-error email-hint'
    )
  })

  it('returns only error ID when no hint', () => {
    expect(toDescribedBy('email', { hasError: true, hasHint: false })).toBe(
      'email-error'
    )
  })

  it('returns only hint ID when no error', () => {
    expect(toDescribedBy('email', { hasError: false, hasHint: true })).toBe(
      'email-hint'
    )
  })

  it('returns empty string when neither present', () => {
    expect(toDescribedBy('email', { hasError: false, hasHint: false })).toBe('')
  })
})
