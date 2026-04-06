import { useStackFormContext } from '../context'

export function useFieldValue<T = unknown>(name: string): T {
  const { resolver } = useStackFormContext()
  return resolver(name).value as unknown as T
}
