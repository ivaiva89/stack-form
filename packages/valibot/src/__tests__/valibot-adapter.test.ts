// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import * as v from 'valibot'
import {
  extractValibotConstraints,
  validateValibotField,
  useValibotField,
} from '@stackform/valibot'

describe('extractValibotConstraints', () => {
  it('pipe(string, minLength(2), maxLength(50)) returns minLength, maxLength, required:true', () => {
    const schema = v.pipe(v.string(), v.minLength(2), v.maxLength(50))
    expect(extractValibotConstraints(schema)).toEqual({
      minLength: 2,
      maxLength: 50,
      required: true,
    })
  })

  it('pipe(number, minValue(0), maxValue(100)) returns min, max, required:true', () => {
    const schema = v.pipe(v.number(), v.minValue(0), v.maxValue(100))
    expect(extractValibotConstraints(schema)).toEqual({
      min: 0,
      max: 100,
      required: true,
    })
  })

  it('optional(string) returns required:false', () => {
    const schema = v.optional(v.string())
    expect(extractValibotConstraints(schema)).toEqual({ required: false })
  })

  it('nullable(string) returns required:false', () => {
    const schema = v.nullable(v.string())
    expect(extractValibotConstraints(schema)).toEqual({ required: false })
  })
})

describe('validateValibotField', () => {
  it('valid string passes schema and returns undefined', () => {
    const schema = v.pipe(v.string(), v.minLength(2))
    expect(validateValibotField(schema, 'hello')).toBeUndefined()
  })

  it('string too short returns Valibot error message', () => {
    const schema = v.pipe(v.string(), v.minLength(2))
    const result = validateValibotField(schema, 'a')
    expect(typeof result).toBe('string')
    expect(result!.length).toBeGreaterThan(0)
  })

  it('invalid type returns first issue message', () => {
    const schema = v.number()
    const result = validateValibotField(schema, 'not-a-number')
    expect(typeof result).toBe('string')
    expect(result!.length).toBeGreaterThan(0)
  })
})

describe('useValibotField', () => {
  it('returns stable validate function reference across re-renders', () => {
    const schema = v.pipe(v.string(), v.minLength(1))
    const { result, rerender } = renderHook(() =>
      useValibotField('name', schema)
    )
    const firstValidate = result.current.fieldProps.validate
    rerender()
    expect(result.current.fieldProps.validate).toBe(firstValidate)
  })

  it('validate returns error string for empty string on required string schema', () => {
    const schema = v.pipe(v.string(), v.minLength(1))
    const { result } = renderHook(() => useValibotField('name', schema))
    const error = result.current.fieldProps.validate('')
    expect(typeof error).toBe('string')
    expect(error!.length).toBeGreaterThan(0)
  })
})
