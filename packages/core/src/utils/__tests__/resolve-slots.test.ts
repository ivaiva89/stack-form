// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { resolveSlots, resolveSlotProps, resolveClassNames } from '../../index'
import type { ComponentType } from 'react'

const CompA: ComponentType<never> = () => null
const CompB: ComponentType<never> = () => null
const CompC: ComponentType<never> = () => null

describe('resolveSlots', () => {
  it('returns core default when no overrides', () => {
    const result = resolveSlots({ Wrapper: CompA })
    expect(result.Wrapper).toBe(CompA)
  })

  it('provider overrides core default', () => {
    const result = resolveSlots({ Wrapper: CompA }, { Wrapper: CompB })
    expect(result.Wrapper).toBe(CompB)
  })

  it('field overrides provider', () => {
    const result = resolveSlots(
      { Wrapper: CompA },
      { Wrapper: CompB },
      { Wrapper: CompC }
    )
    expect(result.Wrapper).toBe(CompC)
  })

  it('field overrides core default when provider is undefined', () => {
    const result = resolveSlots({ Wrapper: CompA }, undefined, {
      Wrapper: CompC,
    })
    expect(result.Wrapper).toBe(CompC)
  })

  it('falls back to core when field slot is undefined', () => {
    const result = resolveSlots(
      { Wrapper: CompA, Label: CompB },
      {},
      { Wrapper: CompC }
    )
    expect(result.Wrapper).toBe(CompC)
    expect(result.Label).toBe(CompB)
  })
})

describe('resolveSlotProps', () => {
  it('returns empty object when both undefined', () => {
    expect(resolveSlotProps(undefined, undefined)).toEqual({})
  })

  it('returns provider props when no field props', () => {
    const provider = { label: { className: 'p-label' } }
    expect(resolveSlotProps(provider, undefined)).toEqual(provider)
  })

  it('returns field props when no provider props', () => {
    const field = { label: { className: 'f-label' } }
    expect(resolveSlotProps(undefined, field)).toEqual(field)
  })

  it('field key fully replaces provider key for that slot', () => {
    const provider = { label: { className: 'p-label', htmlFor: 'x' } }
    const field = { label: { className: 'f-label' } }
    const result = resolveSlotProps(provider, field)
    expect(result.label).toEqual({ className: 'f-label' })
  })

  it('preserves provider keys not overridden by field', () => {
    type Props = {
      label: Record<string, unknown>
      error: Record<string, unknown>
    }
    const provider: Partial<Props> = {
      label: { className: 'p-label' },
      error: { className: 'p-error' },
    }
    const field: Partial<Props> = { label: { className: 'f-label' } }
    const result = resolveSlotProps(provider, field)
    expect(result.label).toEqual({ className: 'f-label' })
    expect(result.error).toEqual({ className: 'p-error' })
  })
})

describe('resolveClassNames', () => {
  type CN = Record<string, string | undefined>

  it('stacks all three layers', () => {
    const result = resolveClassNames<CN>(
      { wrapper: 'core-w' },
      { wrapper: 'prov-w' },
      { wrapper: 'field-w' }
    )
    expect(result.wrapper).toBe('core-w prov-w field-w')
  })

  it('handles undefined layers gracefully', () => {
    const result = resolveClassNames<CN>(undefined, undefined, {
      wrapper: 'field-w',
    })
    expect(result.wrapper).toBe('field-w')
  })

  it('returns empty object when all layers undefined', () => {
    expect(resolveClassNames(undefined, undefined, undefined)).toEqual({})
  })

  it('merges keys across layers', () => {
    const result = resolveClassNames<CN>(
      { wrapper: 'core-w' },
      { label: 'prov-l' },
      { input: 'field-i' }
    )
    expect(result.wrapper).toBe('core-w')
    expect(result.label).toBe('prov-l')
    expect(result.input).toBe('field-i')
  })

  it('omits keys that resolve to empty string', () => {
    const result = resolveClassNames<CN>({ wrapper: '' }, { wrapper: '' })
    expect(result).toEqual({})
  })
})
