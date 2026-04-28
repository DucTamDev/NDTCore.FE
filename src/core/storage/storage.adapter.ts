import { STORAGE_TYPE, type StorageKey, type StorageType } from './storage.keys'

class StorageAdapter {
    private pick(type: StorageType): Storage {
        return type === STORAGE_TYPE.LOCAL ? localStorage : sessionStorage
    }

    get(key: StorageKey, type: StorageType): string | null {
        return this.pick(type).getItem(key)
    }

    set(key: StorageKey, value: string, type: StorageType): void {
        this.pick(type).setItem(key, value)
    }

    remove(key: StorageKey, type: StorageType): void {
        this.pick(type).removeItem(key)
    }

    clear(type: StorageType): void {
        this.pick(type).clear()
    }
}

export const storageAdapter = new StorageAdapter()
