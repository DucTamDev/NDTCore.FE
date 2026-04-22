import { ref, type Ref } from 'vue'

export interface AsyncStateOptions<T> {
    initialData?: T
    onError?: (error: Error) => void
}

export function useAsyncState<T>(
    asyncFunction: (...args: any[]) => Promise<T>,
    options: AsyncStateOptions<T> = {},
) {
    const data = ref<T | undefined>(options.initialData) as Ref<T | undefined>
    const loading = ref(false)
    const error = ref<Error | null>(null)

    async function execute(...args: any[]): Promise<T | undefined> {
        loading.value = true
        error.value = null

        try {
            const result = await asyncFunction(...args)
            data.value = result
            return result
        } catch (e) {
            error.value = e as Error
            options.onError?.(e as Error)
            throw e
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
