import type { BrandFormModel } from '@/modules/brand/models/form-models/brand.model'

export const BRAND_FORM_EMIT = {
  UPDATE_MODEL_VALUE: 'update:modelValue',
  SUBMIT: 'submit',
} as const

export type BrandFormEmits = {
  (event: typeof BRAND_FORM_EMIT.UPDATE_MODEL_VALUE, value: boolean): void
  (event: typeof BRAND_FORM_EMIT.SUBMIT, payload: BrandFormModel): void
}
