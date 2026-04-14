'use client'

import { useCallback, useMemo } from 'react'
import { ZodType, ZodOptional, ZodNullable, ZodString, ZodNumber } from 'zod'

export interface FieldConstraints {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
}

function unwrap(schema: ZodType): ZodType {
  if (schema instanceof ZodOptional || schema instanceof ZodNullable) {
    return unwrap(schema.unwrap() as unknown as ZodType)
  }
  return schema
}

export function extractZodConstraints(schema: ZodType): FieldConstraints {
  const required = !(
    schema instanceof ZodOptional || schema instanceof ZodNullable
  )
  const inner = unwrap(schema)
  const constraints: FieldConstraints = { required }

  if (inner instanceof ZodString) {
    if (inner.minLength !== null) constraints.minLength = inner.minLength
    if (inner.maxLength !== null) constraints.maxLength = inner.maxLength
  }

  if (inner instanceof ZodNumber) {
    if (inner.minValue !== null) constraints.min = inner.minValue
    if (inner.maxValue !== null) constraints.max = inner.maxValue
  }

  return constraints
}

export function validateZodField(
  schema: ZodType,
  value: unknown
): string | undefined {
  const result = schema.safeParse(value)
  if (result.success) return undefined
  return result.error.issues[0]?.message
}

export function useZodField<T>(
  name: string,
  schema: ZodType
): {
  fieldProps: { validate: (value: T) => string | undefined }
  constraints: FieldConstraints
} {
  void name

  const constraints = useMemo(() => extractZodConstraints(schema), [schema])

  const validate = useCallback(
    (value: T): string | undefined => validateZodField(schema, value),
    [schema]
  )

  return { fieldProps: { validate }, constraints }
}
