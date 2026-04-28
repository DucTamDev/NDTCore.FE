import type { ValidationRule } from '@/core/constants/validation-rule.constants'

export interface ValidationRules {
    required: ValidationRule
    email: ValidationRule
    minLength: (min: number) => ValidationRule
    maxLength: (max: number) => ValidationRule
    pattern: (pattern: RegExp, message: string) => ValidationRule
}
