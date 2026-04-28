import { storageAdapter } from './storage.adapter'
import { STORAGE_TYPE, type StorageKey, type StorageType } from './storage.keys'
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

    get<T>(key: StorageKey, type: StorageType = STORAGE_TYPE.LOCAL): T | null {
        return this.safeParse<T>(storageAdapter.get(key, type))
    }

    set<T>(key: StorageKey, value: T, type: StorageType = STORAGE_TYPE.LOCAL): void {
        try {
            storageAdapter.set(key, JSON.stringify(value), type)
        } catch (err) {
            log.error(`Set failed: ${key}`, err)
        }
    }

    remove(key: StorageKey, type: StorageType = STORAGE_TYPE.LOCAL): void {
        storageAdapter.remove(key, type)
    }

    clear(type: StorageType = STORAGE_TYPE.LOCAL): void {
        storageAdapter.clear(type)
    }

    has(key: StorageKey, type: StorageType = STORAGE_TYPE.LOCAL): boolean {
        return storageAdapter.get(key, type) !== null
    }
}

export const storageService = new StorageService()
