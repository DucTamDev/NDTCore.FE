<template>
  <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:px-4">
    <v-card max-width="600" elevation="0">
      <v-card-text class="pa-8 text-center">
        <div class="mb-6">
          <v-icon
            :icon="mdiRocketLaunchOutline"
            size="120"
            color="primary"
            class="mb-4 rotate-animation"
          />
        </div>

        <div class="text-h1 font-weight-black text-primary mb-2">404</div>

        <h1 class="text-h4 font-weight-bold mb-3">Chúng tôi có một vấn đề!</h1>

        <p class="text-h6 text-medium-emphasis mb-8">
          Trang bạn đang tìm kiếm đã trôi dạt vào không gian vũ trụ.
        </p>

        <div class="tw:flex tw:flex-col tw:gap-3 sm:tw:flex-row tw:justify-center mb-8">
          <v-btn color="primary" size="x-large" :prepend-icon="mdiHome" @click="handleGoHome">
            Quay về Trái Đất
          </v-btn>

          <v-btn
            variant="outlined"
            color="primary"
            size="x-large"
            :prepend-icon="mdiArrowLeft"
            @click="handleGoBack"
          >
            Quay lại
          </v-btn>
        </div>

        <v-divider class="my-4" />

        <div class="text-body-2 text-medium-emphasis">
          <p class="mb-3">Liên kết nhanh:</p>
          <div class="tw:flex tw:flex-wrap tw:justify-center tw:gap-6">
            <router-link to="/help" class="text-primary text-decoration-none">
              Trung tâm trợ giúp
            </router-link>
            <router-link to="/contact" class="text-primary text-decoration-none">
              Liên hệ hỗ trợ
            </router-link>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { mdiRocketLaunchOutline, mdiHome, mdiArrowLeft } from '@mdi/js'

const router = useRouter()

const handleGoBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const handleGoHome = () => {
  router.push('/')
}
</script>

<style scoped>
.rotate-animation {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}
</style>
