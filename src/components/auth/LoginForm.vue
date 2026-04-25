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
      label="Mat khau"
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
        Quen mat khau?
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
      Dang nhap
    </v-btn>

    <div class="text-center mt-6">
      <span class="text-body-2 text-medium-emphasis">Chua co tai khoan? </span>
      <router-link
        :to="APP_ROUTES.AUTH.REGISTER.PATH"
        class="text-body-2 text-primary text-decoration-none font-weight-bold"
      >
        Dang ky ngay
      </router-link>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { APP_ROUTES } from '@/constants/routes'
import { VALIDATION_RULES } from '@/constants/validation.constants'

const router = useRouter()
const { login } = useAuth()
const { error: notifyError } = useToast()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)

const rules = {
  email: [VALIDATION_RULES.required('Email'), VALIDATION_RULES.email],
  password: [VALIDATION_RULES.required('Mat khau'), VALIDATION_RULES.minLength(6)],
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
    notifyError(error instanceof Error ? error.message : 'Dang nhap that bai.')
  } finally {
    loading.value = false
  }
}
</script>
