<template>
  <AppDialog
    :model-value="modelValue"
    :title="title"
    :loading="submitting"
    size="lg"
    @update:model-value="emit(BRAND_FORM_EMIT.UPDATE_MODEL_VALUE, $event)"
  >
    <v-form ref="formRef" @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.name"
            label="Tên thương hiệu *"
            :rules="nameRules"
            variant="solo-filled"
            flat
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.legalName"
            label="Tên pháp nhân"
            variant="solo-filled"
            flat
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.taxCode"
            label="Mã số thuế"
            variant="solo-filled"
            flat
          />
        </v-col>
      </v-row>
    </v-form>

    <template #[`actions`]>
      <v-btn
        variant="text"
        :disabled="submitting"
        @click="emit(BRAND_FORM_EMIT.UPDATE_MODEL_VALUE, false)"
      >
        Hủy
      </v-btn>
      <v-btn color="primary" :loading="submitting" @click="onSubmit">Lưu</v-btn>
    </template>
  </AppDialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { AppDialog } from '@/components/ui'
import {
  BRAND_FORM_EMIT,
  type BrandFormEmits,
} from '@/modules/brand/constants/brand-form.constants'
import type { BrandFormModel } from '@/modules/brand/models/form-models/brand.model'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    brand?: BrandFormModel | null
    submitting?: boolean
  }>(),
  { brand: null, submitting: false },
)

const emit = defineEmits<BrandFormEmits>()

const formRef = ref<VForm | null>(null)
const nameRules = [(v: string) => !!v?.trim() || 'Tên thương hiệu là bắt buộc']

const form = reactive<BrandFormModel>({
  name: '',
  isActive: false,
  legalName: null,
  taxCode: null,
  createdAt: null,
  createdBy: null,
  updatedAt: null,
  updatedBy: null,
})

function fillForm(brand: BrandFormModel | null) {
  form.name = brand?.name ?? ''
  form.legalName = brand?.legalName ?? null
  form.taxCode = brand?.taxCode ?? null
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) fillForm(props.brand ?? null)
    else fillForm(null)
  },
)

async function onSubmit() {
  const result = await formRef.value?.validate()
  if (!result?.valid) return
  emit(BRAND_FORM_EMIT.SUBMIT, {
    name: form.name.trim(),
    isActive: form.isActive,
    legalName: form.legalName?.trim() ?? null,
    taxCode: form.taxCode?.trim() ?? null,
    createdAt: form.createdAt,
    createdBy: form.createdBy,
    updatedAt: form.updatedAt,
    updatedBy: form.updatedBy,
  })
}
</script>
