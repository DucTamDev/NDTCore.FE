export const API_EVENT = {
    SESSION_EXPIRED: 'session_expired',
} as const

export type ApiEvent = (typeof API_EVENT)[keyof typeof API_EVENT]

type Listener = () => void

const map = new Map<ApiEvent, Set<Listener>>()

export const apiEvents = {
    on(event: ApiEvent, fn: Listener): void {
        if (!map.has(event)) map.set(event, new Set())
        map.get(event)!.add(fn)
    },
    off(event: ApiEvent, fn: Listener): void {
        map.get(event)?.delete(fn)
    },
    emit(event: ApiEvent): void {
        map.get(event)?.forEach((fn) => fn())
    },
}
