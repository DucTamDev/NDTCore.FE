<script setup lang="ts">
import { onMounted } from 'vue'
import type { BrandModel } from '@/models/brand.model'
import { useListPage } from '@/components/ui/composables'
import type { ListPageParams, FilterField } from '@/components/ui'
import UI4Example from '@/components/ui/UI4.Example.vue'
import { CURRENCY, type CurrencyCode } from '@/core/constants/currency.constants'

// ─── Mock data ─────────────────────────────────────────────────────────────
const currencies: CurrencyCode[] = [CURRENCY.VND, CURRENCY.USD, CURRENCY.EUR, CURRENCY.SGD]

const MOCK_BRANDS: BrandModel[] = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  tenantId: `tenant-${i + 1}`,
  name: `Thương hiệu ${String(i + 1).padStart(2, '0')}`,
  code: `BRAND${String(i + 1).padStart(3, '0')}`,
  legalName: i % 3 === 0 ? null : `Công ty TNHH Thương Mại ${i + 1}`,
  taxCode: i % 4 === 0 ? null : String(i + 1).padStart(10, '0'),
  currency: currencies[i % currencies.length]!,
  timeZone: 'Asia/Ho_Chi_Minh',
  isActive: i % 4 !== 0,
  createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
  createdBy: 'admin',
  updatedAt: new Date(Date.now() - i * 3_600_000).toISOString(),
  updatedBy: 'admin',
}))

// ─── Filter fields (shared config) ─────────────────────────────────────────

const FIELDS: FilterField[] = [
  { key: 'keyword', label: 'Tìm kiếm', type: 'text' },
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'select',
    options: [
      { label: 'Đang hoạt động', value: 'active' },
      { label: 'Ngừng hoạt động', value: 'inactive' },
    ],
  },
  {
    key: 'currency',
    label: 'Tiền tệ',
    type: 'multiselect',
    options: [
      { label: 'VND', value: 'VND' },
      { label: 'USD', value: 'USD' },
      { label: 'EUR', value: 'EUR' },
    ],
  },
  { key: 'createdAt', label: 'Ngày tạo', type: 'daterange' },
]

// ─── Mock fetch function (thay bằng API call thực tế) ──────────────────────

const mockFetch = async (
  params: ListPageParams,
): Promise<{ items: BrandModel[]; total: number }> => {
  await new Promise((r) => setTimeout(r, 400))

  let filtered = [...MOCK_BRANDS]

  const keyword = params.filters['keyword'] as string | null
  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(
      (b) => b.name.toLowerCase().includes(kw) || b.code.toLowerCase().includes(kw),
    )
  }

  const status = params.filters['status'] as string | null
  if (status) {
    filtered = filtered.filter((b) => (status === 'active' ? b.isActive : !b.isActive))
  }

  const currencies = params.filters['currency'] as string[] | null
  if (currencies?.length) {
    filtered = filtered.filter((b) => currencies.includes(b.currency))
  }

  const dateRange = params.filters['createdAt'] as [string, string] | null
  if (dateRange?.[0]) {
    filtered = filtered.filter((b) => b.createdAt && b.createdAt >= dateRange[0])
  }
  if (dateRange?.[1]) {
    filtered = filtered.filter((b) => b.createdAt && b.createdAt <= dateRange[1] + 'T23:59:59')
  }

  if (params.sortBy) {
    const { key, order } = params.sortBy
    filtered.sort((a, b) => {
      const av = String(a[key as keyof BrandModel] ?? '')
      const bv = String(b[key as keyof BrandModel] ?? '')
      return order === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }

  const start = (params.pageNumber - 1) * params.pageSize
  return { items: filtered.slice(start, start + params.pageSize), total: filtered.length }
}

// ─── Composable ─────────────────────────────────────────────────────────────

const listPage = useListPage<BrandModel>({
  fetchFn: mockFetch,
  keyField: 'id',
  fields: FIELDS,
  defaultPageSize: 10,
})

onMounted(() => listPage.refresh())

// ─── Event handlers ─────────────────────────────────────────────────────────

const handleRowAction = (key: string, item: BrandModel) => {
  if (key === 'view') {
    console.log('[UI4] view:', item)
  } else if (key === 'edit') {
    console.log('[UI4] edit:', item)
  } else if (key === 'delete') {
    console.log('[UI4] delete:', item.id)
    // Gọi API xóa → sau đó refresh
    listPage.refresh()
  }
}

const handleBulkAction = (key: string) => {
  console.log(
    '[UI4] bulk action:',
    key,
    listPage.selection.selected.value.map((b) => b.id),
  )
  listPage.selection.clearSelection()
  listPage.refresh()
}
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <UI4Example
      :items="listPage.items.value"
      :loading="listPage.loading.value"
      :page-number="listPage.pagination.pageNumber.value"
      :page-size="listPage.pagination.pageSize.value"
      :total-pages="listPage.pagination.totalPages.value"
      :total-items="listPage.pagination.totalItems.value"
      :active-filters="listPage.filters.activeFilters.value"
      :selected="listPage.selection.selected.value"
      :selection-count="listPage.selection.selectionCount.value"
      :sort-by="listPage.sortBy.value"
      @update:active-filters="listPage.filters.setFilters($event)"
      @update:selected="listPage.selection.selected.value = $event"
      @search="listPage.onSearch"
      @reset="listPage.onResetFilters"
      @page-change="listPage.onPageChange"
      @page-size-change="listPage.onPageSizeChange"
      @sort-change="listPage.onSort"
      @row-action="handleRowAction"
      @bulk-action="handleBulkAction"
      @create="console.log('[UI4] create')"
      @refresh="listPage.refresh"
    />
  </v-container>
</template>
