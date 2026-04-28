export type ValidationRule = (value: unknown) => boolean | string

function hasValue(value: unknown): boolean {
    if (Array.isArray(value)) return value.length > 0
    return Boolean(value)
}

export const VALIDATION_RULES = {
    required:
        (label = 'Trường này') =>
        (value: unknown) =>
            hasValue(value) || `${label} là bắt buộc`,
    maxLength: (max: number) => (value: unknown) => {
        if (typeof value !== 'string' || !value) return true
        return value.length <= max || `Tối đa ${max} ký tự`
    },
    minLength: (min: number) => (value: unknown) => {
        if (typeof value !== 'string' || !value) return true
        return value.length >= min || `Tối thiểu ${min} ký tự`
    },
    email: (value: unknown) => {
        if (typeof value !== 'string' || !value) return true
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Email không hợp lệ'
    },
} as const
