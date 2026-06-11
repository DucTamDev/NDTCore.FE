<template>
  <div class="pa-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h5 font-weight-semibold">Bán hàng</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">Chọn cửa hàng để mở giao diện bán hàng</p>
      </div>
      <v-text-field
        v-model="keyword"
        placeholder="Tìm cửa hàng..."
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        style="max-width: 280px;"
        @update:model-value="debouncedFetch"
      />
    </div>

    <v-row v-if="isLoading" dense>
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card" height="160" />
      </v-col>
    </v-row>

    <div
      v-else-if="stores.length === 0"
      class="d-flex flex-column align-center justify-center ga-3 pa-12 text-medium-emphasis"
    >
      <v-icon icon="mdi-store-off-outline" size="56" />
      <span class="text-body-1">Không tìm thấy cửa hàng nào</span>
    </div>

    <v-row v-else dense>
      <v-col v-for="store in stores" :key="store.id" cols="12" sm="6" md="4">
        <v-card rounded="lg" border class="d-flex flex-column h-100">
          <v-card-text class="flex-grow-1 pa-4">
            <div class="d-flex align-start ga-3">
              <v-avatar
                :image="store.logoUrl ?? undefined"
                :icon="store.logoUrl ? undefined : 'mdi-store'"
                rounded="lg"
                size="48"
                color="surface-variant"
              />
              <div class="flex-grow-1" style="min-width: 0;">
                <div class="text-body-1 font-weight-semibold text-truncate">{{ store.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ store.code }}</div>
              </div>
            </div>

            <div class="d-flex flex-wrap ga-1 mt-3">
              <v-chip
                :color="store.isActive ? 'success' : 'default'"
                variant="tonal"
                size="x-small"
              >
                {{ store.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
              </v-chip>
              <v-chip
                :color="store.isAcceptingOrders ? 'primary' : 'warning'"
                variant="tonal"
                size="x-small"
              >
                {{ store.isAcceptingOrders ? 'Đang nhận đơn' : 'Không nhận đơn' }}
              </v-chip>
            </div>

            <div
              v-if="store.address || store.district || store.province"
              class="text-caption text-medium-emphasis mt-2 d-flex align-center ga-1"
            >
              <v-icon icon="mdi-map-marker-outline" size="14" />
              <span class="text-truncate">
                {{ [store.address, store.district, store.province].filter(Boolean).join(', ') }}
              </span>
            </div>
          </v-card-text>

          <v-card-actions class="pa-3 pt-0">
            <v-btn
              color="primary"
              variant="flat"
              block
              prepend-icon="mdi-point-of-sale"
              :disabled="!store.isActive"
              @click="openPos(store.id)"
            >
              Mở POS
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="totalCount > pageSize" class="d-flex justify-center mt-6">
      <v-pagination
        v-model="page"
        :length="Math.ceil(totalCount / pageSize)"
        rounded="circle"
        density="compact"
        @update:model-value="fetchStores"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeService } from '@/modules/store/services/store.service'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'

const router     = useRouter()
const stores     = ref<StoreViewModel[]>([])
const isLoading  = ref(false)
const keyword    = ref('')
const page       = ref(1)
const pageSize   = 12
const totalCount = ref(0)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function debouncedFetch(): void {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        page.value = 1
        fetchStores()
    }, 300)
}

async function fetchStores(): Promise<void> {
    isLoading.value = true
    try {
        const result = await storeService.getPagedStoresAsync({
            PageNumber: page.value,
            PageSize:   pageSize,
            Keyword:    keyword.value || null,
            IsActive:   null,
        })
        stores.value     = result.items
        totalCount.value = result.totalCount
    } finally {
        isLoading.value = false
    }
}

function openPos(storeId: number): void {
    router.push({ name: APP_ROUTES.POS.POS.NAME, params: { storeId } })
}

onMounted(fetchStores)
</script>
