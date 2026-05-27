import type { FranchiseeFormModel } from '@/modules/brand/models/form-models/franchisee.model'

export const FRANCHISEE_FORM_EMIT = {
    UPDATE_MODEL_VALUE: 'update:modelValue',
    SUBMIT: 'submit',
} as const

export type FranchiseeFormEmits = {
    (event: typeof FRANCHISEE_FORM_EMIT.UPDATE_MODEL_VALUE, value: boolean): void
    (event: typeof FRANCHISEE_FORM_EMIT.SUBMIT, form: FranchiseeFormModel): void
}
