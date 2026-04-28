import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoadingState } from '@/infrastructure/types/common.types'

export const useUserStore = defineStore('users', () => {
    const total = ref(0)
    const loadingState = ref<LoadingState>('idle')

    return {
        total,
        loadingState,
    }
})
