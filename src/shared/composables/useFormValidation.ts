// @/shared/composables/useFormValidation.ts
import { computed } from 'vue'

export interface ValidationRule {
    (value: any): boolean | string
}

export interface ValidationRules {
    required: ValidationRule
    email: ValidationRule
    minLength: (min: number) => ValidationRule
    maxLength: (max: number) => ValidationRule
    pattern: (pattern: RegExp, message: string) => ValidationRule
}

export function useFormValidation() {
    const rules: ValidationRules = {
        required: (value: any) => {
            if (Array.isArray(value)) return value.length > 0 || 'Trường này là bắt buộc'
            return !!value || 'Trường này là bắt buộc'
        },

        email: (value: string) => {
            if (!value) return true
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return pattern.test(value) || 'Email không hợp lệ'
        },

        minLength: (min: number) => (value: string) => {
            if (!value) return true
            return value.length >= min || `Tối thiểu ${min} ký tự`
        },

        maxLength: (max: number) => (value: string) => {
            if (!value) return true
            return value.length <= max || `Tối đa ${max} ký tự`
        },

        pattern: (pattern: RegExp, message: string) => (value: string) => {
            if (!value) return true
            return pattern.test(value) || message
        },
    }

    const createPasswordRules = (minLength: number = 6) => [
        rules.required,
        rules.minLength(minLength),
    ]

    const createEmailRules = () => [rules.required, rules.email]

    return {
        rules,
        createPasswordRules,
        createEmailRules,
    }
}
