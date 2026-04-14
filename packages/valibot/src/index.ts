'use client'

import { useCallback, useMemo } from 'react'
import type { BaseIssue, BaseSchema } from 'valibot'
import * as v from 'valibot'

export type ValibotSchema = BaseSchema<unknown, unknown, BaseIssue<unknown>>

export interface FieldConstraints {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
}

interface PipeEntry {
  type: string
  requirement?: unknown
}

interface SchemaWithPipe {
  type: string
  pipe: PipeEntry[]
}

function hasPipe(schema: unknown): schema is SchemaWithPipe {
  return (
    typeof schema === 'object' &&
    schema !== null &&
    'pipe' in schema &&
    Array.isArray((schema as SchemaWithPipe).pipe)
  )
}

export function extractValibotConstraints(
  schema: ValibotSchema
): FieldConstraints {
  const schemaType = (schema as unknown as { type: string }).type
  const required = schemaType !== 'optional' && schemaType !== 'nullable'
  const constraints: FieldConstraints = { required }

  if (hasPipe(schema)) {
    for (const entry of schema.pipe) {
      if (
        entry.type === 'min_length' &&
        typeof entry.requirement === 'number'
      ) {
        constraints.minLength = entry.requirement
      }
      if (
        entry.type === 'max_length' &&
        typeof entry.requirement === 'number'
      ) {
        constraints.maxLength = entry.requirement
      }
      if (entry.type === 'min_value' && typeof entry.requirement === 'number') {
        constraints.min = entry.requirement
      }
      if (entry.type === 'max_value' && typeof entry.requirement === 'number') {
        constraints.max = entry.requirement
      }
    }
  }

  return constraints
}

export function validateValibotField(
  schema: ValibotSchema,
  value: unknown
): string | undefined {
  const result = v.safeParse(schema, value)
  if (result.success) return undefined
  return result.issues[0]?.message
}

export function useValibotField<T>(
  name: string,
  schema: ValibotSchema
): {
  fieldProps: { validate: (value: T) => string | undefined }
  constraints: FieldConstraints
} {
  void name

  const constraints = useMemo(() => extractValibotConstraints(schema), [schema])

  const validate = useCallback(
    (value: T): string | undefined => validateValibotField(schema, value),
    [schema]
  )

  return { fieldProps: { validate }, constraints }
}
