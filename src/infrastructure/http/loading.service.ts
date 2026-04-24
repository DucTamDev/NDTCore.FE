export class LoadingService {
    private static instance: LoadingService
    private count = 0
    private listeners = new Set<(loading: boolean) => void>()

    private constructor() {}

    static getInstance(): LoadingService {
        if (!LoadingService.instance) {
            LoadingService.instance = new LoadingService()
        }
        return LoadingService.instance
    }

    show(): void {
        this.count++
        if (this.count === 1) this.emit(true)
    }

    hide(): void {
        this.count = Math.max(0, this.count - 1)
        if (this.count === 0) this.emit(false)
    }

    subscribe(fn: (loading: boolean) => void): () => void {
        this.listeners.add(fn)
        return () => this.listeners.delete(fn)
    }

    private emit(loading: boolean): void {
        this.listeners.forEach((fn) => fn(loading))
    }
}