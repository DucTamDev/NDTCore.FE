import { VALIDATION_RULES, type ValidationRule } from '@/core/constants/validation-rule.constants'

export interface ValidationRules {
  required: ValidationRule
  email: ValidationRule
  minLength: (min: number) => ValidationRule
  maxLength: (max: number) => ValidationRule
  pattern: (pattern: RegExp, message: string) => ValidationRule
}

export function useFormValidation() {
  const rules: ValidationRules = {
    required: VALIDATION_RULES.required(),
    email: VALIDATION_RULES.email,
    minLength: VALIDATION_RULES.minLength,
    maxLength: VALIDATION_RULES.maxLength,
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
