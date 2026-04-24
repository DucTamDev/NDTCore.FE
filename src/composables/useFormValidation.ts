export interface ValidationRule {
  (value: unknown): boolean | string
}

export interface ValidationRules {
  required: ValidationRule
  email: ValidationRule
  minLength: (min: number) => ValidationRule
  maxLength: (max: number) => ValidationRule
  pattern: (pattern: RegExp, message: string) => ValidationRule
}

function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0
  return Boolean(value)
}

export function useFormValidation() {
  const rules: ValidationRules = {
    required: (value: unknown) => hasValue(value) || 'Trường này là bắt buộc',

    email: (value: unknown) => {
      if (typeof value !== 'string' || !value) return true
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Email không hợp lệ'
    },

    minLength: (min: number) => (value: unknown) => {
      if (typeof value !== 'string' || !value) return true
      return value.length >= min || `Tối thiểu ${min} ký tự`
    },

    maxLength: (max: number) => (value: unknown) => {
      if (typeof value !== 'string' || !value) return true
      return value.length <= max || `Tối đa ${max} ký tự`
    },

    pattern: (pattern: RegExp, message: string) => (value: unknown) => {
      if (typeof value !== 'string' || !value) return true
      return pattern.test(value) || message
    },
  }

  const createPasswordRules = (minLength = 6) => [rules.required, rules.minLength(minLength)]
  const createEmailRules = () => [rules.required, rules.email]

  return {
    rules,
    createPasswordRules,
    createEmailRules,
  }
}
