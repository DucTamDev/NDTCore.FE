<template>
  <section id="lien-he" class="contact-section bg-primary">
    <v-container>
      <v-row align="start" class="ga-y-10">
        <v-col cols="12" md="5">
          <v-chip color="on-primary" variant="tonal" class="mb-4">Liên hệ</v-chip>
          <h2 class="text-h4 font-weight-bold text-on-primary mb-6">
            Bắt đầu hành trình<br />
            cùng Soli Tea
          </h2>

          <div class="d-flex flex-column ga-4">
            <div v-for="info in CONTACT_INFO" :key="info.label" class="d-flex align-center ga-3">
              <v-icon :icon="info.icon" color="on-primary" size="24" />
              <div>
                <div class="text-caption text-on-primary opacity-75">{{ info.label }}</div>
                <component
                  :is="info.href ? 'a' : 'span'"
                  :href="info.href ?? undefined"
                  class="text-lime-accent-2 font-weight-medium text-decoration-none"
                >
                  {{ info.value }}
                </component>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="7">
          <v-card rounded="xl" class="pa-6">
            <div class="text-h6 mb-4 text-on-surface font-weight-bold">Đăng ký tư vấn miễn phí</div>

            <v-form ref="formRef" @submit.prevent="handleSubmit">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.name"
                    label="Họ và tên *"
                    :rules="requiredRule"
                    color="primary"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.phone"
                    label="Số điện thoại *"
                    type="tel"
                    :rules="requiredRule"
                    color="primary"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.city"
                    label="Tỉnh / Thành phố"
                    color="primary"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.message"
                    label="Bạn muốn hỏi gì?"
                    color="primary"
                    rows="4"
                  />
                </v-col>
              </v-row>

              <v-btn
                type="submit"
                color="primary"
                variant="flat"
                size="large"
                block
                :loading="isSubmitting"
                :prepend-icon="isSubmitted ? 'mdi-check' : undefined"
              >
                {{ isSubmitted ? 'Đã gửi thành công!' : 'Gửi đăng ký' }}
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ContactForm } from '@/data/home.types'

const formRef = ref<{ validate: () => Promise<{ valid: boolean }>; reset: () => void } | null>(null)
const isSubmitting = ref(false)
const isSubmitted = ref(false)

const form = reactive<ContactForm>({
  name: '',
  phone: '',
  city: '',
  message: '',
})

const requiredRule = [(value: string) => !!value || 'Trường này bắt buộc']

const CONTACT_INFO: { icon: string; label: string; value: string; href: string | null }[] = [
  { icon: 'mdi-phone', label: 'Hotline nhượng quyền', value: '0985 978 456', href: null },
  { icon: 'mdi-web', label: 'Website', value: 'soliteavn.com', href: 'https://soliteavn.com' },
  { icon: 'mdi-email', label: 'Email', value: 'haianhbg01@gmail.com', href: 'mailto:haianhbg01@gmail.com' },
  { icon: 'mdi-map-marker', label: 'Trụ sở', value: '211 Nam Kỳ Khởi Nghĩa, Vũng Tàu, TP.HCM', href: null },
]

async function handleSubmit() {
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 800))
  isSubmitting.value = false
  isSubmitted.value = true

  setTimeout(() => {
    isSubmitted.value = false
    Object.assign(form, { name: '', phone: '', city: '', message: '' })
    formRef.value?.reset()
  }, 3000)
}
</script>

<style scoped>
.contact-section {
  padding-top: 4rem;
  padding-bottom: 4rem;
}
</style>
