import { VALIDATION_RULES, type ValidationRule } from '@/core/constants/validation-rule.constants'
import type { ValidationRules } from '@/core/types'

export type { ValidationRules }

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
