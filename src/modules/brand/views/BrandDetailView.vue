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
              :brand="brand.data.value"
              :form="editForm"
              :errors="formErrors"
              :is-dirty="isDirty"
              :submitting="submitting"
              @update:form="onFormUpdate"
              @save="saveChanges"
              @discard="discardChanges"
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AppBreadcrumb, AppEmptyState } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { brandMapper } from '@/modules/brand/mappers/brand.mapper'
import { useBrand } from '@/modules/brand/composables/useBrand'
import type { BrandFormModel } from '@/modules/brand/models/form-models/brand.model'
import { CURRENCY } from '@/core/constants/currency.constants'
import { TIMEZONE } from '@/core/constants/timezone.constants'
import BrandOverviewTab from '@/modules/brand/components/detail/BrandOverviewTab.vue'
import BrandStoresTab from '@/modules/brand/components/detail/BrandStoresTab.vue'

const route = useRoute()
const { getBrand, updateBrand } = useBrand()

const brandId = Number(route.params['id'])
const activeTab = ref('overview')

const brand = useAsyncState(() => getBrand(brandId))

// ── Inline edit form ──────────────────────────────────────────
const editForm = reactive<BrandFormModel>({
  name: '',
  legalName: null,
  taxCode: null,
  currency: CURRENCY.DEFAULT,
  timeZone: TIMEZONE.DEFAULT,
  isActive: true,
})

const snapshot = ref<BrandFormModel | null>(null)

function syncFormFromBrand() {
  if (!brand.data.value) return
  const mapped = brandMapper.toFormModel(brand.data.value)
  editForm.name = mapped?.name ?? ''
  editForm.isActive = mapped?.isActive ?? false
  editForm.legalName = mapped?.legalName
  editForm.taxCode = mapped?.taxCode
  editForm.currency = mapped?.currency
  editForm.timeZone = mapped?.timeZone
  snapshot.value = { ...editForm }
}

onMounted(async () => {
  await brand.execute()
  syncFormFromBrand()
})

const isDirty = computed(() => {
  if (!snapshot.value) return false
  return (
    editForm.name !== snapshot.value.name ||
    editForm.legalName !== snapshot.value.legalName ||
    editForm.taxCode !== snapshot.value.taxCode ||
    editForm.currency !== snapshot.value.currency ||
    editForm.timeZone !== snapshot.value.timeZone ||
    editForm.isActive !== snapshot.value.isActive
  )
})

const formErrors = reactive<Partial<Record<keyof BrandFormModel, string>>>({})

function onFormUpdate(field: keyof BrandFormModel, value: unknown) {
  ;(editForm as Record<string, unknown>)[field] = value
  if (field === 'name' && typeof value === 'string' && value.trim()) {
    delete formErrors.name
  }
}

// ── Save / Discard ───────────────────────────────────────────
const submitting = ref(false)

function discardChanges() {
  syncFormFromBrand()
  formErrors.name = undefined
}

async function saveChanges() {
  formErrors.name = editForm.name?.trim() ? undefined : 'Tên thương hiệu là bắt buộc'
  if (formErrors.name) return

  submitting.value = true
  try {
    const dto = brandMapper.formModelToUpdateRequest({
      name: editForm.name.trim(),
      isActive: editForm.isActive,
      legalName: editForm.legalName?.trim() ?? null,
      taxCode: editForm.taxCode?.trim() ?? null,
      currency: editForm.currency,
      timeZone: editForm.timeZone,
    })
    const updated = await updateBrand(brandId, dto)
    if (updated) {
      brand.data.value = {
        ...updated,
        createdAt: brand.data.value?.createdAt,
        createdBy: brand.data.value?.createdBy,
      }
      syncFormFromBrand()
    }
  } finally {
    submitting.value = false
  }
}
</script>
