import { HTTP_CONFIG } from '@/core/api/config/http.config'

const STYLE = {
    debug: 'color: #abb2bf; font-weight: bold',
    info: 'color: #c678dd; font-weight: bold',
    success: 'color: #98c379; font-weight: bold',
    warn: 'color: #e5c07b; font-weight: bold',
    error: 'color: #e06c75; font-weight: bold',
    request: 'color: #61afef; font-weight: bold',
    response: 'color: #56b6c2; font-weight: bold',
} as const

type LogLevel = keyof typeof STYLE

function print(level: LogLevel, message: string, meta?: unknown): void {
    
    meta !== undefined
        ? console.log(`%c${message}`, STYLE[level], meta)
        : console.log(`%c${message}`, STYLE[level])
}

function fmt(context: string, msg: string): string {
    const ts = new Date().toISOString().slice(11, 23)
    return `[${context.toUpperCase()} ${ts}] ${msg}`
}

export function createLogger(context: string) {
    return {
        debug: (msg: string, meta?: unknown) => print('debug', fmt(context, msg), meta),
        info: (msg: string, meta?: unknown) => print('info', fmt(context, msg), meta),
        success: (msg: string, meta?: unknown) => print('success', fmt(context, msg), meta),
        warn: (msg: string, meta?: unknown) => print('warn', fmt(context, msg), meta),
        error: (msg: string, meta?: unknown) => print('error', fmt(context, msg), meta),
        request: (msg: string, meta?: unknown) => print('request', fmt(context, msg), meta),
        response: (msg: string, meta?: unknown) => print('response', fmt(context, msg), meta),
    }
}
