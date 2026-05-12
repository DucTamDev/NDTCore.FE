<template>
  <div class="d-flex flex-column ga-4">
    <BrandList
      :items="viewItems"
      :loading="listPage.loading.value"
      :page-number="listPage.pagination.pageNumber.value"
      :page-size="listPage.pagination.pageSize.value"
      :total-pages="listPage.pagination.totalPages.value"
      :total-items="listPage.pagination.totalItems.value"
      :active-filters="listPage.filters.activeFilters.value"
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

    <BrandForm
      v-model="isFormDialogOpen"
      :title="selectedBrand ? 'Cập nhật thương hiệu' : 'Tạo thương hiệu'"
      :brand="brandMapper.toFormModel(selectedBrand)"
      :submitting="submitting"
      @submit="saveBrand"
    />

    <AppDialog
      v-model="isDeleteDialogOpen"
      title="Xóa thương hiệu"
      size="sm"
      confirm-label="Xóa"
      cancel-label="Hủy"
      :loading="deleting"
      @confirm="doDelete"
      @cancel="brandToDelete = null"
    >
      Bạn có chắc muốn xóa thương hiệu
      <strong>{{ brandToDelete?.name }}</strong
      >?
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
import { brandMapper } from '@/modules/brand/mappers/brand.mapper'
import { useBrand } from '@/modules/brand/composables/useBrand'
import type { BrandFormModel } from '@/modules/brand/models/form-models/brand.model'
import type { BrandViewModel } from '@/modules/brand/models/view-models/brand.view-model'
import { BRAND_ROW_ACTION } from '@/modules/brand/constants/brand-list.constants'
import BrandForm from '@/modules/brand/components/BrandForm.vue'
import BrandList from '@/modules/brand/components/BrandList.vue'

const router = useRouter()
const { getPagedBrands, createBrand, updateBrand, deleteBrand } = useBrand()

// ─── List page ────────────────────────────────────────────────────────────────

const fetchBrands = async (
  params: ListPageParams,
): Promise<{ items: BrandViewModel[]; total: number }> => {
  const status = params.filters['status'] as string | null
  const result = await getPagedBrands({
    PageNumber: params.pageNumber,
    PageSize: params.pageSize,
    Keyword: (params.filters['keyword'] as string | null) ?? null,
    IsActive: status === 'active' ? true : status === 'inactive' ? false : null,
    SortBy: params.sortBy?.key ?? null,
    SortDescending: params.sortBy ? params.sortBy.order === 'desc' : null,
  })
  return { items: result.items, total: result.totalCount }
}

const listPage = useListPage<BrandViewModel>({
  fetchFn: fetchBrands,
  keyField: 'id',
  defaultPageSize: DEFAULT_PAGINATION.LIMIT,
})

const viewItems = computed<BrandViewModel[]>(() => listPage.items.value ?? [])

// ─── Form dialog ──────────────────────────────────────────────────────────────

const selectedBrand = ref<BrandViewModel | null>(null)
const isFormDialogOpen = ref(false)
const submitting = ref(false)

const openCreateDialog = () => {
  selectedBrand.value = null
  isFormDialogOpen.value = true
}

const saveBrand = async (form: BrandFormModel) => {
  submitting.value = true
  try {
    if (selectedBrand.value) {
      await updateBrand(selectedBrand.value.id, brandMapper.formModelToUpdateRequest(form))
    } else {
      await createBrand(brandMapper.formModelToCreateRequest(form))
    }
    isFormDialogOpen.value = false
    selectedBrand.value = null
    await listPage.refresh()
  } finally {
    submitting.value = false
  }
}

// ─── Delete dialog ────────────────────────────────────────────────────────────

const brandToDelete = ref<BrandViewModel | null>(null)
const isDeleteDialogOpen = ref(false)
const deleting = ref(false)

const doDelete = async () => {
  if (!brandToDelete.value) return
  deleting.value = true
  try {
    await deleteBrand(brandToDelete.value.id)
    isDeleteDialogOpen.value = false
    brandToDelete.value = null
    await listPage.refresh()
  } finally {
    deleting.value = false
  }
}

// ─── Row actions ──────────────────────────────────────────────────────────────

const handleRowAction = (key: string, item: BrandViewModel) => {
  if (key === BRAND_ROW_ACTION.VIEW) {
    void router.push({
      name: APP_ROUTES.ADMIN.CHILDREN.BRAND_DETAIL.NAME,
      params: { id: item.id },
    })
  } else if (key === BRAND_ROW_ACTION.EDIT) {
    selectedBrand.value = item
    isFormDialogOpen.value = true
  } else if (key === BRAND_ROW_ACTION.DELETE) {
    brandToDelete.value = item
    isDeleteDialogOpen.value = true
  }
}

onMounted(() => listPage.refresh())
</script>
