'use client'

import { useState, useCallback, useRef } from 'react'

export interface NativeFormHandle<T extends Record<string, unknown>> {
  values: T
  errors: Record<string, string | undefined>
  touched: Record<string, boolean>
  initialValues: T
  isSubmitting: boolean
  isSubmitted: boolean
  setFieldValue: (name: string, value: unknown) => void
  setFieldError: (name: string, error: string | undefined) => void
  setFieldTouched: (name: string, touched: boolean) => void
  reset: () => void
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => Promise<void>
}

export function useNativeForm<T extends Record<string, unknown>>(
  initialValues: T
): NativeFormHandle<T> {
  const initialRef = useRef<T>(initialValues)

  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const setFieldValue = useCallback((name: string, value: unknown) => {
    setValues((prev: T) => ({ ...prev, [name]: value }))
  }, [])

  const setFieldError = useCallback(
    (name: string, error: string | undefined) => {
      setErrors((prev: Record<string, string | undefined>) => ({
        ...prev,
        [name]: error,
      }))
    },
    []
  )

  const setFieldTouched = useCallback((name: string, isTouched: boolean) => {
    setTouched((prev: Record<string, boolean>) => ({
      ...prev,
      [name]: isTouched,
    }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialRef.current)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
    setIsSubmitted(false)
  }, [])

  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => void | Promise<void>) => {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
        setIsSubmitted(true)
      } finally {
        setIsSubmitting(false)
      }
    },
    [values]
  )

  return {
    values,
    errors,
    touched,
    initialValues: initialRef.current,
    isSubmitting,
    isSubmitted,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    reset,
    handleSubmit,
  }
}
