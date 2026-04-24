import { ref, type Ref } from 'vue'

export interface AsyncStateOptions<T> {
  initialData?: T
  onError?: (error: Error) => void
}

export function useAsyncState<T, TArgs extends unknown[]>(
  asyncFunction: (...args: TArgs) => Promise<T>,
  options: AsyncStateOptions<T> = {},
) {
  const data = ref<T | undefined>(options.initialData) as Ref<T | undefined>
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function execute(...args: TArgs): Promise<T | undefined> {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFunction(...args)
      data.value = result
      return result
    } catch (caught) {
      const resolvedError = caught instanceof Error ? caught : new Error('Unknown async error')
      error.value = resolvedError
      options.onError?.(resolvedError)
      throw resolvedError
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  }
}
