import { storageAdapter } from './storage.adapter'
import type { StorageKey } from './storage.constant'
import { createLogger } from '@/core/logger/logger'

const log = createLogger('storage')

class StorageService {
    private safeParse<T>(raw: string | null): T | null {
        if (!raw) return null
        try {
            return JSON.parse(raw) as T
        } catch {
            log.warn('Invalid JSON in storage')
            return null
        }
    }

    get<T>(key: StorageKey): T | null {
        return this.safeParse<T>(storageAdapter.get(key))
    }

    set<T>(key: StorageKey, value: T): void {
        try {
            storageAdapter.set(key, JSON.stringify(value))
        } catch (err) {
            log.error(`Set failed: ${key}`, err)
        }
    }

    remove(key: StorageKey): void {
        storageAdapter.remove(key)
    }

    clear(): void {
        storageAdapter.clear()
    }

    has(key: StorageKey): boolean {
        return storageAdapter.get(key) !== null
    }
}

export const storageService = new StorageService()
