<script setup lang="ts">
import { ref } from 'vue'
import type { BrandModel } from '@/models/brand.model'
import type { ActiveFilters, FilterField, TableColumn, RowAction, BulkAction, SortState, StatusConfig } from './types'
import AppBreadcrumb from './components/AppBreadcrumb.vue'
import AppPageHeader from './components/AppPageHeader.vue'
import AppFilterBar from './components/AppFilterBar.vue'
import AppDataFilter from './components/AppDataFilter.vue'
import AppBulkActions from './components/AppBulkActions.vue'
import AppDataTable from './components/AppDataTable.vue'
import AppPagination from './components/AppPagination.vue'
import AppRowActions from './components/AppRowActions.vue'
import AppStatusChip from './components/AppStatusChip.vue'
import AppEmptyState from './components/AppEmptyState.vue'
import AppDialog from './components/AppDialog.vue'

// ─── Props (tất cả data đến từ useListPage ở view cha) ────────────────────────

const props = defineProps<{
  items: BrandModel[]
  loading: boolean
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItems: number
  activeFilters: ActiveFilters
  selected: BrandModel[]
  selectionCount: number
  sortBy: SortState | null
}>()

const emit = defineEmits<{
  'update:activeFilters': [value: ActiveFilters]
  'update:selected': [value: BrandModel[]]
  search: []
  reset: []
  'page-change': [page: number]
  'page-size-change': [size: number]
  'sort-change': [state: SortState | null]
  'row-action': [key: string, item: BrandModel]
  'bulk-action': [key: string]
  create: []
  refresh: []
}>()

// ─── Static config (presentation-only, no business logic) ─────────────────────

