<template>
  <div>
    <div class="d-flex align-center justify-space-between ga-2 pa-3 px-4">
      <v-btn variant="text" rounded="lg" size="small" prepend-icon="mdi-arrow-left" @click="$router.back()">
        Quay lại
      </v-btn>
      <div class="d-flex align-center ga-2">
        <v-slide-x-reverse-transition>
          <v-btn
            v-if="isDirty"
            variant="text"
            rounded="lg"
            size="small"
            :disabled="submitting"
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
          :loading="submitting"
          :disabled="!isDirty"
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
          <v-card elevation="0" rounded="lg">
            <v-list-item class="bg-surface-variant py-3">
              <v-list-item-title class="font-weight-semibold">Thông tin chung</v-list-item-title>
            </v-list-item>
            <v-divider />
            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field :model-value="form.name" label="Tên cửa hàng *" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'name', $event)" />
              <v-text-field :model-value="form.code" label="Mã cửa hàng" variant="outlined" density="comfortable" readonly />
              <div class="d-flex ga-4">
                <v-switch :model-value="form.isActive" label="Đang hoạt động" color="primary" hide-details @update:model-value="emit('update:form', 'isActive', $event)" />
                <v-switch :model-value="form.isAcceptingOrders" label="Nhận đơn" color="primary" hide-details @update:model-value="emit('update:form', 'isAcceptingOrders', $event)" />
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="0" rounded="lg">
            <v-list-item class="bg-surface-variant py-3">
              <v-list-item-title class="font-weight-semibold">Liên hệ</v-list-item-title>
            </v-list-item>
            <v-divider />
            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field :model-value="form.phone" label="Số điện thoại" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'phone', $event)" />
              <v-text-field :model-value="form.email" label="Email" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'email', $event)" />
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="0" rounded="lg">
            <v-list-item class="bg-surface-variant py-3">
              <v-list-item-title class="font-weight-semibold">Địa chỉ</v-list-item-title>
            </v-list-item>
            <v-divider />
            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field :model-value="form.address" label="Địa chỉ" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'address', $event)" />
              <v-text-field :model-value="form.province" label="Tỉnh/Thành" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'province', $event)" />
              <v-text-field :model-value="form.district" label="Quận/Huyện" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'district', $event)" />
              <v-text-field :model-value="form.ward" label="Phường/Xã" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'ward', $event)" />
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="0" rounded="lg">
            <v-list-item class="bg-surface-variant py-3">
              <v-list-item-title class="font-weight-semibold">Vận hành</v-list-item-title>
            </v-list-item>
            <v-divider />
            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field :model-value="form.openTime" label="Giờ mở cửa" variant="outlined" density="comfortable" color="primary" placeholder="HH:mm" @update:model-value="emit('update:form', 'openTime', $event)" />
              <v-text-field :model-value="form.closeTime" label="Giờ đóng cửa" variant="outlined" density="comfortable" color="primary" placeholder="HH:mm" @update:model-value="emit('update:form', 'closeTime', $event)" />
              <v-text-field :model-value="form.timeZone" label="Múi giờ" variant="outlined" density="comfortable" color="primary" placeholder="Asia/Ho_Chi_Minh" @update:model-value="emit('update:form', 'timeZone', $event)" />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'

defineProps<{
  form: StoreFormModel
  isDirty: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:form': [field: keyof StoreFormModel, value: unknown]
  save: []
  discard: []
}>()
</script>
