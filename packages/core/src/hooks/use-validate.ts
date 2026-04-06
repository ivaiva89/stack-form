import { useState, useRef, useCallback, useEffect } from 'react'

export type ValidateFn<T> = (
  value: T
) => string | undefined | Promise<string | undefined>

export interface UseValidateReturn {
  validationError: string | undefined
  isValidating: boolean
  runValidation: (value: unknown) => void
}

export function useValidate<T>(
  validate: ValidateFn<T> | undefined
): UseValidateReturn {
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined
  )
  const [isValidating, setIsValidating] = useState(false)
  const callIdRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const runValidation = useCallback(
    (value: unknown): void => {
      if (!validate) {
        setValidationError(undefined)
        return
      }

      const id = ++callIdRef.current
      const result = validate(value as T)

      if (result instanceof Promise) {
        setIsValidating(true)
        result.then(
          (error) => {
            if (mountedRef.current && callIdRef.current === id) {
              setValidationError(error)
              setIsValidating(false)
            }
          },
          () => {
            if (mountedRef.current && callIdRef.current === id) {
              setValidationError(undefined)
              setIsValidating(false)
            }
          }
        )
      } else {
        setValidationError(result)
      }
    },
    [validate]
  )

  return { validationError, isValidating, runValidation }
}
