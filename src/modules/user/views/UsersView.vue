<template>
  <div class="d-flex flex-column ga-4">
    <UserList
      :items="viewItems"
      :loading="listPage.loading.value"
      :page-number="listPage.pagination.pageNumber.value"
      :page-size="listPage.pagination.pageSize.value"
      :total-pages="listPage.pagination.totalPages.value"
      :total-items="listPage.pagination.totalItems.value"
      :active-filters="listPage.filters.activeFilters.value"
      :filter-fields="filterFields"
      :sort-by="listPage.sortBy.value"
      @update:active-filters="listPage.filters.setFilters"
      @search="listPage.onSearch"
      @reset="listPage.onResetFilters"
      @page-change="listPage.onPageChange"
      @page-size-change="listPage.onPageSizeChange"
      @sort-change="listPage.onSort"
      @row-action="handleRowAction"
      @create="openCreateDialog"
      @refresh="listPage.refresh"
    />

    <UserForm
      v-model="isFormDialogOpen"
      :submitting="submitting"
      @submit="saveUser"
    />

    <AppDialog
      v-model="isDeleteDialogOpen"
      title="Xóa người dùng"
      size="sm"
      confirm-label="Xóa"
      cancel-label="Hủy"
      :loading="deleting"
      @confirm="doDelete"
      @cancel="userToDelete = null"
    >
      Bạn có chắc muốn xóa người dùng
      <strong>{{ userToDelete?.fullName }}</strong>?
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppDialog } from '@/components/ui'
import { useListPage } from '@/components/ui/composables'
import type { ListPageParams } from '@/components/ui/composables'
import { APP_ROUTES, DEFAULT_PAGINATION } from '@/core/constants/_index'
import { toCreatePayload } from '@/modules/user/adapters/user.adapter'
import { useUser } from '@/modules/user/composables/useUser'
import { buildUserFilterFields, USER_ROW_ACTION } from '@/modules/user/constants/user-list.constants'
import type { CreateUserFormModel } from '@/modules/user/models/form-models/user.model'
import type { UserViewModel } from '@/modules/user/models/view-models/user.view-model'
import UserList from '@/modules/user/components/user/UserList.vue'
import UserForm from '@/modules/user/components/user/UserForm.vue'

const router = useRouter()
const { getPagedUsers, createUser, deleteUser } = useUser()

const filterFields = computed(() => buildUserFilterFields())

const fetchUsers = async (params: ListPageParams): Promise<{ items: UserViewModel[]; total: number }> => {
  const isActiveStr = params.filters['isActive'] as string | null
  const isLockedStr = params.filters['isLocked'] as string | null
  const result = await getPagedUsers({
    PageNumber: params.pageNumber,
    PageSize: params.pageSize,
    Keyword: (params.filters['keyword'] as string | null) ?? null,
    IsActive: isActiveStr === 'true' ? true : isActiveStr === 'false' ? false : null,
    IsLocked: isLockedStr === 'true' ? true : isLockedStr === 'false' ? false : null,
    SortBy: params.sortBy?.key ?? null,
    SortDirection: params.sortBy?.order ?? null,
  })
  return { items: result.items, total: result.totalCount }
}

const listPage = useListPage<UserViewModel>({
  fetchFn: fetchUsers,
  keyField: 'id',
  defaultPageSize: DEFAULT_PAGINATION.LIMIT,
})

const viewItems = computed<UserViewModel[]>(() => listPage.items.value ?? [])

const isFormDialogOpen = ref(false)
const submitting = ref(false)

const openCreateDialog = () => {
  isFormDialogOpen.value = true
}

const saveUser = async (form: Parameters<typeof toCreatePayload>[0]) => {
  submitting.value = true
  try {
    await createUser(toCreatePayload(form))
    isFormDialogOpen.value = false
    await listPage.refresh()
  } finally {
    submitting.value = false
  }
}

const userToDelete = ref<UserViewModel | null>(null)
const isDeleteDialogOpen = ref(false)
const deleting = ref(false)

const doDelete = async () => {
  if (!userToDelete.value) return
  const id = userToDelete.value.id
  isDeleteDialogOpen.value = false
  userToDelete.value = null
  deleting.value = true
  try {
    await deleteUser(id)
    await listPage.refresh()
  } finally {
    deleting.value = false
  }
}

const handleRowAction = (key: string, item: UserViewModel) => {
  if (key === USER_ROW_ACTION.EDIT) {
    void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.USER_DETAIL.NAME, params: { id: item.id } })
  } else if (key === USER_ROW_ACTION.DELETE) {
    userToDelete.value = item
    isDeleteDialogOpen.value = true
  }
}

onMounted(async () => {
  await listPage.refresh()
})
</script>
