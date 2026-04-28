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
        :to="{ name: APP_ROUTES.AUTH.CHILDREN.REGISTER.NAME }"
        class="text-body-2 text-primary text-decoration-none font-weight-bold"
      >
        Đăng ký ngay
      </router-link>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useToastNotification } from '@/composables/useToastNotification'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'
import { VALIDATION_RULES } from '@/core/constants/validation-rule.constants'

const { login } = useAuth()
const { error: notifyError } = useToastNotification()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)

const rules = {
  email: [VALIDATION_RULES.required('Email'), VALIDATION_RULES.email],
  password: [VALIDATION_RULES.required('Mật khẩu'), VALIDATION_RULES.minLength(6)],
}

async function handleLogin() {
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  loading.value = true

  try {
    await login({
      Email: form.email,
      Password: form.password,
    })
  } catch (error) {
    notifyError(error instanceof Error ? error.message : 'Đăng nhập thất bại.')
  } finally {
    loading.value = false
  }
}
</script>
