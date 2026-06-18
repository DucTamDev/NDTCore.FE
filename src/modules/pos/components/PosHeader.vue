<template>
  <v-app-bar flat border="b" height="56" class="px-4">
    <div class="d-flex align-center ga-3">
      <v-avatar v-if="shiftStore.logoUrl" size="32" :image="shiftStore.logoUrl" />
      <v-icon v-else icon="mdi-store" size="24" />
      <span class="text-subtitle-1 font-weight-semibold">{{ shiftStore.storeName }}</span>

      <v-chip
        size="x-small"
        :color="shiftStore.isAcceptingOrders ? 'success' : 'error'"
        variant="tonal"
      >
        {{ shiftStore.isAcceptingOrders ? 'Đang nhận đơn' : 'Tạm dừng' }}
      </v-chip>
    </div>

    <v-spacer />

    <div class="d-flex align-center ga-2 mr-4 text-caption text-medium-emphasis">
      <template v-if="shiftStore.hasOpenShift">
        <v-icon icon="mdi-clock-outline" size="16" />
        <span>Ca {{ openedAtFormatted }} — {{ shiftStore.shiftOpenedBy }}</span>
      </template>
      <v-chip v-else color="warning" variant="tonal">
        Chưa mở ca
      </v-chip>
    </div>

    <v-btn icon="mdi-history" variant="text" @click="$emit('openHistory')" />

    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" variant="text" append-icon="mdi-chevron-down">
          Tài khoản
        </v-btn>
      </template>
      <v-list density="compact">
        <v-list-item title="Trang Admin" prepend-icon="mdi-view-dashboard-outline" @click="goToAdmin" />
        <v-divider />
        <v-list-item title="Đăng xuất" prepend-icon="mdi-logout" @click="logout" />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { usePosShiftStore } from '../stores/pos-shift.store'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'

defineEmits<{ openHistory: [] }>()

const shiftStore = usePosShiftStore()
const authStore  = useAuthStore()
const router     = useRouter()

const openedAtFormatted = computed(() => {
    if (!shiftStore.shiftOpenedAt) return ''
    return new Date(shiftStore.shiftOpenedAt).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    })
})

function goToAdmin(): void {
    router.push({ name: APP_ROUTES.ADMIN.CHILDREN.SALES.NAME })
}

function logout(): void {
    authStore.logout()
    router.push('/auth/login')
}
</script>