const FILTER_FIELDS: FilterField[] = [
  { key: 'keyword', label: 'Tìm kiếm', type: 'text', placeholder: 'Tên, mã thương hiệu...' },
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

const COLUMNS: TableColumn[] = [
  { key: 'name', title: 'Thương hiệu', sortable: true, minWidth: '200px' },
  { key: 'code', title: 'Mã', width: '110px' },
  { key: 'currency', title: 'Tiền tệ', width: '90px', align: 'center', hideBelow: 'md' },
  { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
  { key: 'updatedAt', title: 'Cập nhật', width: '150px', hideBelow: 'lg' },
  { key: 'actions', title: '', width: '110px', align: 'end' },
]

const ROW_ACTIONS: RowAction<BrandModel>[] = [
  { key: 'view', label: 'Xem chi tiết', icon: 'mdi-eye-outline' },
  { key: 'edit', label: 'Chỉnh sửa', icon: 'mdi-pencil-outline', color: 'primary' },
  {
    key: 'delete',
    label: 'Xóa',
    icon: 'mdi-delete-outline',
    color: 'error',
    disabled: (item) => !item.isActive,
  },
]

const BULK_ACTIONS: BulkAction[] = [
  { key: 'activate', label: 'Kích hoạt', icon: 'mdi-check-circle-outline', color: 'success' },
  { key: 'deactivate', label: 'Vô hiệu hóa', icon: 'mdi-cancel', color: 'warning' },
  { key: 'delete', label: 'Xóa', icon: 'mdi-delete-outline', color: 'error' },
]

const STATUS_CONFIG: Record<'active' | 'inactive', StatusConfig> = {
  active: { label: 'Hoạt động', color: 'success', icon: 'mdi-check-circle-outline', variant: 'tonal' },
  inactive: { label: 'Ngừng', color: 'error', icon: 'mdi-close-circle-outline', variant: 'tonal' },
}

// ─── UI state (dialog) ────────────────────────────────────────────────────────

const deleteDialog = ref(false)
const deletingBrand = ref<BrandModel | null>(null)

// ─── Handlers ────────────────────────────────────────────────────────────────

const handleRowAction = (key: string, item: BrandModel) => {
  if (key === 'delete') {
    deletingBrand.value = item
    deleteDialog.value = true
  } else {
    emit('row-action', key, item)
  }
}

const confirmDelete = () => {
  if (deletingBrand.value) emit('row-action', 'delete', deletingBrand.value)
  deleteDialog.value = false
  deletingBrand.value = null
}

const formatDate = (value: string | null) => {
  if (!value) return '—'
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(new Date(value))
}
</script>

<template>
  <div class="d-flex flex-column ga-4">
    <!-- Page header -->
    <AppPageHeader title="Thương hiệu" subtitle="Quản lý danh sách thương hiệu hệ thống">
      <template #breadcrumb>
        <AppBreadcrumb
          :items="[
            { title: 'Dashboard', to: '/admin' },
            { title: 'Thương hiệu', disabled: true },
          ]"
        />
      </template>

      <v-btn variant="outlined" prepend-icon="mdi-refresh" :loading="loading" @click="$emit('refresh')">
        Tải lại
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="$emit('create')">
        Tạo thương hiệu
      </v-btn>
    </AppPageHeader>

    <!-- Filter bar -->
    <AppFilterBar>
      <AppDataFilter
        :fields="FILTER_FIELDS"
        :model-value="activeFilters"
        @update:model-value="$emit('update:activeFilters', $event)"
        @search="$emit('search')"
        @reset="$emit('reset')"
      />

      <template #actions>
        <v-btn variant="outlined" prepend-icon="mdi-filter-off-outline" @click="$emit('reset')">
          Xóa lọc
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-magnify" @click="$emit('search')">
          Tìm kiếm
        </v-btn>
      </template>
    </AppFilterBar>

    <!-- Bulk actions (hiện khi có selection) -->
    <AppBulkActions
      :actions="BULK_ACTIONS"
      :selection-count="selectionCount"
      @action="$emit('bulk-action', $event)"
    />

    <!-- Table card -->
    <v-card rounded="lg">
      <AppDataTable
        :items="items"
        :columns="COLUMNS"
        :loading="loading"
        :selectable="true"
        :selected="selected"
        :sort-by="sortBy"
        item-key="id"
        @update:selected="$emit('update:selected', $event)"
        @update:sort-by="$emit('sort-change', $event)"
        @row-click="(item) => $emit('row-action', 'view', item)"
      >
        <!-- Custom cell: tên thương hiệu -->
        <template #item.name="{ item }">
          <div class="d-flex flex-column py-1">
            <span class="font-weight-medium">{{ item.name }}</span>
            <span v-if="item.legalName" class="text-caption text-medium-emphasis">
              {{ item.legalName }}
            </span>
          </div>
        </template>

        <!-- Custom cell: mã -->
        <template #item.code="{ item }">
          <v-chip size="small" variant="tonal" color="primary">{{ item.code }}</v-chip>
        </template>

        <!-- Custom cell: trạng thái -->
        <template #item.isActive="{ item }">
          <AppStatusChip :config="STATUS_CONFIG[item.isActive ? 'active' : 'inactive']" />
        </template>

        <!-- Custom cell: ngày cập nhật -->
        <template #item.updatedAt="{ item }">
          <span class="text-body-2">{{ formatDate(item.updatedAt) }}</span>
        </template>

        <!-- Custom cell: actions -->
        <template #item.actions="{ item }">
          <AppRowActions
            :actions="ROW_ACTIONS"
            :item="item"
            @action="handleRowAction($event, item)"
          />
        </template>

        <!-- Empty state -->
        <template #empty>
          <AppEmptyState
            icon="mdi-domain-off"
            title="Chưa có thương hiệu"
            description="Tạo thương hiệu đầu tiên để bắt đầu quản lý hệ thống."
          >
            <template #actions>
              <v-btn color="primary" prepend-icon="mdi-plus" @click="$emit('create')">
                Tạo thương hiệu
              </v-btn>
            </template>
          </AppEmptyState>
        </template>
      </AppDataTable>

      <v-divider />

      <!-- Pagination -->
      <AppPagination
        :page-number="pageNumber"
        :page-size="pageSize"
        :total-pages="totalPages"
        :total-items="totalItems"
        @update:page-number="$emit('page-change', $event)"
        @update:page-size="$emit('page-size-change', $event)"
      />
    </v-card>

    <!-- Delete confirmation dialog -->
    <AppDialog
      v-model="deleteDialog"
      title="Xác nhận xóa"
      size="sm"
      confirm-label="Xóa"
      @confirm="confirmDelete"
      @cancel="deleteDialog = false"
    >
      Bạn có chắc muốn xóa thương hiệu
      <strong>{{ deletingBrand?.name }}</strong>? Hành động này không thể hoàn tác.
    </AppDialog>
  </div>
</template>
