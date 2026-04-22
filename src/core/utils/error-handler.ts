// core/utils/error-handler.ts
import { AxiosError } from 'axios'
import type { ApiResponse } from '../types/api.types'
import { toastService } from '../services/toast.service'

export class ErrorHandler {
    private static readonly ERROR_MESSAGES: Record<number, string> = {
        400: 'Yêu cầu không hợp lệ',
        401: 'Bạn cần đăng nhập để tiếp tục',
        403: 'Bạn không có quyền truy cập',
        404: 'Không tìm thấy dữ liệu',
        409: 'Dữ liệu đã tồn tại',
        422: 'Dữ liệu không hợp lệ',
        429: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
        500: 'Lỗi server, vui lòng thử lại sau',
        502: 'Server không phản hồi',
        503: 'Dịch vụ tạm thời không khả dụng',
    }

    public static handle(error: AxiosError<ApiResponse>): void {
        const response = error.response?.data
        const status = error.response?.status

        if (response?.Error) {
            const errorMessage = response.Error.message || 'Đã có lỗi xảy ra'
            this.showError(errorMessage, response.Error.details)
        } else if (status && this.ERROR_MESSAGES[status]) {
            this.showError(this.ERROR_MESSAGES[status])
        } else if (error.code === 'ECONNABORTED') {
            this.showError('Yêu cầu hết thời gian chờ')
        } else if (error.code === 'ERR_NETWORK') {
            this.showError('Không thể kết nối đến server')
        } else if (error.message) {
            this.showError(error.message)
        } else {
            this.showError('Đã có lỗi xảy ra')
        }
    }

    private static showError(message: string, details?: Record<string, any> | null): void {
        if (details && Object.keys(details).length > 0) {
            const detailMessages = Object.entries(details)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')

            toastService.error(`${message}\n${detailMessages}`, {
                timeout: 7000,
            })
        } else {
            toastService.error(message)
        }
    }

    public static showSuccess(message: string): void {
        toastService.success(message)
    }

    public static showWarning(message: string): void {
        toastService.warning(message)
    }

    public static showInfo(message: string): void {
        toastService.info(message)
    }
}
