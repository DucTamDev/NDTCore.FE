// core/services/toast.service.ts
import { useToast, type PluginOptions, POSITION } from 'vue-toastification'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastConfig extends PluginOptions {
    message: string
    type?: ToastType
}

class ToastService {
    private static instance: ToastService
    private toast: ReturnType<typeof useToast>

    private constructor() {
        this.toast = useToast()
    }

    public static getInstance(): ToastService {
        if (!ToastService.instance) {
            ToastService.instance = new ToastService()
        }
        return ToastService.instance
    }

    public success(message: string, options?: PluginOptions): void {
        this.toast.success(message, {
            position: POSITION.TOP_RIGHT,
            timeout: 3000,
            ...options,
        })
    }

    public error(message: string, options?: PluginOptions): void {
        this.toast.error(message, {
            position: POSITION.TOP_RIGHT,
            timeout: 5000,
            ...options,
        })
    }

    public warning(message: string, options?: PluginOptions): void {
        this.toast.warning(message, {
            position: POSITION.TOP_RIGHT,
            timeout: 4000,
            ...options,
        })
    }

    public info(message: string, options?: PluginOptions): void {
        this.toast.info(message, {
            position: POSITION.TOP_RIGHT,
            timeout: 3000,
            ...options,
        })
    }

    public show(config: ToastConfig): void {
        const { message, type = 'info', ...options } = config

        switch (type) {
            case 'success':
                this.success(message, options)
                break
            case 'error':
                this.error(message, options)
                break
            case 'warning':
                this.warning(message, options)
                break
            case 'info':
                this.info(message, options)
                break
        }
    }

    public clear(): void {
        this.toast.clear()
    }
}

export const toastService = ToastService.getInstance()
