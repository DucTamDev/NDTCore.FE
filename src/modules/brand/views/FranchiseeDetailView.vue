<template>
  <div class="d-flex flex-column ga-5">
    <template v-if="franchisee.loading.value">
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="card" height="120" />
      <v-skeleton-loader type="card" />
    </template>

    <template v-else-if="franchisee.data.value">
      <!-- ── Hero Header ──────────────────────────────────────── -->
      <v-card variant="tonal" color="primary" rounded="lg" flat>
        <v-card-text class="pa-5">
          <div class="d-flex align-start justify-space-between flex-wrap ga-4">
            <div class="d-flex flex-column ga-3">
              <AppBreadcrumb
                :items="[
                  { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                  { title: 'Nhà nhượng quyền', to: { name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME } },
                  { title: franchisee.data.value.name, disabled: true },
                ]"
              />
              <div class="d-flex align-center ga-3">
                <v-sheet
                  rounded="lg"
                  width="52"
                  height="52"
                  class="d-flex align-center justify-center flex-shrink-0"
                >
                  <v-icon icon="mdi-handshake-outline" size="28" color="primary" />
                </v-sheet>
                <div>
                  <div class="text-h6 font-weight-bold text-high-emphasis">
                    {{ franchisee.data.value.name }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis mt-1">
                    {{ franchisee.data.value.legalName || `Brand ID: ${franchisee.data.value.brandId}` }}
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
          <v-tab value="members" class="text-none" rounded="lg">
            <v-icon start icon="mdi-account-group-outline" size="18" />
            Thành viên
          </v-tab>
        </v-tabs>

        <v-divider />

        <v-window v-model="activeTab">
          <v-window-item value="overview">
            <FranchiseeOverviewTab
              :form="editForm"
              :is-dirty="isDirty"
              :submitting="submitting"
              @update:form="onFormUpdate"
              @save="saveChanges"
              @discard="discardChanges"
            />
          </v-window-item>
          <v-window-item value="members">
            <FranchiseeMemberList :franchisee-id="franchisee.data.value.id" />
          </v-window-item>
        </v-window>
      </v-card>
    </template>

    <!-- Not found -->
    <AppEmptyState
      v-else-if="!franchisee.loading.value"
      icon="mdi-handshake-outline"
      title="Không tìm thấy nhà nhượng quyền"
      description="Nhà nhượng quyền này không tồn tại hoặc đã bị xóa."
    >
      <template #actions>
        <v-btn
          color="primary"
          prepend-icon="mdi-arrow-left"
          rounded="lg"
          :to="{ name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME }"
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
import { franchiseeMapper } from '@/modules/brand/mappers/franchisee.mapper'
import { useFranchisee } from '@/modules/brand/composables/useFranchisee'
import type { FranchiseeFormModel } from '@/modules/brand/models/form-models/franchisee.model'
import FranchiseeOverviewTab from '@/modules/brand/components/franchisee/detail/FranchiseeOverviewTab.vue'
import FranchiseeMemberList from '@/modules/brand/components/franchisee/FranchiseeMemberList.vue'

const route = useRoute()
const { getFranchisee, updateFranchisee } = useFranchisee()

const franchiseeId = Number(route.params['id'])
const activeTab = ref('overview')

const franchisee = useAsyncState(() => getFranchisee(franchiseeId))

// ── Inline edit form ──────────────────────────────────────
const editForm = reactive<FranchiseeFormModel>({
  brandId: null,
  name: '',
  legalName: null,
  taxCode: null,
  bankAccount: null,
  bankName: null,
  joinedDate: null,
  terminatedDate: null,
  isActive: true,
})

const snapshot = ref<FranchiseeFormModel | null>(null)

function syncFormFromFranchisee() {
  if (!franchisee.data.value) return
  const mapped = franchiseeMapper.toFormModel(franchisee.data.value)
  if (!mapped) return
  Object.assign(editForm, mapped)
  snapshot.value = { ...editForm }
}

onMounted(async () => {
  await franchisee.execute()
  syncFormFromFranchisee()
})

const isDirty = computed(() => {
  if (!snapshot.value) return false
  return (
    editForm.name !== snapshot.value.name ||
    editForm.legalName !== snapshot.value.legalName ||
    editForm.taxCode !== snapshot.value.taxCode ||
    editForm.bankAccount !== snapshot.value.bankAccount ||
    editForm.bankName !== snapshot.value.bankName ||
    editForm.joinedDate !== snapshot.value.joinedDate ||
    editForm.terminatedDate !== snapshot.value.terminatedDate ||
    editForm.isActive !== snapshot.value.isActive
  )
})

function onFormUpdate(field: keyof FranchiseeFormModel, value: unknown) {
  ;(editForm as Record<string, unknown>)[field] = value
}

// ── Save / Discard ───────────────────────────────────────
const submitting = ref(false)

function discardChanges() {
  syncFormFromFranchisee()
}

async function saveChanges() {
  submitting.value = true
  try {
    const updated = await updateFranchisee(
      franchiseeId,
      franchiseeMapper.formModelToUpdateRequest(editForm),
    )
    if (updated) {
      franchisee.data.value = updated
      syncFormFromFranchisee()
    }
  } finally {
    submitting.value = false
  }
}
</script>
