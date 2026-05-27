import type { StorageKey } from './storage.constant'

class StorageAdapter {
    get(key: StorageKey): string | null {
        return localStorage.getItem(key)
    }

    set(key: StorageKey, value: string): void {
        localStorage.setItem(key, value)
    }

    remove(key: StorageKey): void {
        localStorage.removeItem(key)
    }

    clear(): void {
        localStorage.clear()
    }
}

export const storageAdapter = new StorageAdapter()
