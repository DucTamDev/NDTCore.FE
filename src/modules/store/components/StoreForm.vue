<template>
  <AppDialog
    :model-value="modelValue"
    :title="title"
    :loading="submitting"
    confirm-label="Lưu"
    cancel-label="Hủy"
    size="lg"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="handleSubmit"
    @cancel="emit('update:modelValue', false)"
  >
    <v-form ref="formRef">
      <div class="text-subtitle-2 font-weight-semibold mb-3">Thông tin chung</div>
      <v-row dense>
        <v-col v-if="!isEdit" cols="12" md="6">
          <v-select
            :model-value="localForm.brandId"
            :items="brandOptions"
            item-title="label"
            item-value="value"
            label="Thương hiệu *"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="onBrandChange($event)"
          />
        </v-col>
        <v-col v-if="!isEdit" cols="12" md="6">
          <v-select
            :model-value="localForm.franchiseeId"
            :items="franchiseeOptions"
            item-title="label"
            item-value="value"
            label="Nhà nhượng quyền"
            variant="outlined"
            density="comfortable"
            color="primary"
            clearable
            @update:model-value="update('franchiseeId', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.name"
            label="Tên cửa hàng *"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('name', $event)"
          />
        </v-col>
        <v-col v-if="!isEdit" cols="12" md="6">
          <v-text-field
            :model-value="localForm.code"
            label="Mã cửa hàng *"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('code', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.slug"
            label="Slug"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('slug', $event)"
          />
        </v-col>
        <v-col cols="12">
          <div class="d-flex align-center ga-4">
            <v-switch
              :model-value="localForm.isActive"
              label="Đang hoạt động"
              color="primary"
              hide-details
              @update:model-value="update('isActive', !!$event)"
            />
            <v-switch
              :model-value="localForm.isAcceptingOrders"
              label="Nhận đơn"
              color="primary"
              hide-details
              @update:model-value="update('isAcceptingOrders', !!$event)"
            />
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <div class="text-subtitle-2 font-weight-semibold mb-3">Liên hệ</div>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field :model-value="localForm.phone" label="Số điện thoại" variant="outlined" density="comfortable" color="primary" @update:model-value="update('phone', $event)" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field :model-value="localForm.email" label="Email" variant="outlined" density="comfortable" color="primary" @update:model-value="update('email', $event)" />
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <div class="text-subtitle-2 font-weight-semibold mb-3">Địa chỉ</div>
      <v-row dense>
        <v-col cols="12">
          <v-text-field :model-value="localForm.address" label="Địa chỉ" variant="outlined" density="comfortable" color="primary" @update:model-value="update('address', $event)" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field :model-value="localForm.province" label="Tỉnh/Thành" variant="outlined" density="comfortable" color="primary" @update:model-value="update('province', $event)" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field :model-value="localForm.district" label="Quận/Huyện" variant="outlined" density="comfortable" color="primary" @update:model-value="update('district', $event)" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field :model-value="localForm.ward" label="Phường/Xã" variant="outlined" density="comfortable" color="primary" @update:model-value="update('ward', $event)" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field :model-value="localForm.country" label="Quốc gia" variant="outlined" density="comfortable" color="primary" @update:model-value="update('country', $event)" />
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <div class="text-subtitle-2 font-weight-semibold mb-3">Vận hành</div>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field :model-value="localForm.openTime" label="Giờ mở cửa" type="time" variant="outlined" density="comfortable" color="primary" clearable @update:model-value="update('openTime', $event || null)" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field :model-value="localForm.closeTime" label="Giờ đóng cửa" type="time" variant="outlined" density="comfortable" color="primary" clearable @update:model-value="update('closeTime', $event || null)" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field :model-value="localForm.timeZone" label="Múi giờ" variant="outlined" density="comfortable" color="primary" placeholder="Asia/Ho_Chi_Minh" @update:model-value="update('timeZone', $event)" />
        </v-col>
      </v-row>
    </v-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { AppDialog } from '@/components/ui'
import type { FilterOption } from '@/components/ui'
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'

interface Props {
  modelValue: boolean
  title: string
  form: StoreFormModel | null
  submitting: boolean
  isEdit?: boolean
  brandOptions?: FilterOption[]
  franchiseeOptions?: FilterOption[]
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  brandOptions: () => [],
  franchiseeOptions: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [form: StoreFormModel]
  'brand-change': [brandId: number | null]
}>()

const EMPTY_FORM: StoreFormModel = {
  brandId: null,
  franchiseeId: null,
  name: '',
  code: '',
  slug: null,
  logoUrl: null,
  isActive: true,
  isAcceptingOrders: true,
  phone: null,
  email: null,
  address: null,
  city: null,
  ward: null,
  district: null,
  province: null,
  country: null,
  latitude: null,
  longitude: null,
  openTime: null,
  closeTime: null,
  timeZone: null,
}

const localForm = ref<StoreFormModel>({ ...EMPTY_FORM })

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      localForm.value = props.form ? { ...props.form } : { ...EMPTY_FORM }
    }
  },
)

function update<K extends keyof StoreFormModel>(key: K, value: StoreFormModel[K]) {
  localForm.value[key] = value
}

function onBrandChange(brandId: number | null) {
  localForm.value.brandId = brandId
  localForm.value.franchiseeId = null
  emit('brand-change', brandId)
}

function handleSubmit() {
  emit('submit', { ...localForm.value })
}
</script>
