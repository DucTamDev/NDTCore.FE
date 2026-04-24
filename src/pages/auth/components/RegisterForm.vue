<template>
  <v-form ref="formRef" @submit.prevent="handleRegister">
    <v-text-field
      v-model="form.fullName"
      label="Họ và tên"
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
      label="Mật khẩu"
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
      label="Xác nhận mật khẩu"
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
        :to="APP_ROUTES.AUTH.LOGIN.PATH"
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
import { useNotification } from '@/composables/useNotification'
import { APP_ROUTES } from '@/constants/routes'

const router = useRouter()
const { register } = useAuth()
const { error: notifyError, success } = useNotification()
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
  fullName: [(value: string) => !!value || 'Vui lòng nhập họ tên'],
  email: [
    (value: string) => !!value || 'Vui lòng nhập email',
    (value: string) => /.+@.+\..+/.test(value) || 'Email không hợp lệ',
  ],
  password: [
    (value: string) => !!value || 'Vui lòng nhập mật khẩu',
    (value: string) => value.length >= 6 || 'Mật khẩu tối thiểu 6 ký tự',
  ],
  confirmPassword: [
    (value: string) => !!value || 'Vui lòng xác nhận mật khẩu',
    (value: string) => value === form.password || 'Mật khẩu không khớp',
  ],
}

async function handleRegister() {
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  loading.value = true

  try {
    await register({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
    })
    success('Đăng ký thành công. Bạn có thể đăng nhập ngay.')
    await router.push(APP_ROUTES.AUTH.LOGIN.PATH)
  } catch (error) {
    notifyError(error instanceof Error ? error.message : 'Đăng ký thất bại.')
  } finally {
    loading.value = false
  }
}
</script>
