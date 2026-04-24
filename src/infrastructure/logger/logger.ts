import { API_CONFIG } from '@/infrastructure/config/api.config'

export class Logger {
  constructor(private readonly context: string) {}

  info(message: string, data?: unknown): void {
    if (API_CONFIG.enableLogging) {
      console.log(`[${this.context}] ${message}`, data || '')
    }
  }

  warn(message: string, data?: unknown): void {
    if (API_CONFIG.enableLogging) {
      console.warn(`[${this.context}] ${message}`, data || '')
    }
  }

  error(message: string, error?: unknown): void {
    if (API_CONFIG.enableLogging) {
      console.error(`[${this.context}] ${message}`, error || '')
    }
  }
}
