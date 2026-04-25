export type ValidationRule = (value: unknown) => boolean | string

function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0
  return Boolean(value)
}

export const VALIDATION_RULES = {
  required:
    (label = 'Truong nay') =>
    (value: unknown) =>
      hasValue(value) || `${label} la bat buoc`,
  maxLength: (max: number) => (value: unknown) => {
    if (typeof value !== 'string' || !value) return true
    return value.length <= max || `Toi da ${max} ky tu`
  },
  minLength: (min: number) => (value: unknown) => {
    if (typeof value !== 'string' || !value) return true
    return value.length >= min || `Toi thieu ${min} ky tu`
  },
  email: (value: unknown) => {
    if (typeof value !== 'string' || !value) return true
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Email khong hop le'
  },
} as const
