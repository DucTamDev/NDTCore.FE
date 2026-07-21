<template>
  <div class="pa-4 d-flex flex-column ga-4">
    <div v-if="canManage" class="d-flex justify-end">
      <v-btn color="primary" prepend-icon="mdi-account-plus-outline" @click="openAddDialog">
        Thêm thành viên
      </v-btn>
    </div>

    <div v-if="isLoading" class="d-flex justify-center pa-8">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <template v-else>
      <AppEmptyState
        v-if="members.length === 0"
        icon="mdi-account-group-outline"
        title="Chưa có thành viên"
        :description="canManage ? 'Nhấn \'Thêm thành viên\' để gán nhân viên cho cửa hàng.' : 'Cửa hàng này chưa có thành viên nào.'"
      />

      <v-card v-for="member in members" :key="member.userId" elevation="0" rounded="lg" class="info-card">
        <v-card-text class="d-flex align-center justify-space-between ga-3 pa-4 flex-wrap">
          <div class="d-flex align-center ga-3 flex-wrap">
            <v-avatar color="primary" variant="tonal" size="40">
              <v-img v-if="member.avatarUrl" :src="member.avatarUrl" />
              <span v-else>{{ member.fullName.charAt(0).toUpperCase() }}</span>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ member.fullName }}</div>
              <div class="text-caption text-medium-emphasis">{{ member.email }}</div>
            </div>
            <div class="d-flex flex-wrap ga-1 ml-2">
              <v-chip v-for="role in member.roles" :key="role" size="small" variant="tonal" color="primary">
                {{ role }}
              </v-chip>
            </div>
          </div>
          <v-btn
            v-if="canManage"
            icon="mdi-close"
            variant="text"
            color="error"
            size="small"
            @click="openRemoveConfirm(member)"
          />
        </v-card-text>
      </v-card>
    </template>

    <AppDialog
      v-model="addDialogOpen"
      title="Thêm thành viên"
      size="sm"
      :loading="isSubmitting"
      confirm-label="Gán"
      @confirm="onAssign"
    >
      <v-autocomplete
        v-model="selectedUserIds"
        :items="availableUserOptions"
        item-value="id"
        item-title="label"
        label="Chọn nhân viên (StoreManager/Cashier/OrderStaff)"
        :loading="isLoadingUsers"
        multiple
        chips
        closable-chips
        density="compact"
        variant="outlined"
        no-data-text="Không tìm thấy nhân viên phù hợp"
      />
    </AppDialog>

    <AppConfirmDialog
      v-model="removeConfirmOpen"
      title="Xóa thành viên"
      :message="`Xóa '${removeTarget?.fullName}' khỏi danh sách thành viên cửa hàng?`"
      confirm-label="Xóa"
      @confirm="onConfirmRemove"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AppDialog, AppConfirmDialog, AppEmptyState } from '@/components/ui'
import { SYSTEM_ROLES } from '@/core/constants/app.constants'
import { getUserRoles } from '@/composables/useMenuAccess'
import { useStoreMember } from '@/modules/store/composables/useStoreMember'
import { useUser } from '@/modules/user/composables/useUser'
import type { StoreMemberViewModel } from '@/modules/store/models/view-models/store-member.view-model'
import type { UserViewModel } from '@/modules/user/models/view-models/user.view-model'

const props = defineProps<{ storeId: number }>()

const { getStoreMembers, assignStoreMembers, removeStoreMember } = useStoreMember()
const { getPagedUsers } = useUser()

const canManage = computed(() =>
  getUserRoles().some((r) =>
    ([SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN, SYSTEM_ROLES.FRANCHISEE_OWNER] as string[]).includes(r),
  ),
)

const isLoading = ref(false)
const members = ref<StoreMemberViewModel[]>([])

async function loadMembers() {
  isLoading.value = true
  try {
    members.value = await getStoreMembers(props.storeId)
  } finally {
    isLoading.value = false
  }
}

const addDialogOpen = ref(false)
const isSubmitting = ref(false)
const isLoadingUsers = ref(false)
const eligibleUsers = ref<UserViewModel[]>([])
const selectedUserIds = ref<string[]>([])

const availableUserOptions = computed(() => {
  const memberIds = new Set(members.value.map((m) => m.userId))
  return eligibleUsers.value
    .filter((u) => !memberIds.has(u.id))
    .map((u) => ({ id: u.id, label: `${u.fullName} (${u.email})` }))
})

async function openAddDialog() {
  selectedUserIds.value = []
  addDialogOpen.value = true
  isLoadingUsers.value = true
  try {
    const result = await getPagedUsers({
      PageNumber: 1,
      PageSize: 200,
      RoleNames: [SYSTEM_ROLES.STORE_MANAGER, SYSTEM_ROLES.CASHIER, SYSTEM_ROLES.ORDER_STAFF],
    })
    eligibleUsers.value = result.items
  } finally {
    isLoadingUsers.value = false
  }
}

async function onAssign() {
  if (selectedUserIds.value.length === 0) return
  isSubmitting.value = true
  try {
    await assignStoreMembers(props.storeId, { UserIds: [...selectedUserIds.value] })
    addDialogOpen.value = false
    await loadMembers()
  } finally {
    isSubmitting.value = false
  }
}

const removeConfirmOpen = ref(false)
const removeTarget = ref<StoreMemberViewModel | null>(null)

function openRemoveConfirm(member: StoreMemberViewModel) {
  removeTarget.value = member
  removeConfirmOpen.value = true
}

async function onConfirmRemove() {
  if (!removeTarget.value) return
  const userId = removeTarget.value.userId
  removeConfirmOpen.value = false
  removeTarget.value = null
  await removeStoreMember(props.storeId, userId)
  await loadMembers()
}

onMounted(loadMembers)
</script>

<style scoped>
.info-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
