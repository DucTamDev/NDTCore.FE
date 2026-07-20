<template>
  <AppDialog
    :model-value="modelValue"
    title="Tạo người dùng"
    :loading="submitting"
    confirm-label="Lưu"
    cancel-label="Hủy"
    size="lg"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="handleSubmit"
    @cancel="emit('update:modelValue', false)"
  >
    <v-form ref="formRef">
      <div class="text-subtitle-2 font-weight-semibold mb-3">Tài khoản</div>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.email"
            label="Email *"
            type="email"
            variant="solo-filled"
            flat
            @update:model-value="update('email', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.userName"
            label="Username *"
            variant="solo-filled"
            flat
            @update:model-value="update('userName', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.password"
            label="Mật khẩu *"
            type="password"
            variant="solo-filled"
            flat
            hint="Tối thiểu 6 ký tự"
            persistent-hint
            @update:model-value="update('password', $event)"
          />
        </v-col>
        <v-col cols="12" md="6" class="d-flex align-center">
          <v-switch
            :model-value="localForm.isActive"
            label="Đang hoạt động"
            color="primary"
            base-color="grey"
            hide-details
            @update:model-value="update('isActive', !!$event)"
          />
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <div class="text-subtitle-2 font-weight-semibold mb-3">Thông tin cá nhân</div>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.firstName"
            label="Họ *"
            variant="solo-filled"
            flat
            @update:model-value="update('firstName', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.lastName"
            label="Tên *"
            variant="solo-filled"
            flat
            @update:model-value="update('lastName', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.phoneNumber"
            label="Số điện thoại"
            variant="solo-filled"
            flat
            clearable
            @update:model-value="update('phoneNumber', $event || null)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.dateOfBirth"
            label="Ngày sinh"
            type="date"
            variant="solo-filled"
            flat
            clearable
            @update:model-value="update('dateOfBirth', $event || null)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.gender"
            label="Giới tính"
            variant="solo-filled"
            flat
            clearable
            @update:model-value="update('gender', $event || null)"
          />
        </v-col>
      </v-row>
    </v-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { AppDialog } from '@/components/ui'
import type { CreateUserFormModel } from '@/modules/user/models/form-models/user.model'
import { emptyCreateForm } from '@/modules/user/adapters/user.adapter'

interface Props {
  modelValue: boolean
  submitting: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [form: CreateUserFormModel]
}>()

const localForm = ref<CreateUserFormModel>(emptyCreateForm())

watch(
  () => props.modelValue,
  (open) => {
    if (open) localForm.value = emptyCreateForm()
  },
)

function update<K extends keyof CreateUserFormModel>(key: K, value: CreateUserFormModel[K]) {
  localForm.value[key] = value
}

function handleSubmit() {
  emit('submit', { ...localForm.value })
}
</script>
