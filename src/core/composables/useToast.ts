// composables/useToast.ts
import { toastService } from '@/core/services/toast.service'
import type { PluginOptions } from 'vue-toastification'

/**
 * Composable để sử dụng toast notification
 * @example
 * const { success, error, warning, info } = useToast()
 * success('Thành công!')
 */
export function useToast() {
    const success = (message: string, options?: PluginOptions) => {
        toastService.success(message, options)
    }

    const error = (message: string, options?: PluginOptions) => {
        toastService.error(message, options)
    }

    const warning = (message: string, options?: PluginOptions) => {
        toastService.warning(message, options)
    }

    const info = (message: string, options?: PluginOptions) => {
        toastService.info(message, options)
    }

    const clear = () => {
        toastService.clear()
    }

    return {
        success,
        error,
        warning,
        info,
        clear,
    }
}
