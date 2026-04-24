import { toastService } from '@/plugins/toast/toast.service'

export function useNotification() {
  return {
    success: toastService.success,
    error: toastService.error,
    warning: toastService.warning,
    info: toastService.info,
  }
}
