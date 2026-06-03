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
                  <div class="d-flex align-center ga-2 mt-2 flex-wrap">
                    <v-chip v-if="store.data.value.brandName" size="small" color="primary" variant="tonal" prepend-icon="mdi-domain">
                      {{ store.data.value.brandName }}
                    </v-chip>
                    <v-chip v-if="store.data.value.franchiseeName" size="small" color="secondary" variant="tonal" prepend-icon="mdi-handshake-outline">
                      {{ store.data.value.franchiseeName }}
                    </v-chip>
                  </div>
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
              :entity="store.data.value"
              :form="editForm"
              :is-dirty="isDirty"
              :submitting="submitting"
              :brand-options="brandOptions"
              :franchisee-options="franchiseeOptions"
              @update:form="onFormUpdate"
              @brand-change="onBrandChange"
              @save="saveChanges"
              @discard="onDiscard"
              @back="onBack"
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

    <!-- Confirm bỏ thay đổi -->
    <AppConfirmDialog
      v-model="confirmOpen"
      title="Bỏ thay đổi?"
      message="Bạn có thay đổi chưa được lưu. Nếu tiếp tục, các thay đổi sẽ bị mất."
      confirm-label="Bỏ thay đổi"
      @confirm="onConfirmUnsaved"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppBreadcrumb, AppEmptyState, AppConfirmDialog } from '@/components/ui'
import type { FilterOption } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { useStore } from '@/modules/store/composables/useStore'
import { toForm, toPayload, emptyForm, TRACKED_FIELDS } from '@/modules/store/adapters/store.adapter'
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'
import StoreOverviewTab from '@/modules/store/components/StoreOverviewTab.vue'
import { brandService } from '@/modules/brand/services/brand.service'
import { franchiseeService } from '@/modules/brand/services/franchisee.service'
import { useUserStore } from '@/modules/user/stores/user.store'

const route = useRoute()
const router = useRouter()
const { getStore, updateStore } = useStore()
const userStore = useUserStore()

const storeId = Number(route.params['id'])
if (isNaN(storeId)) void router.replace({ name: APP_ROUTES.ADMIN.CHILDREN.STORES.NAME })

const activeTab = ref('overview')
const submitting = ref(false)
const confirmOpen = ref(false)
const pendingNavAction = ref<'back' | 'discard' | null>(null)

const brandOptions = ref<FilterOption[]>([])
const franchiseeOptions = ref<FilterOption[]>([])

const store = useAsyncState(() => getStore(storeId))

const editForm = reactive<StoreFormModel>(emptyForm())
const snapshot = ref<StoreFormModel | null>(null)

function syncFormFromStore() {
    if (!store.data.value) return
    Object.assign(editForm, toForm(store.data.value))
    snapshot.value = structuredClone(toRaw(editForm))
}

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return TRACKED_FIELDS.some((f) => editForm[f] !== snapshot.value![f])
})

function onFormUpdate(field: keyof StoreFormModel, value: unknown) {
    ;(editForm as Record<string, unknown>)[field] = value
}

function discardChanges() {
    syncFormFromStore()
}

function onBack() {
    if (isDirty.value) { pendingNavAction.value = 'back'; confirmOpen.value = true }
    else void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.STORES.NAME })
}

function onDiscard() {
    if (isDirty.value) { pendingNavAction.value = 'discard'; confirmOpen.value = true }
    else discardChanges()
}

function onConfirmUnsaved() {
    confirmOpen.value = false
    if (pendingNavAction.value === 'back') void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.STORES.NAME })
    else if (pendingNavAction.value === 'discard') discardChanges()
    pendingNavAction.value = null
}

async function loadBrandOptions() {
    await userStore.fetchProfile()
    const userId = userStore.profile?.Id
    if (!userId) return
    const brands = await brandService.getBrandsByUserIdAsync(userId)
    brandOptions.value = brands.map((b) => ({ label: b.name, value: b.id }))
}

async function loadFranchiseeOptions(brandId: number | null) {
    if (!brandId) { franchiseeOptions.value = []; return }
    const franchisees = await franchiseeService.getFranchiseesByBrandIdAsync(brandId)
    franchiseeOptions.value = franchisees.map((f) => ({ label: f.Name, value: f.Id }))
}

async function onBrandChange(brandId: number | null) {
    await loadFranchiseeOptions(brandId)
}

async function saveChanges() {
    if (!editForm.brandId) return
    submitting.value = true
    try {
        await updateStore(storeId, toPayload(editForm))
        await store.execute()
        syncFormFromStore()
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    if (isNaN(storeId)) return
    await Promise.all([store.execute(), loadBrandOptions()])
    syncFormFromStore()
    await loadFranchiseeOptions(editForm.brandId)
})
</script>
