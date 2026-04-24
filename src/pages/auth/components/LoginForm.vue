<template>
  <v-form ref="formRef" @submit.prevent="handleLogin">
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
      autocomplete="current-password"
      :rules="rules.password"
      color="primary"
      :hide-details="false"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showPassword = !showPassword"
    />

    <div class="d-flex justify-end mb-6 mt-2">
      <router-link
        to="/forgot-password"
        class="text-caption text-primary text-decoration-none font-weight-bold"
      >
        Quên mật khẩu?
      </router-link>
    </div>

    <v-btn
      type="submit"
      color="primary"
      variant="flat"
      size="large"
      block
      :loading="loading"
      class="text-none"
    >
      Đăng nhập
    </v-btn>

    <div class="text-center mt-6">
      <span class="text-body-2 text-medium-emphasis">Chưa có tài khoản? </span>
      <router-link
        :to="APP_ROUTES.AUTH.REGISTER.PATH"
        class="text-body-2 text-primary text-decoration-none font-weight-bold"
      >
        Đăng ký ngay
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
const { login } = useAuth()
const { error: notifyError } = useNotification()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)

const rules = {
  email: [
    (value: string) => !!value || 'Vui lòng nhập email',
    (value: string) => /.+@.+\..+/.test(value) || 'Email không hợp lệ',
  ],
  password: [
    (value: string) => !!value || 'Vui lòng nhập mật khẩu',
    (value: string) => value.length >= 6 || 'Mật khẩu tối thiểu 6 ký tự',
  ],
}

async function handleLogin() {
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  loading.value = true

  try {
    await login({
      email: form.email,
      password: form.password,
    })
    await router.push(APP_ROUTES.DASHBOARD.HOME.PATH)
  } catch (error) {
    notifyError(error instanceof Error ? error.message : 'Đăng nhập thất bại.')
  } finally {
    loading.value = false
  }
}
</script>
