<template>
  <div class="d-flex flex-column ga-5">
    <template v-if="user.loading.value">
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="card" height="120" />
      <v-skeleton-loader type="card" />
    </template>

    <template v-else-if="user.data.value">
      <v-card variant="tonal" color="primary" rounded="lg" flat>
        <v-card-text class="pa-5">
          <div class="d-flex flex-column ga-3">
            <AppBreadcrumb
              :items="[
                { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                { title: 'Người dùng', to: { name: APP_ROUTES.ADMIN.CHILDREN.USERS.NAME } },
                { title: user.data.value.fullName, disabled: true },
              ]"
            />
            <div class="d-flex align-center ga-3">
              <v-sheet rounded="lg" width="52" height="52" class="d-flex align-center justify-center flex-shrink-0">
                <v-icon icon="mdi-account" size="28" color="primary" />
              </v-sheet>
              <div>
                <div class="text-h6 font-weight-bold text-high-emphasis">{{ user.data.value.fullName }}</div>
                <div class="text-body-2 text-medium-emphasis mt-1">{{ user.data.value.email }}</div>
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
          <v-tab value="roles" class="text-none" rounded="lg">
            <v-icon start icon="mdi-shield-account-outline" size="18" />
            Roles
          </v-tab>
        </v-tabs>
        <v-divider />
        <v-window v-model="activeTab">
          <v-window-item value="overview">
            <UserOverviewTab
              :entity="user.data.value"
              :form="editForm"
              :is-dirty="isDirty"
              :submitting="submitting"
              @update:form="onFormUpdate"
              @save="saveChanges"
              @discard="onDiscard"
              @back="onBack"
            />
          </v-window-item>
          <v-window-item value="roles">
            <UserRolesTab
              :roles="user.data.value.roles"
              :submitting="assigning"
              @assign="onAssignRoles"
            />
          </v-window-item>
        </v-window>
      </v-card>
    </template>

    <AppEmptyState
      v-else-if="!user.loading.value"
      icon="mdi-account-off-outline"
      title="Không tìm thấy người dùng"
      description="Người dùng này không tồn tại hoặc đã bị xóa."
    >
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-arrow-left" rounded="lg" :to="{ name: APP_ROUTES.ADMIN.CHILDREN.USERS.NAME }">
          Quay lại danh sách
        </v-btn>
      </template>
    </AppEmptyState>

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
import { useUser } from '@/modules/user/composables/useUser'
import { toOverviewForm, toUpdatePayload, TRACKED_FIELDS } from '@/modules/user/adapters/user.adapter'
import type { UserOverviewFormModel } from '@/modules/user/models/form-models/user.model'
import UserOverviewTab from '@/modules/user/components/user/UserOverviewTab.vue'
import UserRolesTab from '@/modules/user/components/user/UserRolesTab.vue'

const route = useRoute()
const router = useRouter()
const { getUser, updateUser, assignRoles } = useUser()

const userId = String(route.params['id'] ?? '')
if (!userId) void router.replace({ name: APP_ROUTES.ADMIN.CHILDREN.USERS.NAME })

const activeTab = ref('overview')
const submitting = ref(false)
const assigning = ref(false)
const confirmOpen = ref(false)
const pendingNavAction = ref<'back' | 'discard' | null>(null)

const user = useAsyncState(() => getUser(userId))

const editForm = reactive<UserOverviewFormModel>({
  firstName: '', lastName: '', phoneNumber: null, avatarUrl: null, dateOfBirth: null, gender: null, isActive: true,
})
const snapshot = ref<UserOverviewFormModel | null>(null)

function syncFormFromUser() {
  if (!user.data.value) return
  Object.assign(editForm, toOverviewForm(user.data.value))
  snapshot.value = structuredClone(toRaw(editForm))
}

const isDirty = computed(() => {
  if (!snapshot.value) return false
  return TRACKED_FIELDS.some((f) => editForm[f] !== snapshot.value![f])
})

function onFormUpdate(field: keyof UserOverviewFormModel, value: unknown) {
  ;(editForm as Record<string, unknown>)[field] = value
}

function discardChanges() {
  syncFormFromUser()
}

function onBack() {
  if (isDirty.value) { pendingNavAction.value = 'back'; confirmOpen.value = true }
  else void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.USERS.NAME })
}

function onDiscard() {
  if (isDirty.value) { pendingNavAction.value = 'discard'; confirmOpen.value = true }
  else discardChanges()
}

function onConfirmUnsaved() {
  confirmOpen.value = false
  if (pendingNavAction.value === 'back') void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.USERS.NAME })
  else if (pendingNavAction.value === 'discard') discardChanges()
  pendingNavAction.value = null
}

async function saveChanges() {
  submitting.value = true
  try {
    await updateUser(userId, toUpdatePayload(editForm))
    await user.execute()
    syncFormFromUser()
  } finally {
    submitting.value = false
  }
}

async function onAssignRoles(roles: string[]) {
  assigning.value = true
  try {
    await assignRoles(userId, { Roles: roles })
    await user.execute()
  } finally {
    assigning.value = false
  }
}

onMounted(async () => {
  if (!userId) return
  await user.execute()
  syncFormFromUser()
})
</script>
