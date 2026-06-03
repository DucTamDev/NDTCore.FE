<template>
  <AppDialog
    :model-value="modelValue"
    :title="title"
    :loading="submitting"
    size="lg"
    @update:model-value="emit(FRANCHISEE_FORM_EMIT.UPDATE_MODEL_VALUE, $event)"
  >
    <v-form ref="formRef" @submit.prevent="onSubmit">
      <v-row>
        <v-col v-if="!isEdit" cols="12" md="6">
          <v-select
            v-model="localForm.brandId"
            :items="brandOptions"
            item-title="label"
            item-value="value"
            label="Thương hiệu *"
            :rules="[(v) => !!v || 'Thương hiệu là bắt buộc']"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.name"
            label="Tên nhà nhượng quyền *"
            :rules="[(v: string) => !!v?.trim() || 'Tên là bắt buộc']"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.legalName"
            label="Tên pháp nhân"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.taxCode"
            label="Mã số thuế"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.bankAccount"
            label="Số tài khoản ngân hàng"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.bankName"
            label="Tên ngân hàng"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.joinedDate"
            label="Ngày tham gia (ISO 8601)"
            placeholder="2024-01-15T00:00:00Z"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col v-if="isEdit" cols="12" md="6">
          <v-text-field
            v-model="localForm.terminatedDate"
            label="Ngày kết thúc (ISO 8601)"
            placeholder="2025-12-31T00:00:00Z"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col v-if="isEdit" cols="12" md="6">
          <v-switch
            :model-value="localForm.isActive"
            label="Đang hoạt động"
            color="primary"
            base-color="grey"
            density="comfortable"
            hide-details
            @update:model-value="localForm.isActive = !!$event"
          />
        </v-col>
      </v-row>
    </v-form>

    <template #[`actions`]>
      <v-btn variant="text" :disabled="submitting" @click="emit(FRANCHISEE_FORM_EMIT.UPDATE_MODEL_VALUE, false)">
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
import type { FilterOption } from '@/components/ui'
import {
  FRANCHISEE_FORM_EMIT,
  type FranchiseeFormEmits,
} from '@/modules/brand/constants/franchisee-form.constants'
import type { FranchiseeFormModel } from '@/modules/brand/models/form-models/franchisee.model'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    form?: FranchiseeFormModel | null
    isEdit?: boolean
    brandOptions?: FilterOption[]
    submitting?: boolean
  }>(),
  { form: null, isEdit: false, brandOptions: () => [], submitting: false },
)

const emit = defineEmits<FranchiseeFormEmits>()

const formRef = ref<VForm | null>(null)

const localForm = reactive<FranchiseeFormModel>({
  brandId: null,
  name: '',
  legalName: null,
  taxCode: null,
  bankAccount: null,
  bankName: null,
  joinedDate: null,
  terminatedDate: null,
  isActive: true,
})

function fillForm(source: FranchiseeFormModel | null) {
  localForm.brandId = source?.brandId ?? null
  localForm.name = source?.name ?? ''
  localForm.legalName = source?.legalName ?? null
  localForm.taxCode = source?.taxCode ?? null
  localForm.bankAccount = source?.bankAccount ?? null
  localForm.bankName = source?.bankName ?? null
  localForm.joinedDate = source?.joinedDate ?? null
  localForm.terminatedDate = source?.terminatedDate ?? null
  localForm.isActive = source?.isActive ?? true
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) fillForm(props.form ?? null)
    else fillForm(null)
  },
)

async function onSubmit() {
  const result = await formRef.value?.validate()
  if (!result?.valid) return
  emit(FRANCHISEE_FORM_EMIT.SUBMIT, { ...localForm })
}
</script>
