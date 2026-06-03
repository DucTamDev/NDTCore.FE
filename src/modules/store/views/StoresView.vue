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
      title="Tạo cửa hàng"
      :form="null"
      :is-edit="false"
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
import { toCreatePayload } from '@/modules/store/adapters/store.adapter'
import { useStore } from '@/modules/store/composables/useStore'
import { buildStoreFilterFields, STORE_ROW_ACTION } from '@/modules/store/constants/store-list.constants'
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'
import StoreList from '@/modules/store/components/store/StoreList.vue'
import StoreForm from '@/modules/store/components/store/StoreForm.vue'
import { useBrand } from '@/modules/brand/composables/useBrand'
import { useFranchisee } from '@/modules/brand/composables/useFranchisee'

const router = useRouter()
const { getPagedStores, createStore, deleteStore } = useStore()
const { getPagedBrands } = useBrand()
const { getPagedFranchisees } = useFranchisee()

// ── Filter options ─────────────────────────────────────────────────────────
const brandOptions = ref<FilterOption[]>([])
const allFranchiseeOptions = ref<FilterOption[]>([])
const filterFranchiseeOptions = ref<FilterOption[]>([])
const formFranchiseeOptions = ref<FilterOption[]>([])
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
    if (!brandId) { filterFranchiseeOptions.value = allFranchiseeOptions.value; return }
    const result = await getPagedFranchisees({ PageNumber: 1, PageSize: 200, BrandId: Number(brandId) })
    filterFranchiseeOptions.value = result.items.map((f) => ({ label: f.name, value: f.id }))
  },
)

// ── Form dialog ─────────────────────────────────────────────────────────────
const isFormDialogOpen = ref(false)
const submitting = ref(false)

const openCreateDialog = () => {
  isFormDialogOpen.value = true
}

const onFormBrandChange = async (brandId: number | null) => {
  if (!brandId) { formFranchiseeOptions.value = []; return }
  const result = await getPagedFranchisees({ PageNumber: 1, PageSize: 200, BrandId: brandId })
  formFranchiseeOptions.value = result.items.map((f) => ({ label: f.name, value: f.id }))
}

const saveStore = async (form: StoreFormModel) => {
  submitting.value = true
  try {
    await createStore(toCreatePayload(form))
    isFormDialogOpen.value = false
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
  const id = storeToDelete.value.id
  isDeleteDialogOpen.value = false
  storeToDelete.value = null
  deleting.value = true
  try {
    await deleteStore(id)
    await listPage.refresh()
  } finally {
    deleting.value = false
  }
}

// ── Row actions ─────────────────────────────────────────────────────────────
const handleRowAction = (key: string, item: StoreViewModel) => {
  if (key === STORE_ROW_ACTION.VIEW) {
    void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.STORE_DETAIL.NAME, params: { id: item.id } })
  } else if (key === STORE_ROW_ACTION.DELETE) {
    storeToDelete.value = item
    isDeleteDialogOpen.value = true
  }
}

onMounted(async () => {
  const [brandsResult, franchiseesResult] = await Promise.all([
    getPagedBrands({ PageNumber: 1, PageSize: 200 }),
    getPagedFranchisees({ PageNumber: 1, PageSize: 200 }),
  ])
  brandOptions.value = brandsResult.items.map((b) => ({ label: b.name, value: b.id }))
  allFranchiseeOptions.value = franchiseesResult.items.map((f) => ({ label: f.name, value: f.id }))
  filterFranchiseeOptions.value = allFranchiseeOptions.value
  await listPage.refresh()
})
</script>
