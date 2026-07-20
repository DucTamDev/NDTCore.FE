<template>
  <div>
    <div class="d-flex align-center justify-space-between ga-2 pa-3 px-4">
      <v-btn variant="text" rounded="lg" prepend-icon="mdi-arrow-left" @click="emit('back')">
        Quay lại
      </v-btn>

      <div class="d-flex align-center ga-2">
        <v-slide-x-reverse-transition>
          <v-btn
            v-if="props.isDirty"
            variant="text"
            rounded="lg"
            :disabled="props.submitting"
            @click="emit('discard')"
          >
            Hủy thay đổi
          </v-btn>
        </v-slide-x-reverse-transition>

        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          prepend-icon="mdi-content-save-outline"
          :loading="props.submitting"
          :disabled="!props.isDirty"
          @click="emit('save')"
        >
          Lưu thay đổi
        </v-btn>
      </div>
    </div>

    <v-divider />

    <div class="pa-5">
      <v-row>
        <v-col cols="12" md="6">
          <v-card elevation="0" rounded="lg" height="100%" class="info-card">
            <v-list-item class="bg-surface-variant py-3">
              <template #prepend>
                <v-sheet rounded="md" width="32" height="32" class="d-flex align-center justify-center mr-1">
                  <v-icon icon="mdi-account-outline" size="16" color="primary" />
                </v-sheet>
              </template>
              <v-list-item-title class="font-weight-semibold">Tài khoản</v-list-item-title>
            </v-list-item>
            <v-divider />
            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field :model-value="props.entity.email" label="Email" variant="solo-filled" flat readonly />
              <v-text-field :model-value="props.entity.userName" label="Username" variant="solo-filled" flat readonly />
              <div>
                <div class="text-caption text-medium-emphasis mb-2 ml-1">Trạng thái</div>
                <v-btn-toggle
                  :model-value="props.form.isActive ? 'active' : 'inactive'"
                  density="comfortable"
                  rounded="lg"
                  mandatory
                  class="w-100"
                  @update:model-value="emit('update:form', 'isActive', $event === 'active')"
                >
                  <v-btn value="active" :color="props.form.isActive ? 'primary' : undefined" variant="outlined" class="text-none flex-1-1" prepend-icon="mdi-check-circle-outline">
                    Đang hoạt động
                  </v-btn>
                  <v-btn value="inactive" :color="!props.form.isActive ? 'error' : undefined" variant="outlined" class="text-none flex-1-1" prepend-icon="mdi-close-circle-outline">
                    Ngưng hoạt động
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="0" rounded="lg" height="100%" class="info-card">
            <v-list-item class="bg-surface-variant py-3">
              <template #prepend>
                <v-sheet rounded="md" width="32" height="32" class="d-flex align-center justify-center mr-1">
                  <v-icon icon="mdi-card-account-details-outline" size="16" color="primary" />
                </v-sheet>
              </template>
              <v-list-item-title class="font-weight-semibold">Thông tin cá nhân</v-list-item-title>
            </v-list-item>
            <v-divider />
            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field :model-value="props.form.firstName" label="Họ *" variant="solo-filled" flat @update:model-value="emit('update:form', 'firstName', $event)" />
              <v-text-field :model-value="props.form.lastName" label="Tên *" variant="solo-filled" flat @update:model-value="emit('update:form', 'lastName', $event)" />
              <v-text-field :model-value="props.form.phoneNumber" label="Số điện thoại" variant="solo-filled" flat clearable @update:model-value="emit('update:form', 'phoneNumber', $event || null)" />
              <v-text-field :model-value="props.form.dateOfBirth" label="Ngày sinh" type="date" variant="solo-filled" flat clearable @update:model-value="emit('update:form', 'dateOfBirth', $event || null)" />
              <v-text-field :model-value="props.form.gender" label="Giới tính" variant="solo-filled" flat clearable @update:model-value="emit('update:form', 'gender', $event || null)" />
              <v-text-field :model-value="props.form.avatarUrl" label="Avatar URL" variant="solo-filled" flat clearable @update:model-value="emit('update:form', 'avatarUrl', $event || null)" />
            </div>
          </v-card>
        </v-col>

        <v-col cols="12">
          <AppAuditHistory
            :created-at="props.entity.createdAt"
            :created-by="props.entity.createdBy"
            :updated-at="props.entity.updatedAt"
            :updated-by="props.entity.updatedBy"
            :format-date="formatUserDate"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppAuditHistory } from '@/components/ui'
import type { UserDetailViewModel } from '@/modules/user/models/view-models/user-detail.view-model'
import type { UserOverviewFormModel } from '@/modules/user/models/form-models/user.model'

const props = defineProps<{
  entity: UserDetailViewModel
  form: UserOverviewFormModel
  isDirty: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:form': [field: keyof UserOverviewFormModel, value: unknown]
  save: []
  discard: []
  back: []
}>()

function formatUserDate(value: string | null | undefined): string {
  return value ? new Date(value).toLocaleString('vi-VN') : '—'
}
</script>

<style scoped>
.info-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
