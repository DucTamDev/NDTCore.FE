import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('ui', () => {
    const drawer = ref(true)
    const rail = ref(false)
    const loadingCount = ref(0)

    const isGlobalLoading = computed(() => loadingCount.value > 0)

    function toggleDrawer() {
        drawer.value = !drawer.value
    }

    function toggleRail() {
        rail.value = !rail.value
    }

    function setRail(value: boolean) {
        rail.value = value
    }

    function showLoading(): void {
        loadingCount.value++
    }

    function hideLoading(): void {
        loadingCount.value = Math.max(0, loadingCount.value - 1)
    }

    async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
        showLoading()
        try {
            return await fn()
        } finally {
            hideLoading()
        }
    }

    return {
        drawer,
        rail,
        isGlobalLoading,
        toggleDrawer,
        toggleRail,
        setRail,
        showLoading,
        hideLoading,
        withLoading,
    }
})
