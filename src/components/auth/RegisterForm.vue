<template>
  <v-form ref="formRef" @submit.prevent="handleRegister">
    <v-text-field
      v-model="form.fullName"
      label="Ho va ten"
      autocomplete="name"
      :rules="rules.fullName"
      color="primary"
      :hide-details="false"
      class="mb-2"
    />

    <v-text-field
      v-model="form.email"
      label="Email"
      type="email"
      autocomplete="email"
      :rules="rules.email"
      color="primary"
      :hide-details="false"
      class="mb-2"
    />

    <v-text-field
      v-model="form.password"
      label="Mat khau"
      :type="showPassword ? 'text' : 'password'"
      autocomplete="new-password"
      :rules="rules.password"
      color="primary"
      :hide-details="false"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showPassword = !showPassword"
      class="mb-2"
    />

    <v-text-field
      v-model="form.confirmPassword"
      label="Xac nhan mat khau"
      :type="showConfirm ? 'text' : 'password'"
      autocomplete="new-password"
      :rules="rules.confirmPassword"
      color="primary"
      :hide-details="false"
      :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showConfirm = !showConfirm"
    />

    <v-btn
      type="submit"
      color="primary"
      variant="flat"
      size="large"
      block
      :loading="loading"
      class="text-none mt-4"
    >
      Đăng ký
    </v-btn>

    <div class="text-center mt-6">
      <span class="text-body-2 text-medium-emphasis">Đã có tài khoản? </span>
      <router-link
        :to="{ name: APP_ROUTES.AUTH.CHILDREN.LOGIN.NAME }"
        class="text-body-2 text-primary text-decoration-none font-weight-bold"
      >
        Đăng nhập
      </router-link>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToastNotification } from '@/composables/useToastNotification'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'
import { VALIDATION_RULES } from '@/core/constants/validation-rule.constants'
import type { RegisterRequest } from '@/core/api/dtos/auth.dtos'

const router = useRouter()
const { register } = useAuth()
const { error: notifyError, success } = useToastNotification()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)

const rules = {
  fullName: [VALIDATION_RULES.required('Ho va ten')],
  email: [VALIDATION_RULES.required('Email'), VALIDATION_RULES.email],
  password: [VALIDATION_RULES.required('Mat khau'), VALIDATION_RULES.minLength(6)],
  confirmPassword: [
    VALIDATION_RULES.required('Xac nhan mat khau'),
    (value: string) => value === form.password || 'Mat khau khong khop',
  ],
}

async function handleRegister() {
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  loading.value = true

  const registerRequest: RegisterRequest = {
    FullName: form.fullName,
    Email: form.email,
    Password: form.password,
  }
  try {
    await register(registerRequest)
    success('Dang ky thanh cong. Ban co the dang nhap ngay.')
    await router.push(APP_ROUTES.AUTH.CHILDREN.LOGIN.PATH)
  } catch (error) {
    notifyError(error instanceof Error ? error.message : 'Dang ky that bai.')
  } finally {
    loading.value = false
  }
}
</script>
