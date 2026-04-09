// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { z } from 'zod'
import {
  extractZodConstraints,
  validateZodField,
  useZodField,
} from '@stackform/zod'

describe('extractZodConstraints', () => {
  it('ZodString with min(2).max(50) returns minLength, maxLength, required:true', () => {
    const schema = z.string().min(2).max(50)
    expect(extractZodConstraints(schema)).toEqual({
      minLength: 2,
      maxLength: 50,
      required: true,
    })
  })

  it('ZodNumber with min(0).max(100) returns min, max, required:true', () => {
    const schema = z.number().min(0).max(100)
    expect(extractZodConstraints(schema)).toEqual({
      min: 0,
      max: 100,
      required: true,
    })
  })

  it('ZodOptional(ZodString) returns required:false', () => {
    const schema = z.optional(z.string())
    expect(extractZodConstraints(schema)).toEqual({ required: false })
  })

  it('ZodNullable(ZodString) returns required:false', () => {
    const schema = z.nullable(z.string())
    expect(extractZodConstraints(schema)).toEqual({ required: false })
  })
})

describe('validateZodField', () => {
  it('valid string passes schema and returns undefined', () => {
    const schema = z.string().min(2)
    expect(validateZodField(schema, 'hello')).toBeUndefined()
  })

  it('string too short returns Zod error message', () => {
    const schema = z.string().min(2)
    const result = validateZodField(schema, 'a')
    expect(typeof result).toBe('string')
    expect(result!.length).toBeGreaterThan(0)
  })

  it('invalid type returns first issue message', () => {
    const schema = z.string()
    const result = validateZodField(schema, 123)
    expect(typeof result).toBe('string')
    expect(result!.length).toBeGreaterThan(0)
  })
})

describe('useZodField', () => {
  it('returns stable validate function reference across re-renders', () => {
    const schema = z.string().min(1)
    const { result, rerender } = renderHook(() => useZodField('name', schema))
    const firstValidate = result.current.fieldProps.validate
    rerender()
    expect(result.current.fieldProps.validate).toBe(firstValidate)
  })

  it('validate returns error string for empty string on required ZodString', () => {
    const schema = z.string().min(1)
    const { result } = renderHook(() => useZodField('name', schema))
    const error = result.current.fieldProps.validate('')
    expect(typeof error).toBe('string')
    expect(error!.length).toBeGreaterThan(0)
  })
})
