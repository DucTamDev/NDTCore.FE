<template>
  <div class="d-flex flex-column ga-4">
    <AppPageHeader
      title="Cửa hàng"
      subtitle="Quản lý danh sách cửa hàng và trạng thái hoạt động"
    >
      <template #breadcrumb>
        <AppBreadcrumb
          :items="[
            { title: 'Dashboard', to: '/admin' },
            { title: 'Cửa hàng', disabled: true },
          ]"
        />
      </template>

      <!-- <v-btn
        variant="outlined"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="emit(STORE_LIST_EMIT.REFRESH)"
      >
        Tải lại
      </v-btn> -->
      <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(STORE_LIST_EMIT.CREATE)">
        Tạo cửa hàng
      </v-btn>
    </AppPageHeader>

    <AppFilterBar>
      <AppDataFilter
        :fields="filterFields"
        :model-value="activeFilters"
        @update:model-value="emit(STORE_LIST_EMIT.UPDATE_ACTIVE_FILTERS, $event)"
        @search="emit(STORE_LIST_EMIT.SEARCH)"
      />

      <template #actions>
        <v-btn variant="text" prepend-icon="mdi-filter-off-outline" @click="emit(STORE_LIST_EMIT.RESET)">
          Xóa lọc
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-magnify" @click="emit(STORE_LIST_EMIT.SEARCH)">
          Tìm kiếm
        </v-btn>
      </template>
    </AppFilterBar>

    <v-card rounded="lg">
      <AppDataTable
        :items="items"
        :columns="STORE_LIST_COLUMNS"
        :loading="loading"
        :sort-by="sortBy"
        item-key="id"
        @update:sort-by="emit(STORE_LIST_EMIT.SORT_CHANGE, $event)"
        @row-click="(item) => emit(STORE_LIST_EMIT.ROW_ACTION, STORE_ROW_ACTION.VIEW, item)"
      >
        <template #[`item.name`]="{ item }">
          <div class="d-flex flex-column py-1">
            <span class="font-weight-medium">{{ item.name }}</span>
            <span v-if="item.code" class="text-caption text-medium-emphasis">{{ item.code }}</span>
          </div>
        </template>

        <template #[`item.isActive`]="{ item }">
          <AppStatusChip :config="STORE_STATUS_CONFIG[item.isActive ? 'active' : 'inactive']" />
        </template>

        <template #[`item.isAcceptingOrders`]="{ item }">
          <v-icon
            :icon="item.isAcceptingOrders ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'"
            :color="item.isAcceptingOrders ? 'success' : 'error'"
            size="20"
          />
        </template>

        <template #[`item.actions`]="{ item }">
          <AppRowActions
            :actions="STORE_LIST_ROW_ACTIONS"
            :item="item"
            @action="emit(STORE_LIST_EMIT.ROW_ACTION, $event, item)"
          />
        </template>

        <template #empty>
          <AppEmptyState
            icon="mdi-store-off-outline"
            title="Chưa có cửa hàng"
            description="Tạo cửa hàng đầu tiên để bắt đầu quản lý."
          >
            <template #actions>
              <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(STORE_LIST_EMIT.CREATE)">
                Tạo cửa hàng
              </v-btn>
            </template>
          </AppEmptyState>
        </template>
      </AppDataTable>

      <v-divider />

      <AppPagination
        :page-number="pageNumber"
        :page-size="pageSize"
        :total-pages="totalPages"
        :total-items="totalItems"
        @update:page-number="emit(STORE_LIST_EMIT.PAGE_CHANGE, $event)"
        @update:page-size="emit(STORE_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { ActiveFilters, FilterField, SortState } from '@/components/ui'
import {
  AppBreadcrumb,
  AppPageHeader,
  AppFilterBar,
  AppDataFilter,
  AppDataTable,
  AppPagination,
  AppRowActions,
  AppStatusChip,
  AppEmptyState,
} from '@/components/ui'
import {
  STORE_LIST_EMIT,
  STORE_ROW_ACTION,
  STORE_LIST_COLUMNS,
  STORE_LIST_ROW_ACTIONS,
  STORE_STATUS_CONFIG,
  type StoreListEmits,
} from '@/modules/store/constants/store-list.constants'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'

defineProps<{
  items: StoreViewModel[]
  loading: boolean
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItems: number
  activeFilters: ActiveFilters
  filterFields: FilterField[]
  sortBy: SortState | null
}>()

const emit = defineEmits<StoreListEmits>()
</script>
