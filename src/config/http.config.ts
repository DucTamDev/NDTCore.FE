import { API_CONFIG } from '@/infrastructure/config/api.config'

export const HTTP_CONFIG = {
  BASE_URL: API_CONFIG.baseURL,
  TIMEOUT: API_CONFIG.timeout,
  HEADERS: API_CONFIG.headers,
} as const
