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
              :entity="franchisee.data.value"
              :form="editForm"
              :is-dirty="isDirty"
              :submitting="submitting"
              @update:form="onFormUpdate"
              @save="saveChanges"
              @discard="onDiscard"
              @back="onBack"
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
import { useFranchisee } from '@/modules/brand/composables/useFranchisee'
import { toForm, toPayload, emptyForm, TRACKED_FIELDS } from '@/modules/brand/adapters/franchisee.adapter'
import type { FranchiseeFormModel } from '@/modules/brand/models/form-models/franchisee.model'
import FranchiseeOverviewTab from '@/modules/brand/components/franchisee/FranchiseeOverviewTab.vue'
import FranchiseeMemberList from '@/modules/brand/components/franchisee/FranchiseeMemberList.vue'

const route = useRoute()
const router = useRouter()
const { getFranchisee, updateFranchisee } = useFranchisee()

const franchiseeId = Number(route.params['id'])
if (isNaN(franchiseeId)) void router.replace({ name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME })

const activeTab = ref('overview')
const submitting = ref(false)
const confirmOpen = ref(false)
const pendingNavAction = ref<'back' | 'discard' | null>(null)

const franchisee = useAsyncState(() => getFranchisee(franchiseeId))

const editForm = reactive<FranchiseeFormModel>(emptyForm())
const snapshot = ref<FranchiseeFormModel | null>(null)

function syncFormFromFranchisee() {
    if (!franchisee.data.value) return
    Object.assign(editForm, toForm(franchisee.data.value))
    snapshot.value = structuredClone(toRaw(editForm))
}

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return TRACKED_FIELDS.some((f) => editForm[f] !== snapshot.value![f])
})

function onFormUpdate(field: keyof FranchiseeFormModel, value: unknown) {
    ;(editForm as Record<string, unknown>)[field] = value
}

function discardChanges() {
    syncFormFromFranchisee()
}

function onBack() {
    if (isDirty.value) { pendingNavAction.value = 'back'; confirmOpen.value = true }
    else void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME })
}

function onDiscard() {
    if (isDirty.value) { pendingNavAction.value = 'discard'; confirmOpen.value = true }
    else discardChanges()
}

function onConfirmUnsaved() {
    confirmOpen.value = false
    if (pendingNavAction.value === 'back') void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME })
    else if (pendingNavAction.value === 'discard') discardChanges()
    pendingNavAction.value = null
}

async function saveChanges() {
    submitting.value = true
    try {
        const ok = await updateFranchisee(franchiseeId, toPayload(editForm))
        if (ok) {
            await franchisee.execute()
            syncFormFromFranchisee()
        }
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    if (isNaN(franchiseeId)) return
    await franchisee.execute()
    syncFormFromFranchisee()
})
</script>
