<template>
  <div>
    <!-- ── Tab toolbar ──────────────────────────────────────────── -->
    <div class="d-flex align-center justify-space-between ga-2 pa-3 px-4">
      <v-btn
        variant="text"
        rounded="lg"
        size="small"
        prepend-icon="mdi-arrow-left"
        @click="emit('back')"
      >
        Quay lại
      </v-btn>

      <div class="d-flex align-center ga-2">
        <v-slide-x-reverse-transition>
          <v-btn
            v-if="props.isDirty"
            variant="text"
            rounded="lg"
            size="small"
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
          size="small"
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

    <!-- ── Content ─────────────────────────────────────────────── -->
    <div class="pa-5">
      <v-row>
        <!-- ── Thông tin cơ bản ──────────────────────────────── -->
        <v-col cols="12" md="6">
          <v-card
            elevation="0"
            rounded="lg"
            height="100%"
            :class="['info-card', props.isDirty ? 'info-card--dirty' : '']"
          >
            <v-list-item class="bg-surface-variant py-3">
              <template #prepend>
                <v-sheet
                  rounded="md"
                  width="32"
                  height="32"
                  class="d-flex align-center justify-center mr-1"
                >
                  <v-icon icon="mdi-card-account-details-outline" size="16" color="primary" />
                </v-sheet>
              </template>
              <v-list-item-title class="font-weight-semibold">Thông tin cơ bản</v-list-item-title>
            </v-list-item>

            <v-divider />

            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field
                :model-value="props.form.name"
                label="Tên nhà nhượng quyền *"
                variant="outlined"
                color="primary"
                density="comfortable"
                prepend-inner-icon="mdi-handshake-outline"
                @update:model-value="emit('update:form', 'name', $event)"
              />

              <v-text-field
                :model-value="props.form.legalName"
                label="Tên pháp nhân"
                variant="outlined"
                color="primary"
                density="comfortable"
                prepend-inner-icon="mdi-office-building-outline"
                clearable
                @update:model-value="emit('update:form', 'legalName', $event || null)"
              />

              <v-text-field
                :model-value="props.form.taxCode"
                label="Mã số thuế"
                variant="outlined"
                color="primary"
                density="comfortable"
                prepend-inner-icon="mdi-file-document-outline"
                clearable
                @update:model-value="emit('update:form', 'taxCode', $event || null)"
              />

              <v-text-field
                :model-value="props.form.bankAccount"
                label="Số tài khoản ngân hàng"
                variant="outlined"
                color="primary"
                density="comfortable"
                prepend-inner-icon="mdi-bank-outline"
                clearable
                @update:model-value="emit('update:form', 'bankAccount', $event || null)"
              />

              <v-text-field
                :model-value="props.form.bankName"
                label="Tên ngân hàng"
                variant="outlined"
                color="primary"
                density="comfortable"
                prepend-inner-icon="mdi-bank"
                clearable
                @update:model-value="emit('update:form', 'bankName', $event || null)"
              />
            </div>
          </v-card>
        </v-col>

        <!-- ── Cài đặt ─────────────────────────────────────────── -->
        <v-col cols="12" md="6">
          <v-card
            elevation="0"
            rounded="lg"
            height="100%"
            :class="['info-card', props.isDirty ? 'info-card--dirty' : '']"
          >
            <v-list-item class="bg-surface-variant py-3">
              <template #prepend>
                <v-sheet
                  rounded="md"
                  width="32"
                  height="32"
                  class="d-flex align-center justify-center mr-1"
                >
                  <v-icon icon="mdi-cog-outline" size="16" color="primary" />
                </v-sheet>
              </template>
              <v-list-item-title class="font-weight-semibold">Cài đặt</v-list-item-title>
            </v-list-item>

            <v-divider />

            <div class="pa-4 d-flex flex-column ga-4">
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
                  <v-btn
                    value="active"
                    :color="props.form.isActive ? 'primary' : undefined"
                    variant="outlined"
                    class="text-none flex-1-1"
                    prepend-icon="mdi-check-circle-outline"
                  >
                    Đang hoạt động
                  </v-btn>
                  <v-btn
                    value="inactive"
                    :color="!props.form.isActive ? 'error' : undefined"
                    variant="outlined"
                    class="text-none flex-1-1"
                    prepend-icon="mdi-close-circle-outline"
                  >
                    Ngưng hoạt động
                  </v-btn>
                </v-btn-toggle>
              </div>

              <v-divider />

              <v-text-field
                :model-value="props.form.joinedDate"
                label="Ngày tham gia"
                variant="outlined"
                color="primary"
                density="comfortable"
                prepend-inner-icon="mdi-calendar-start"
                clearable
                @update:model-value="emit('update:form', 'joinedDate', $event || null)"
              />

              <v-text-field
                :model-value="props.form.terminatedDate"
                label="Ngày kết thúc"
                variant="outlined"
                color="primary"
                density="comfortable"
                prepend-inner-icon="mdi-calendar-end"
                clearable
                @update:model-value="emit('update:form', 'terminatedDate', $event || null)"
              />
            </div>
          </v-card>
        </v-col>

        <!-- ── Lịch sử ─────────────────────────────────────────── -->
        <v-col cols="12">
          <AppAuditHistory
            :created-at="props.entity.createdAt"
            :created-by="props.entity.createdBy"
            :updated-at="props.entity.updatedAt"
            :updated-by="props.entity.updatedBy"
            :format-date="formatBrandDate"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppAuditHistory } from '@/components/ui'
import type { FranchiseeViewModel } from '@/modules/brand/models/view-models/franchisee.view-model'
import type { FranchiseeFormModel } from '@/modules/brand/models/form-models/franchisee.model'
import { formatBrandDate } from '@/modules/brand/utils/brand.utils'

const props = defineProps<{
  entity: FranchiseeViewModel
  form: FranchiseeFormModel
  isDirty: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:form': [field: keyof FranchiseeFormModel, value: unknown]
  save: []
  discard: []
  back: []
}>()
</script>

<style scoped>
.info-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: border-color 0.2s ease;
}

.info-card--dirty {
  border-color: rgb(var(--v-theme-primary));
}
</style>
