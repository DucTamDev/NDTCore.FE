<template>
  <div class="d-flex flex-column ga-5">
    <template v-if="store.loading.value">
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="card" height="120" />
      <v-skeleton-loader type="card" />
    </template>

    <template v-else-if="store.data.value">
      <v-card variant="tonal" color="primary" rounded="lg" flat>
        <v-card-text class="pa-5">
          <div class="d-flex align-start justify-space-between flex-wrap ga-4">
            <div class="d-flex flex-column ga-3">
              <AppBreadcrumb
                :items="[
                  { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                  { title: 'Cửa hàng', to: { name: APP_ROUTES.ADMIN.CHILDREN.STORES.NAME } },
                  { title: store.data.value.name, disabled: true },
                ]"
              />
              <div class="d-flex align-center ga-3">
                <v-sheet rounded="lg" width="52" height="52" class="d-flex align-center justify-center flex-shrink-0">
                  <v-icon icon="mdi-store" size="28" color="primary" />
                </v-sheet>
                <div>
                  <div class="text-h6 font-weight-bold text-high-emphasis">{{ store.data.value.name }}</div>
                  <div class="text-body-2 text-medium-emphasis mt-1">{{ store.data.value.code }}</div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card rounded="lg" elevation="1">
        <v-tabs v-model="activeTab" color="primary" class="px-2">
          <v-tab value="overview" class="text-none" rounded="lg">
            <v-icon start icon="mdi-information-outline" size="18" />
            Tổng quan
          </v-tab>
        </v-tabs>
        <v-divider />
        <v-window v-model="activeTab">
          <v-window-item value="overview">
            <StoreOverviewTab
              :form="editForm"
              :is-dirty="isDirty"
              :submitting="submitting"
              @update:form="onFormUpdate"
              @save="saveChanges"
              @discard="discardChanges"
            />
          </v-window-item>
        </v-window>
      </v-card>
    </template>

    <AppEmptyState
      v-else-if="!store.loading.value"
      icon="mdi-store-off-outline"
      title="Không tìm thấy cửa hàng"
      description="Cửa hàng này không tồn tại hoặc đã bị xóa."
    >
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-arrow-left" rounded="lg" :to="{ name: APP_ROUTES.ADMIN.CHILDREN.STORES.NAME }">
          Quay lại danh sách
        </v-btn>
      </template>
    </AppEmptyState>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AppBreadcrumb, AppEmptyState } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { storeMapper } from '@/modules/store/mappers/store.mapper'
import { useStore } from '@/modules/store/composables/useStore'
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'
import StoreOverviewTab from '@/modules/store/components/detail/StoreOverviewTab.vue'

const route = useRoute()
const { getStore, updateStore } = useStore()

const storeId = Number(route.params['id'])
const activeTab = ref('overview')

const store = useAsyncState(() => getStore(storeId))

const editForm = reactive<StoreFormModel>({
  brandId: null,
  franchiseeId: null,
  name: '',
  code: '',
  slug: null,
  logoUrl: null,
  isActive: true,
  isAcceptingOrders: true,
  phone: null,
  email: null,
  address: null,
  city: null,
  ward: null,
  district: null,
  province: null,
  country: null,
  latitude: null,
  longitude: null,
  openTime: null,
  closeTime: null,
  timeZone: null,
})

const snapshot = ref<StoreFormModel | null>(null)

function syncFormFromStore() {
  if (!store.data.value) return
  const mapped = storeMapper.toFormModel(store.data.value)
  if (!mapped) return
  Object.assign(editForm, mapped)
  snapshot.value = { ...editForm }
}

onMounted(async () => {
  await store.execute()
  syncFormFromStore()
})

const isDirty = computed(() => {
  if (!snapshot.value) return false
  return (
    editForm.name !== snapshot.value.name ||
    editForm.slug !== snapshot.value.slug ||
    editForm.isActive !== snapshot.value.isActive ||
    editForm.isAcceptingOrders !== snapshot.value.isAcceptingOrders ||
    editForm.phone !== snapshot.value.phone ||
    editForm.email !== snapshot.value.email ||
    editForm.address !== snapshot.value.address ||
    editForm.province !== snapshot.value.province ||
    editForm.district !== snapshot.value.district ||
    editForm.ward !== snapshot.value.ward ||
    editForm.openTime !== snapshot.value.openTime ||
    editForm.closeTime !== snapshot.value.closeTime ||
    editForm.timeZone !== snapshot.value.timeZone
  )
})

function onFormUpdate(field: keyof StoreFormModel, value: unknown) {
  ;(editForm as Record<string, unknown>)[field] = value
}

const submitting = ref(false)

function discardChanges() {
  syncFormFromStore()
}

async function saveChanges() {
  submitting.value = true
  try {
    const updated = await updateStore(storeId, storeMapper.formModelToUpdateRequest(editForm))
    if (updated) {
      store.data.value = updated
      syncFormFromStore()
    }
  } finally {
    submitting.value = false
  }
}
</script>
