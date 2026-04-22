// core/utils/logger.ts
import { API_CONFIG } from '../config/api.config'

export class Logger {
    constructor(private context: string) {}

    public info(message: string, data?: any): void {
        if (API_CONFIG.enableLogging) {
            console.log(`[${this.context}] ${message}`, data || '')
        }
    }

    public warn(message: string, data?: any): void {
        if (API_CONFIG.enableLogging) {
            console.warn(`[${this.context}] ${message}`, data || '')
        }
    }

    public error(message: string, error?: any): void {
        if (API_CONFIG.enableLogging) {
            console.error(`[${this.context}] ${message}`, error || '')
        }
    }
}
