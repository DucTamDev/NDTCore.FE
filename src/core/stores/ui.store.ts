import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Component } from 'vue'

export interface ModalOptions {
    id: string
    component: Component | string
    props?: Record<string, unknown>
    persistent?: boolean
    onClose?: () => void
}

export interface DrawerOptions {
    id: string
    component: Component | string
    props?: Record<string, unknown>
    side?: 'left' | 'right'
    width?: string
    onClose?: () => void
}

export interface DialogOptions {
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'warning' | 'info'
    onConfirm: () => void | Promise<void>
    onCancel?: () => void
}

export const useUIStore = defineStore('ui', () => {
    // ─── Loading ──────────────────────────────────────────────────────────────
    // Counter-based: hỗ trợ nhiều request song song mà không bị race condition

    const loadingCount = ref(0)
    const isAppLoading = computed(() => loadingCount.value > 0)

    async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
        loadingCount.value++

        try {
            const result = await fn()

            return result
        } finally {
            loadingCount.value = Math.max(0, loadingCount.value - 1)
        }
    }

    // ─── Navigation (Vuetify layout) ──────────────────────────────────────────

    const navDrawer = ref(true)
    const navRail = ref(false)

    function toggleNavDrawer() {
        navDrawer.value = !navDrawer.value
    }
    function setNavDrawer(v: boolean) {
        navDrawer.value = v
    }
    function toggleNavRail() {
        navRail.value = !navRail.value
    }
    function setNavRail(v: boolean) {
        navRail.value = v
    }

    // ─── Modal stack ──────────────────────────────────────────────────────────

    const modals = ref<ModalOptions[]>([])
    const topModal = computed(() => modals.value.at(-1) ?? null)
    const hasModal = computed(() => modals.value.length > 0)

    function openModal(opts: ModalOptions) {
        modals.value.push(opts)
    }

    function closeModal(id?: string) {
        if (id) {
            const idx = modals.value.findIndex((m) => m.id === id)
            if (idx === -1) return
            modals.value[idx].onClose?.()
            modals.value.splice(idx, 1)
        } else {
            modals.value.at(-1)?.onClose?.()
            modals.value.pop()
        }
    }

    function closeAllModals() {
        modals.value.forEach((m) => m.onClose?.())
        modals.value.splice(0)
    }

    // ─── Drawer stack ─────────────────────────────────────────────────────────

    const drawers = ref<DrawerOptions[]>([])
    const topDrawer = computed(() => drawers.value.at(-1) ?? null)
    const hasDrawer = computed(() => drawers.value.length > 0)

    function openDrawer(opts: DrawerOptions) {
        drawers.value.push(opts)
    }

    function closeDrawer(id?: string) {
        if (id) {
            const idx = drawers.value.findIndex((d) => d.id === id)
            if (idx === -1) return
            drawers.value[idx].onClose?.()
            drawers.value.splice(idx, 1)
        } else {
            drawers.value.at(-1)?.onClose?.()
            drawers.value.pop()
        }
    }

    function closeAllDrawers() {
        drawers.value.forEach((d) => d.onClose?.())
        drawers.value.splice(0)
    }

    // ─── Dialog ───────────────────────────────────────────────────────────────

    const dialog = ref<DialogOptions | null>(null)
    const dialogLoading = ref(false)
    const dialogError = ref<string | null>(null)
    const hasDialog = computed(() => dialog.value !== null)

    function openDialog(opts: DialogOptions) {
        dialogError.value = null
        dialog.value = opts
    }

    async function confirmDialog() {
        if (!dialog.value) return
        dialogLoading.value = true
        dialogError.value = null
        try {
            await dialog.value.onConfirm()
            dialog.value = null
        } catch (err) {
            dialogError.value = err instanceof Error ? err.message : 'Có lỗi xảy ra'
        } finally {
            dialogLoading.value = false
        }
    }

    function cancelDialog() {
        dialog.value?.onCancel?.()
        dialog.value = null
        dialogError.value = null
    }

    function confirmDelete(itemName: string, onConfirm: () => void | Promise<void>) {
        openDialog({
            title: `Xoá ${itemName}?`,
            message: 'Hành động này không thể hoàn tác.',
            confirmLabel: 'Xoá',
            cancelLabel: 'Huỷ',
            variant: 'danger',
            onConfirm,
        })
    }

    // ─── Command palette ──────────────────────────────────────────────────────

    const commandPalette = ref(false)

    function toggleCommandPalette() {
        commandPalette.value = !commandPalette.value
    }
    function openCommandPalette() {
        commandPalette.value = true
    }
    function closeCommandPalette() {
        commandPalette.value = false
    }

    // ─── Global Escape handler ────────────────────────────────────────────────

    function closeTop() {
        if (hasDialog.value) {
            cancelDialog()
            return
        }
        if (hasModal.value && !topModal.value?.persistent) {
            closeModal()
            return
        }
        if (hasDrawer.value) {
            closeDrawer()
            return
        }
    }

    // ──────────────────────────────────────────────────────────────────────────

    return {
        // loading
        isAppLoading,
        withLoading,
        // nav
        navDrawer,
        navRail,
        toggleNavDrawer,
        setNavDrawer,
        toggleNavRail,
        setNavRail,
        // modal
        modals,
        topModal,
        hasModal,
        openModal,
        closeModal,
        closeAllModals,
        // drawer stack
        drawers,
        topDrawer,
        hasDrawer,
        openDrawer,
        closeDrawer,
        closeAllDrawers,
        // dialog
        dialog,
        dialogLoading,
        dialogError,
        hasDialog,
        openDialog,
        confirmDialog,
        cancelDialog,
        confirmDelete,
        // command palette
        commandPalette,
        toggleCommandPalette,
        openCommandPalette,
        closeCommandPalette,
        // global
        closeTop,
    }
})
