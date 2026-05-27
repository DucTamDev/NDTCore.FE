<template>
  <div class="d-flex flex-column ga-4">
    <FranchiseeList
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

    <FranchiseeForm
      v-model="isFormDialogOpen"
      :title="selectedFranchisee ? 'Cập nhật nhà nhượng quyền' : 'Tạo nhà nhượng quyền'"
      :form="selectedFranchisee ? franchiseeMapper.toFormModel(selectedFranchisee) : null"
      :is-edit="!!selectedFranchisee"
      :brand-options="brandOptions"
      :submitting="submitting"
      @submit="saveFranchisee"
    />

    <AppDialog
      v-model="isDeleteDialogOpen"
      title="Xóa nhà nhượng quyền"
      size="sm"
      confirm-label="Xóa"
      cancel-label="Hủy"
      :loading="deleting"
      @confirm="doDelete"
      @cancel="franchiseeToDelete = null"
    >
      Bạn có chắc muốn xóa nhà nhượng quyền
      <strong>{{ franchiseeToDelete?.name }}</strong>?
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppDialog } from '@/components/ui'
import type { FilterOption } from '@/components/ui'
import { useListPage } from '@/components/ui/composables'
import type { ListPageParams } from '@/components/ui/composables'
import { APP_ROUTES, DEFAULT_PAGINATION } from '@/core/constants/_index'
import { franchiseeMapper } from '@/modules/brand/mappers/franchisee.mapper'
import { useFranchisee } from '@/modules/brand/composables/useFranchisee'
import {
  buildFranchiseeFilterFields,
  FRANCHISEE_ROW_ACTION,
} from '@/modules/brand/constants/franchisee-list.constants'
import type { FranchiseeFormModel } from '@/modules/brand/models/form-models/franchisee.model'
import type { FranchiseeViewModel } from '@/modules/brand/models/view-models/franchisee.view-model'
import FranchiseeList from '@/modules/brand/components/FranchiseeList.vue'
import FranchiseeForm from '@/modules/brand/components/FranchiseeForm.vue'
import { brandService } from '@/modules/brand/services/brand.service'
import { useUserStore } from '@/modules/user/stores/user.store'

const router = useRouter()
const { getPagedFranchisees, createFranchisee, updateFranchisee, deleteFranchisee } = useFranchisee()
const userStore = useUserStore()

// ── Filter options ──────────────────────────────────────────────────────────
const brandOptions = ref<FilterOption[]>([])
const filterFields = computed(() => buildFranchiseeFilterFields(brandOptions.value))

// ── List page ───────────────────────────────────────────────────────────────
const fetchFranchisees = async (
  params: ListPageParams,
): Promise<{ items: FranchiseeViewModel[]; total: number }> => {
  const isActiveStr = params.filters['isActive'] as string | null
  const result = await getPagedFranchisees({
    PageNumber: params.pageNumber,
    PageSize: params.pageSize,
    Keyword: (params.filters['keyword'] as string | null) ?? null,
    BrandId: params.filters['brandId'] ? Number(params.filters['brandId']) : null,
    IsActive: isActiveStr === 'true' ? true : isActiveStr === 'false' ? false : null,
  })
  return { items: result.items, total: result.totalCount }
}

const listPage = useListPage<FranchiseeViewModel>({
  fetchFn: fetchFranchisees,
  keyField: 'id',
  defaultPageSize: DEFAULT_PAGINATION.LIMIT,
})

const viewItems = computed<FranchiseeViewModel[]>(() => listPage.items.value ?? [])

// ── Form dialog ─────────────────────────────────────────────────────────────
const selectedFranchisee = ref<FranchiseeViewModel | null>(null)
const isFormDialogOpen = ref(false)
const submitting = ref(false)

const openCreateDialog = () => {
  selectedFranchisee.value = null
  isFormDialogOpen.value = true
}

const saveFranchisee = async (form: FranchiseeFormModel) => {
  submitting.value = true
  try {
    if (selectedFranchisee.value) {
      await updateFranchisee(selectedFranchisee.value.id, franchiseeMapper.formModelToUpdateRequest(form))
    } else {
      await createFranchisee(franchiseeMapper.formModelToCreateRequest(form))
    }
    isFormDialogOpen.value = false
    selectedFranchisee.value = null
    await listPage.refresh()
  } finally {
    submitting.value = false
  }
}

// ── Delete dialog ───────────────────────────────────────────────────────────
const franchiseeToDelete = ref<FranchiseeViewModel | null>(null)
const isDeleteDialogOpen = ref(false)
const deleting = ref(false)

const doDelete = async () => {
  if (!franchiseeToDelete.value) return
  deleting.value = true
  try {
    await deleteFranchisee(franchiseeToDelete.value.id)
    isDeleteDialogOpen.value = false
    franchiseeToDelete.value = null
    await listPage.refresh()
  } finally {
    deleting.value = false
  }
}

// ── Row actions ─────────────────────────────────────────────────────────────
const handleRowAction = (key: string, item: FranchiseeViewModel) => {
  if (key === FRANCHISEE_ROW_ACTION.VIEW) {
    void router.push({
      name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEE_DETAIL.NAME,
      params: { id: item.id },
    })
  } else if (key === FRANCHISEE_ROW_ACTION.EDIT) {
    selectedFranchisee.value = item
    isFormDialogOpen.value = true
  } else if (key === FRANCHISEE_ROW_ACTION.DELETE) {
    franchiseeToDelete.value = item
    isDeleteDialogOpen.value = true
  }
}

onMounted(async () => {
  await userStore.fetchProfile()
  const userId = userStore.profile?.Id
  if (userId) {
    const brands = await brandService.getBrandsByUserIdAsync(userId)
    brandOptions.value = brands.map((b) => ({ label: b.name, value: b.id }))
  }
  await listPage.refresh()
})
</script>
