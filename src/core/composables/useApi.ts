// composables/useApi.ts
import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { LoadingService } from '@/core/services/loading.service'

export function useApi() {
    const isLoading: Ref<boolean> = ref(false)
    const loadingService = LoadingService.getInstance()

    const unsubscribe = loadingService.subscribe((loading) => {
        isLoading.value = loading
    })

    onUnmounted(() => {
        unsubscribe()
    })

    return {
        isLoading,
    }
}
