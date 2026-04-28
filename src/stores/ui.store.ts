import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CONFIRM_DIALOG_DEFAULTS } from '@/core/constants/app.constants'
import type { ConfirmDialogOptions, ConfirmDialogState } from '@/core/types/dialog.types'

export const useUiStore = defineStore('ui', () => {
    const drawer = ref(true)
    const rail = ref(false)
    const loadingCount = ref(0)

    const confirmDialog = ref<ConfirmDialogState>({
        show: false,
        title: '',
        message: '',
        confirmText: CONFIRM_DIALOG_DEFAULTS.CONFIRM_TEXT,
        cancelText: CONFIRM_DIALOG_DEFAULTS.CANCEL_TEXT,
        confirmColor: CONFIRM_DIALOG_DEFAULTS.CONFIRM_COLOR,
        resolve: null,
    })

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

    function openConfirmDialog(options: ConfirmDialogOptions): Promise<boolean> {
        return new Promise((resolve) => {
            confirmDialog.value = {
                show: true,
                title: options.title,
                message: options.message,
                confirmText: options.confirmText ?? CONFIRM_DIALOG_DEFAULTS.CONFIRM_TEXT,
                cancelText: options.cancelText ?? CONFIRM_DIALOG_DEFAULTS.CANCEL_TEXT,
                confirmColor: options.confirmColor ?? CONFIRM_DIALOG_DEFAULTS.CONFIRM_COLOR,
                resolve,
            }
        })
    }

    function resolveConfirmDialog(confirmed: boolean) {
        confirmDialog.value.resolve?.(confirmed)
        confirmDialog.value = {
            ...confirmDialog.value,
            show: false,
            resolve: null,
        }
    }

    return {
        drawer,
        rail,
        isGlobalLoading,
        confirmDialog,
        toggleDrawer,
        toggleRail,
        setRail,
        showLoading,
        hideLoading,
        withLoading,
        openConfirmDialog,
        resolveConfirmDialog,
    }
})
