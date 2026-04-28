import { ref, computed } from 'vue'

const count = ref(0)

export function useLoading() {
    const isLoading = computed(() => count.value > 0)

    function show(): void {
        count.value++
    }

    function hide(): void {
        count.value = Math.max(0, count.value - 1)
    }

    async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
        show()
        try {
            return await fn()
        } finally {
            hide()
        }
    }

    return { isLoading, show, hide, withLoading }
}
