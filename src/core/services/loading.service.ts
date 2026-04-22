// core/services/loading.service.ts
export class LoadingService {
    private static instance: LoadingService
    private loadingCount = 0
    private callbacks: Set<(isLoading: boolean) => void> = new Set()

    private constructor() {}

    public static getInstance(): LoadingService {
        if (!LoadingService.instance) {
            LoadingService.instance = new LoadingService()
        }
        return LoadingService.instance
    }

    public show(): void {
        this.loadingCount++
        this.notify()
    }

    public hide(): void {
        this.loadingCount = Math.max(0, this.loadingCount - 1)
        this.notify()
    }

    public isLoading(): boolean {
        return this.loadingCount > 0
    }

    public subscribe(callback: (isLoading: boolean) => void): () => void {
        this.callbacks.add(callback)
        return () => this.callbacks.delete(callback)
    }

    private notify(): void {
        const isLoading = this.isLoading()
        this.callbacks.forEach((callback) => callback(isLoading))
    }
}
