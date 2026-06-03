<template>
  <div class="d-flex flex-column ga-5">
    <template v-if="brand.loading.value">
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="card" height="120" />
      <v-skeleton-loader type="card" />
    </template>

    <template v-else-if="brand.data.value">
      <!-- ── Hero Header ──────────────────────────────────────── -->
      <v-card variant="tonal" color="primary" rounded="lg" flat>
        <v-card-text class="pa-5">
          <div class="d-flex align-start justify-space-between flex-wrap ga-4">
            <div class="d-flex flex-column ga-3">
              <AppBreadcrumb
                :items="[
                  { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                  { title: 'Thương hiệu', to: { name: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME } },
                  { title: brand.data.value.name, disabled: true },
                ]"
              />

              <div class="d-flex align-center ga-3">
                <v-sheet
                  rounded="lg"
                  width="52"
                  height="52"
                  class="d-flex align-center justify-center flex-shrink-0"
                >
                  <v-icon icon="mdi-domain" size="28" color="primary" />
                </v-sheet>

                <div>
                  <div class="text-h6 font-weight-bold text-high-emphasis">
                    {{ brand.data.value.name }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis mt-1">
                    {{ brand.data.value.legalName || brand.data.value.code }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- ── Tabs ────────────────────────────────────────────── -->
      <v-card rounded="lg" elevation="1">
        <v-tabs v-model="activeTab" color="primary" class="px-2">
          <v-tab value="overview" class="text-none" rounded="lg">
            <v-icon start icon="mdi-information-outline" size="18" />
            Tổng quan
          </v-tab>
          <v-tab value="stores" class="text-none" rounded="lg">
            <v-icon start icon="mdi-store-outline" size="18" />
            Cửa hàng
          </v-tab>
        </v-tabs>

        <v-divider />

        <v-window v-model="activeTab">
          <v-window-item value="overview">
            <BrandOverviewTab
              :entity="brand.data.value"
              :form="editForm"
              :errors="formErrors"
              :is-dirty="isDirty"
              :submitting="submitting"
              @update:form="onFormUpdate"
              @save="saveChanges"
              @discard="onDiscard"
              @back="onBack"
            />
          </v-window-item>
          <v-window-item value="stores">
            <BrandStoresTab :brand-id="brand.data.value.id" />
          </v-window-item>
        </v-window>
      </v-card>
    </template>

    <!-- Not found -->
    <AppEmptyState
      v-else-if="!brand.loading.value"
      icon="mdi-domain-off"
      title="Không tìm thấy thương hiệu"
      description="Thương hiệu này không tồn tại hoặc đã bị xóa."
    >
      <template #actions>
        <v-btn
          color="primary"
          prepend-icon="mdi-arrow-left"
          rounded="lg"
          :to="{ name: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME }"
        >
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
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { useBrand } from '@/modules/brand/composables/useBrand'
import { toForm, toPayload, emptyForm, TRACKED_FIELDS } from '@/modules/brand/adapters/brand.adapter'
import type { BrandFormModel } from '@/modules/brand/models/form-models/brand.model'
import BrandOverviewTab from '@/modules/brand/components/brand/BrandOverviewTab.vue'
import BrandStoresTab from '@/modules/brand/components/brand/BrandStoresTab.vue'

const route = useRoute()
const router = useRouter()
const { getBrand, updateBrand } = useBrand()

const brandId = Number(route.params['id'])
if (isNaN(brandId)) void router.replace({ name: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME })

const activeTab = ref('overview')
const submitting = ref(false)
const confirmOpen = ref(false)
const pendingNavAction = ref<'back' | 'discard' | null>(null)

const brand = useAsyncState(() => getBrand(brandId))

const editForm = reactive<BrandFormModel>(emptyForm())
const snapshot = ref<BrandFormModel | null>(null)
const formErrors = reactive<Partial<Record<keyof BrandFormModel, string>>>({})

function syncFormFromBrand() {
    if (!brand.data.value) return
    Object.assign(editForm, toForm(brand.data.value))
    snapshot.value = structuredClone(toRaw(editForm))
}

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return TRACKED_FIELDS.some((f) => editForm[f] !== snapshot.value![f])
})

function onFormUpdate(field: keyof BrandFormModel, value: unknown) {
    ;(editForm as Record<string, unknown>)[field] = value
    if (field === 'name' && typeof value === 'string' && value.trim()) delete formErrors.name
}

function discardChanges() {
    syncFormFromBrand()
    delete formErrors.name
}

function onBack() {
    if (isDirty.value) { pendingNavAction.value = 'back'; confirmOpen.value = true }
    else void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME })
}

function onDiscard() {
    if (isDirty.value) { pendingNavAction.value = 'discard'; confirmOpen.value = true }
    else discardChanges()
}

function onConfirmUnsaved() {
    confirmOpen.value = false
    if (pendingNavAction.value === 'back') void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME })
    else if (pendingNavAction.value === 'discard') discardChanges()
    pendingNavAction.value = null
}

async function saveChanges() {
    if (!editForm.name?.trim()) {
        formErrors.name = 'Tên thương hiệu là bắt buộc'
        return
    }
    delete formErrors.name
    submitting.value = true
    try {
        const ok = await updateBrand(brandId, toPayload(editForm))
        if (ok) {
            await brand.execute()
            syncFormFromBrand()
        }
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    if (isNaN(brandId)) return
    await brand.execute()
    syncFormFromBrand()
})
</script>
