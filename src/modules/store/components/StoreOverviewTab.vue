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
        <!-- ── Thông tin chung ────────────────────────────────── -->
        <v-col cols="12" md="6">
          <v-card
            elevation="0"
            rounded="lg"
            height="100%"
            :class="['info-card', props.isDirty ? 'info-card--dirty' : '']"
          >
            <v-list-item class="bg-surface-variant py-3">
              <template #prepend>
                <v-sheet rounded="md" width="32" height="32" class="d-flex align-center justify-center mr-1">
                  <v-icon icon="mdi-store-outline" size="16" color="primary" />
                </v-sheet>
              </template>
              <v-list-item-title class="font-weight-semibold">Thông tin chung</v-list-item-title>
            </v-list-item>

            <v-divider />

            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field
                :model-value="props.form.name"
                label="Tên cửa hàng *"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-store"
                @update:model-value="emit('update:form', 'name', $event)"
              />

              <v-text-field
                :model-value="props.form.code"
                label="Mã cửa hàng"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-pound"
                readonly
                hint="Mã cửa hàng không thể thay đổi"
                persistent-hint
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
                  <v-btn value="active" :color="props.form.isActive ? 'primary' : undefined" variant="outlined" class="text-none flex-1-1" prepend-icon="mdi-check-circle-outline">
                    Đang hoạt động
                  </v-btn>
                  <v-btn value="inactive" :color="!props.form.isActive ? 'error' : undefined" variant="outlined" class="text-none flex-1-1" prepend-icon="mdi-close-circle-outline">
                    Ngưng hoạt động
                  </v-btn>
                </v-btn-toggle>
              </div>

              <div>
                <div class="text-caption text-medium-emphasis mb-2 ml-1">Nhận đơn hàng</div>
                <v-btn-toggle
                  :model-value="props.form.isAcceptingOrders ? 'yes' : 'no'"
                  density="comfortable"
                  rounded="lg"
                  mandatory
                  class="w-100"
                  @update:model-value="emit('update:form', 'isAcceptingOrders', $event === 'yes')"
                >
                  <v-btn value="yes" :color="props.form.isAcceptingOrders ? 'primary' : undefined" variant="outlined" class="text-none flex-1-1" prepend-icon="mdi-cart-check">
                    Đang nhận đơn
                  </v-btn>
                  <v-btn value="no" :color="!props.form.isAcceptingOrders ? 'error' : undefined" variant="outlined" class="text-none flex-1-1" prepend-icon="mdi-cart-off">
                    Ngừng nhận đơn
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- ── Liên hệ ─────────────────────────────────────────── -->
        <v-col cols="12" md="6">
          <v-card
            elevation="0"
            rounded="lg"
            height="100%"
            :class="['info-card', props.isDirty ? 'info-card--dirty' : '']"
          >
            <v-list-item class="bg-surface-variant py-3">
              <template #prepend>
                <v-sheet rounded="md" width="32" height="32" class="d-flex align-center justify-center mr-1">
                  <v-icon icon="mdi-phone-outline" size="16" color="primary" />
                </v-sheet>
              </template>
              <v-list-item-title class="font-weight-semibold">Liên hệ</v-list-item-title>
            </v-list-item>

            <v-divider />

            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field
                :model-value="props.form.phone"
                label="Số điện thoại"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-phone-outline"
                clearable
                @update:model-value="emit('update:form', 'phone', $event || null)"
              />

              <v-text-field
                :model-value="props.form.email"
                label="Email"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-email-outline"
                clearable
                @update:model-value="emit('update:form', 'email', $event || null)"
              />
            </div>
          </v-card>
        </v-col>

        <!-- ── Địa chỉ ─────────────────────────────────────────── -->
        <v-col cols="12" md="6">
          <v-card
            elevation="0"
            rounded="lg"
            height="100%"
            :class="['info-card', props.isDirty ? 'info-card--dirty' : '']"
          >
            <v-list-item class="bg-surface-variant py-3">
              <template #prepend>
                <v-sheet rounded="md" width="32" height="32" class="d-flex align-center justify-center mr-1">
                  <v-icon icon="mdi-map-marker-outline" size="16" color="primary" />
                </v-sheet>
              </template>
              <v-list-item-title class="font-weight-semibold">Địa chỉ</v-list-item-title>
            </v-list-item>

            <v-divider />

            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field
                :model-value="props.form.address"
                label="Địa chỉ"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-road"
                clearable
                @update:model-value="emit('update:form', 'address', $event || null)"
              />

              <v-text-field
                :model-value="props.form.province"
                label="Tỉnh/Thành"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-map-outline"
                clearable
                @update:model-value="emit('update:form', 'province', $event || null)"
              />

              <v-text-field
                :model-value="props.form.district"
                label="Quận/Huyện"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-map-outline"
                clearable
                @update:model-value="emit('update:form', 'district', $event || null)"
              />

              <v-text-field
                :model-value="props.form.ward"
                label="Phường/Xã"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-map-outline"
                clearable
                @update:model-value="emit('update:form', 'ward', $event || null)"
              />
            </div>
          </v-card>
        </v-col>

        <!-- ── Vận hành ────────────────────────────────────────── -->
        <v-col cols="12" md="6">
          <v-card
            elevation="0"
            rounded="lg"
            height="100%"
            :class="['info-card', props.isDirty ? 'info-card--dirty' : '']"
          >
            <v-list-item class="bg-surface-variant py-3">
              <template #prepend>
                <v-sheet rounded="md" width="32" height="32" class="d-flex align-center justify-center mr-1">
                  <v-icon icon="mdi-clock-outline" size="16" color="primary" />
                </v-sheet>
              </template>
              <v-list-item-title class="font-weight-semibold">Vận hành</v-list-item-title>
            </v-list-item>

            <v-divider />

            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field
                :model-value="props.form.openTime"
                label="Giờ mở cửa"
                type="time"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-clock-start"
                clearable
                @update:model-value="emit('update:form', 'openTime', $event || null)"
              />

              <v-text-field
                :model-value="props.form.closeTime"
                label="Giờ đóng cửa"
                type="time"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-clock-end"
                clearable
                @update:model-value="emit('update:form', 'closeTime', $event || null)"
              />

              <v-text-field
                :model-value="props.form.timeZone"
                label="Múi giờ"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-earth"
                placeholder="Asia/Ho_Chi_Minh"
                clearable
                @update:model-value="emit('update:form', 'timeZone', $event || null)"
              />
            </div>
          </v-card>
        </v-col>

        <!-- ── Phân loại ─────────────────────────────────────────── -->
        <v-col cols="12">
          <v-card
            elevation="0"
            rounded="lg"
            :class="['info-card', props.isDirty ? 'info-card--dirty' : '']"
          >
            <v-list-item class="bg-surface-variant py-3">
              <template #prepend>
                <v-sheet rounded="md" width="32" height="32" class="d-flex align-center justify-center mr-1">
                  <v-icon icon="mdi-tag-multiple-outline" size="16" color="primary" />
                </v-sheet>
              </template>
              <v-list-item-title class="font-weight-semibold">Phân loại</v-list-item-title>
            </v-list-item>

            <v-divider />

            <div class="pa-4">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    :model-value="props.form.brandId"
                    label="Thương hiệu *"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    prepend-inner-icon="mdi-domain"
                    :items="props.brandOptions"
                    item-title="label"
                    item-value="value"
                    @update:model-value="onBrandChange($event)"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    :model-value="props.form.franchiseeId"
                    label="Nhà nhượng quyền"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    prepend-inner-icon="mdi-handshake-outline"
                    :items="props.franchiseeOptions"
                    item-title="label"
                    item-value="value"
                    clearable
                    :placeholder="props.form.brandId ? 'Trực thuộc thương hiệu' : 'Chọn thương hiệu trước'"
                    :disabled="!props.form.brandId"
                    @update:model-value="emit('update:form', 'franchiseeId', $event ?? null)"
                  />
                </v-col>
              </v-row>
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
            :format-date="formatStoreDate"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppAuditHistory } from '@/components/ui'
import type { FilterOption } from '@/components/ui'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'
import { formatStoreDate } from '@/modules/store/utils/store.utils'

const props = defineProps<{
  entity: StoreViewModel
  form: StoreFormModel
  isDirty: boolean
  submitting: boolean
  brandOptions: FilterOption[]
  franchiseeOptions: FilterOption[]
}>()

const emit = defineEmits<{
  'update:form': [field: keyof StoreFormModel, value: unknown]
  'brand-change': [brandId: number | null]
  save: []
  discard: []
  back: []
}>()

function onBrandChange(brandId: number | null) {
  emit('update:form', 'brandId', brandId)
  emit('update:form', 'franchiseeId', null)
  emit('brand-change', brandId)
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
