export const storage = {
  get<T>(key: string): T | null {
    const value = localStorage.getItem(key)
    if (!value) return null

    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  },

  set(key: string, value: unknown): void {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(key, serialized)
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },
}
