<template>
  <div class="d-flex flex-column ga-4">
    <StoreList
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

    <StoreForm
      v-model="isFormDialogOpen"
      :title="selectedStore ? 'Cập nhật cửa hàng' : 'Tạo cửa hàng'"
      :form="selectedStore ? storeMapper.toFormModel(selectedStore) : null"
      :is-edit="!!selectedStore"
      :brand-options="brandOptions"
      :franchisee-options="formFranchiseeOptions"
      :submitting="submitting"
      @submit="saveStore"
      @brand-change="onFormBrandChange"
    />

    <AppDialog
      v-model="isDeleteDialogOpen"
      title="Xóa cửa hàng"
      size="sm"
      confirm-label="Xóa"
      cancel-label="Hủy"
      :loading="deleting"
      @confirm="doDelete"
      @cancel="storeToDelete = null"
    >
      Bạn có chắc muốn xóa cửa hàng
      <strong>{{ storeToDelete?.name }}</strong>?
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AppDialog } from '@/components/ui'
import type { FilterOption } from '@/components/ui'
import { useListPage } from '@/components/ui/composables'
import type { ListPageParams } from '@/components/ui/composables'
import { APP_ROUTES, DEFAULT_PAGINATION } from '@/core/constants/_index'
import { storeMapper } from '@/modules/store/mappers/store.mapper'
import { useStore } from '@/modules/store/composables/useStore'
import { buildStoreFilterFields, STORE_ROW_ACTION } from '@/modules/store/constants/store-list.constants'
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'
import StoreList from '@/modules/store/components/StoreList.vue'
import StoreForm from '@/modules/store/components/StoreForm.vue'
import { brandService } from '@/modules/brand/services/brand.service'
import { franchiseeService } from '@/modules/brand/services/franchisee.service'
import { useUserStore } from '@/modules/user/stores/user.store'

const router = useRouter()
const { getPagedStores, createStore, updateStore, deleteStore } = useStore()
const userStore = useUserStore()

// ── Filter options ─────────────────────────────────────────────────────────
const brandOptions = ref<FilterOption[]>([])
const allUserFranchiseeOptions = ref<FilterOption[]>([])  // loaded once on mount
const filterFranchiseeOptions = ref<FilterOption[]>([])   // filter bar — updates per brand selection
const formFranchiseeOptions = ref<FilterOption[]>([])     // form dialog — per selected brand
const filterFields = computed(() =>
  buildStoreFilterFields(brandOptions.value, filterFranchiseeOptions.value),
)

// ── List page ───────────────────────────────────────────────────────────────
const fetchStores = async (params: ListPageParams): Promise<{ items: StoreViewModel[]; total: number }> => {
  const isActiveStr = params.filters['isActive'] as string | null
  const result = await getPagedStores({
    PageNumber: params.pageNumber,
    PageSize: params.pageSize,
    Keyword: (params.filters['keyword'] as string | null) ?? null,
    BrandId: params.filters['brandId'] ? Number(params.filters['brandId']) : null,
    FranchiseeId: params.filters['franchiseeId'] ? Number(params.filters['franchiseeId']) : null,
    IsActive: isActiveStr === 'true' ? true : isActiveStr === 'false' ? false : null,
    Province: (params.filters['province'] as string | null) ?? null,
    SortBy: params.sortBy?.key ?? null,
    SortDirection: params.sortBy?.order ?? null,
  })
  return { items: result.items, total: result.totalCount }
}

const listPage = useListPage<StoreViewModel>({
  fetchFn: fetchStores,
  keyField: 'id',
  defaultPageSize: DEFAULT_PAGINATION.LIMIT,
})

const viewItems = computed<StoreViewModel[]>(() => listPage.items.value ?? [])

watch(
  () => listPage.filters.activeFilters.value['brandId'],
  async (brandId) => {
    listPage.filters.setFilter('franchiseeId', null)
    if (!brandId) {
      filterFranchiseeOptions.value = allUserFranchiseeOptions.value
      return
    }
    const franchisees = await franchiseeService.getFranchiseesByBrandIdAsync(Number(brandId))
    filterFranchiseeOptions.value = franchisees.map((f) => ({ label: f.Name, value: f.Id }))
  },
)

// ── Form dialog ─────────────────────────────────────────────────────────────
const selectedStore = ref<StoreViewModel | null>(null)
const isFormDialogOpen = ref(false)
const submitting = ref(false)

const openCreateDialog = () => {
  selectedStore.value = null
  isFormDialogOpen.value = true
}

const onFormBrandChange = async (brandId: number | null) => {
  if (!brandId) {
    formFranchiseeOptions.value = []
    return
  }
  const franchisees = await franchiseeService.getFranchiseesByBrandIdAsync(brandId)
  formFranchiseeOptions.value = franchisees.map((f) => ({ label: f.Name, value: f.Id }))
}

const saveStore = async (form: StoreFormModel) => {
  submitting.value = true
  try {
    if (selectedStore.value) {
      await updateStore(selectedStore.value.id, storeMapper.formModelToUpdateRequest(form))
    } else {
      await createStore(storeMapper.formModelToCreateRequest(form))
    }
    isFormDialogOpen.value = false
    selectedStore.value = null
    await listPage.refresh()
  } finally {
    submitting.value = false
  }
}

// ── Delete dialog ───────────────────────────────────────────────────────────
const storeToDelete = ref<StoreViewModel | null>(null)
const isDeleteDialogOpen = ref(false)
const deleting = ref(false)

const doDelete = async () => {
  if (!storeToDelete.value) return
  deleting.value = true
  try {
    await deleteStore(storeToDelete.value.id)
    isDeleteDialogOpen.value = false
    storeToDelete.value = null
    await listPage.refresh()
  } finally {
    deleting.value = false
  }
}

// ── Row actions ─────────────────────────────────────────────────────────────
const handleRowAction = (key: string, item: StoreViewModel) => {
  if (key === STORE_ROW_ACTION.VIEW) {
    void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.STORE_DETAIL.NAME, params: { id: item.id } })
  } else if (key === STORE_ROW_ACTION.EDIT) {
    selectedStore.value = item
    isFormDialogOpen.value = true
  } else if (key === STORE_ROW_ACTION.DELETE) {
    storeToDelete.value = item
    isDeleteDialogOpen.value = true
  }
}

onMounted(async () => {
  await userStore.fetchProfile()
  const userId = userStore.profile?.Id
  if (userId) {
    const [brands, franchisees] = await Promise.all([
      brandService.getBrandsByUserIdAsync(userId),
      franchiseeService.getFranchiseesByUserIdAsync(userId),
    ])
    brandOptions.value = brands.map((b) => ({ label: b.name, value: b.id }))
    allUserFranchiseeOptions.value = franchisees.map((f) => ({ label: f.Name, value: f.Id }))
    filterFranchiseeOptions.value = allUserFranchiseeOptions.value
  }
  await listPage.refresh()
})
</script>
