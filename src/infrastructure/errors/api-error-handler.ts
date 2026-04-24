import { AxiosError } from 'axios'
import type { ApiResponse } from '@/models/api.models'
import { toastService } from '@/plugins/toast/toast.service'

const HTTP_MESSAGES: Record<number, string> = {
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

export function handleApiError(error: AxiosError<ApiResponse>): void {
  const apiError = error.response?.data?.Error
  const status = error.response?.status

  if (apiError?.Message) {
    const meta = apiError.Meta
    const detail = meta ? Object.entries(meta)[0] : null
    const message = detail ? `${apiError.Message}: ${detail[1]}` : apiError.Message
    toastService.error(message)
    return
  }

  if (status && HTTP_MESSAGES[status]) {
    toastService.error(HTTP_MESSAGES[status])
    return
  }

  if (error.code === 'ECONNABORTED') {
    toastService.error('Yêu cầu hết thời gian chờ')
    return
  }

  if (error.code === 'ERR_NETWORK') {
    toastService.error('Không thể kết nối đến server')
    return
  }

  toastService.error(error.message || 'Đã có lỗi xảy ra')
}
