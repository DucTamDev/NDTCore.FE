<template>
  <v-card-text class="pa-5">
    <div v-if="isDirty" class="d-flex justify-end ga-2 mb-5">
      <v-btn variant="text" :disabled="submitting" @click="emit('discard')">Hủy thay đổi</v-btn>
      <v-btn color="primary" :loading="submitting" @click="emit('save')">Lưu thay đổi</v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.name"
          label="Tên nhà nhượng quyền *"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'name', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.legalName"
          label="Tên pháp nhân"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'legalName', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.taxCode"
          label="Mã số thuế"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'taxCode', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.bankAccount"
          label="Số tài khoản ngân hàng"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'bankAccount', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.bankName"
          label="Tên ngân hàng"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'bankName', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.joinedDate"
          label="Ngày tham gia (ISO 8601)"
          placeholder="2024-01-15T00:00:00Z"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'joinedDate', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.terminatedDate"
          label="Ngày kết thúc (ISO 8601)"
          placeholder="2025-12-31T00:00:00Z"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'terminatedDate', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-switch
          :model-value="form.isActive"
          label="Đang hoạt động"
          color="primary"
          density="comfortable"
          hide-details
          @update:model-value="emit('update:form', 'isActive', !!$event)"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <div class="text-caption text-medium-emphasis d-flex flex-column ga-1">
      <span v-if="form.createdAt">Tạo lúc: {{ new Date(form.createdAt).toLocaleString('vi-VN') }} bởi {{ form.createdBy }}</span>
      <span v-if="form.updatedAt">Cập nhật: {{ new Date(form.updatedAt).toLocaleString('vi-VN') }} bởi {{ form.updatedBy }}</span>
    </div>
  </v-card-text>
</template>

<script setup lang="ts">
import type { FranchiseeFormModel } from '@/modules/brand/models/form-models/franchisee.model'

defineProps<{
  form: FranchiseeFormModel
  isDirty: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:form': [field: keyof FranchiseeFormModel, value: unknown]
  save: []
  discard: []
}>()
</script>
