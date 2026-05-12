<template>
  <div>
    <!-- ── Tab toolbar ──────────────────────────────────────────── -->
    <div class="d-flex align-center justify-space-between ga-2 pa-3 px-4">
      <!-- Quay lại -->
      <v-btn
        variant="text"
        rounded="lg"
        size="small"
        prepend-icon="mdi-arrow-left"
        @click="handleBack"
      >
        Quay lại
      </v-btn>

      <!-- Save / Discard -->
      <div class="d-flex align-center ga-2">
        <v-slide-x-reverse-transition>
          <v-btn
            v-if="props.isDirty"
            variant="text"
            rounded="lg"
            size="small"
            :disabled="props.submitting"
            @click="handleDiscard"
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
                label="Tên thương hiệu *"
                variant="outlined"
                color="primary"
                density="comfortable"
                :error-messages="props.errors.name ? [props.errors.name] : []"
                prepend-inner-icon="mdi-tag-outline"
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
                :model-value="props.brand.code"
                label="Mã thương hiệu"
                variant="outlined"
                color="primary"
                density="comfortable"
                prepend-inner-icon="mdi-pound"
                readonly
                hint="Mã thương hiệu không thể thay đổi"
                persistent-hint
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
              <v-select
                :model-value="props.form.currency"
                label="Tiền tệ"
                :items="CURRENCY_OPTIONS"
                item-title="label"
                item-value="value"
                variant="outlined"
                color="primary"
                density="comfortable"
                prepend-inner-icon="mdi-currency-usd"
                @update:model-value="emit('update:form', 'currency', $event)"
              />

              <v-select
                :model-value="props.form.timeZone"
                label="Múi giờ"
                :items="TIMEZONE_OPTIONS"
                item-title="label"
                item-value="value"
                variant="outlined"
                color="primary"
                density="comfortable"
                prepend-inner-icon="mdi-earth"
                @update:model-value="emit('update:form', 'timeZone', $event)"
              />

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
            </div>
          </v-card>
        </v-col>

        <!-- ── Lịch sử ─────────────────────────────────────────── -->
        <v-col cols="12">
          <v-card elevation="0" rounded="lg" class="info-card">
            <v-list-item class="bg-surface-variant py-3">
              <template #prepend>
                <v-sheet
                  rounded="md"
                  width="32"
                  height="32"
                  class="d-flex align-center justify-center mr-1"
                >
                  <v-icon icon="mdi-history" size="16" color="primary" />
                </v-sheet>
              </template>
              <v-list-item-title class="font-weight-semibold">Lịch sử</v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <v-list lines="two" density="comfortable">
                  <v-list-item min-height="60">
                    <template #prepend>
                      <v-icon icon="mdi-clock-plus-outline" size="18" class="mr-1 opacity-40" />
                    </template>
                    <v-list-item-title class="mb-1">Tạo lúc</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
                      {{ formatBrandDate(props.brand.createdAt) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-divider vertical />

              <v-col cols="12" sm="6">
                <v-list lines="two" density="comfortable">
                  <v-list-item min-height="60">
                    <template #prepend>
                      <v-icon icon="mdi-account-plus-outline" size="18" class="mr-1 opacity-40" />
                    </template>
                    <v-list-item-title class="mb-1">Tạo bởi</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
                      {{ props.brand.createdBy || '---' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-divider />

              <v-col cols="12" sm="6">
                <v-list lines="two" density="comfortable">
                  <v-list-item min-height="60">
                    <template #prepend>
                      <v-icon icon="mdi-clock-edit-outline" size="18" class="mr-1 opacity-40" />
                    </template>
                    <v-list-item-title class="mb-1">Cập nhật lúc</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
                      {{ formatBrandDate(props.brand.updatedAt) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-divider vertical />

              <v-col cols="12" sm="6">
                <v-list lines="two" density="comfortable">
                  <v-list-item min-height="60">
                    <template #prepend>
                      <v-icon icon="mdi-account-edit-outline" size="18" class="mr-1 opacity-40" />
                    </template>
                    <v-list-item-title class="mb-1">Cập nhật bởi</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
                      {{ props.brand.updatedBy || '---' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- ── Confirm dialog dùng chung cho cả Back và Discard ─── -->
    <AppDialog
      v-model="isConfirmOpen"
      title="Bỏ thay đổi?"
      size="sm"
      confirm-label="Bỏ thay đổi"
      cancel-label="Ở lại"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      Bạn có thay đổi chưa được lưu. Nếu tiếp tục, các thay đổi sẽ bị mất.
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppDialog } from '@/components/ui'
import { CURRENCY_OPTIONS } from '@/core/constants/currency.constants'
import { TIMEZONE_OPTIONS } from '@/core/constants/timezone.constants'
import { APP_ROUTES } from '@/core/constants/_index'
import type { BrandViewModel } from '@/modules/brand/models/view-models/brand.view-model'
import type { BrandFormModel } from '@/modules/brand/models/form-models/brand.model'
import { formatBrandDate } from '@/modules/brand/utils/brand.utils'

const props = defineProps<{
  brand: BrandViewModel
  form: BrandFormModel
  errors: Partial<Record<keyof BrandFormModel, string>>
  isDirty: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:form': [field: keyof BrandFormModel, value: unknown]
  save: []
  discard: []
}>()

const router = useRouter()

// ── Confirm dialog (dùng chung) ───────────────────────────────
type PendingAction = 'back' | 'discard'

const isConfirmOpen = ref(false)
const pendingAction = ref<PendingAction | null>(null)

function openConfirm(action: PendingAction) {
  pendingAction.value = action
  isConfirmOpen.value = true
}

function onConfirm() {
  isConfirmOpen.value = false
  if (pendingAction.value === 'back') {
    void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME })
  } else if (pendingAction.value === 'discard') {
    emit('discard')
  }
  pendingAction.value = null
}

function onCancel() {
  isConfirmOpen.value = false
  pendingAction.value = null
}

// ── Handlers ─────────────────────────────────────────────────
function handleBack() {
  if (props.isDirty) {
    openConfirm('back')
  } else {
    void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME })
  }
}

function handleDiscard() {
  openConfirm('discard')
}
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
