import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CONFIRM_DIALOG_DEFAULTS } from '@/constants/app.constants'
import type { ConfirmDialogOptions, ConfirmDialogState } from '@/types/common.types'

export const useUiStore = defineStore('ui', () => {
  const drawer = ref(true)
  const rail = ref(false)
  const isGlobalLoading = ref(false)
  const confirmDialog = ref<ConfirmDialogState>({
    show: false,
    title: '',
    message: '',
    confirmText: CONFIRM_DIALOG_DEFAULTS.CONFIRM_TEXT,
    cancelText: CONFIRM_DIALOG_DEFAULTS.CANCEL_TEXT,
    confirmColor: CONFIRM_DIALOG_DEFAULTS.CONFIRM_COLOR,
    resolve: null,
  })

  function toggleDrawer() {
    drawer.value = !drawer.value
  }

  function toggleRail() {
    rail.value = !rail.value
  }

  function setRail(value: boolean) {
    rail.value = value
  }

  function setGlobalLoading(value: boolean) {
    isGlobalLoading.value = value
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
    setGlobalLoading,
    openConfirmDialog,
    resolveConfirmDialog,
  }
})
