export interface AsyncStateOptions<T> {
    initialData?: T
    onError?: (error: Error) => void
}
