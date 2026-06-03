<template>
  <div class="d-flex flex-column ga-4">
    <AppPageHeader
      title="Nhà nhượng quyền"
      subtitle="Quản lý danh sách nhà nhượng quyền và trạng thái hoạt động"
    >
      <template #breadcrumb>
        <AppBreadcrumb
          :items="[
            { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
            { title: 'Nhà nhượng quyền', disabled: true },
          ]"
        />
      </template>

      <v-btn
        variant="outlined"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="emit(FRANCHISEE_LIST_EMIT.REFRESH)"
      >
        Tải lại
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(FRANCHISEE_LIST_EMIT.CREATE)">
        Tạo nhà NQ
      </v-btn>
    </AppPageHeader>

    <AppFilterBar>
      <AppDataFilter
        :fields="filterFields"
        :model-value="activeFilters"
        @update:model-value="emit(FRANCHISEE_LIST_EMIT.UPDATE_ACTIVE_FILTERS, $event)"
        @search="emit(FRANCHISEE_LIST_EMIT.SEARCH)"
      />
      <template #actions>
        <v-btn variant="text" prepend-icon="mdi-filter-off-outline" @click="emit(FRANCHISEE_LIST_EMIT.RESET)">
          Xóa lọc
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-magnify" @click="emit(FRANCHISEE_LIST_EMIT.SEARCH)">
          Tìm kiếm
        </v-btn>
      </template>
    </AppFilterBar>

    <v-card rounded="lg">
      <AppDataTable
        :items="items"
        :columns="FRANCHISEE_LIST_COLUMNS"
        :loading="loading"
        :sort-by="sortBy"
        item-key="id"
        @update:sort-by="emit(FRANCHISEE_LIST_EMIT.SORT_CHANGE, $event)"
        @row-click="(item) => emit(FRANCHISEE_LIST_EMIT.ROW_ACTION, FRANCHISEE_ROW_ACTION.VIEW, item)"
      >
        <template #[`item.name`]="{ item }">
          <div class="d-flex flex-column py-1">
            <span class="font-weight-medium">{{ item.name }}</span>
            <span v-if="item.legalName" class="text-caption text-medium-emphasis">{{ item.legalName }}</span>
          </div>
        </template>

        <template #[`item.taxCode`]="{ item }">
          <v-chip v-if="item.taxCode" size="small" variant="tonal" color="primary">{{ item.taxCode }}</v-chip>
          <span v-else class="text-medium-emphasis text-caption">—</span>
        </template>

        <template #[`item.isActive`]="{ item }">
          <AppStatusChip
            :config="FRANCHISEE_STATUS_CONFIG[item.isActive ? FranchiseeStatus.Active : FranchiseeStatus.Inactive]"
          />
        </template>

        <template #[`item.joinedDate`]="{ item }">
          <span v-if="item.joinedDate" class="text-body-2">
            {{ new Date(item.joinedDate).toLocaleDateString('vi-VN') }}
          </span>
          <span v-else class="text-medium-emphasis text-caption">—</span>
        </template>

        <template #[`item.actions`]="{ item }">
          <AppRowActions
            :actions="FRANCHISEE_LIST_ROW_ACTIONS"
            :item="item"
            @action="emit(FRANCHISEE_LIST_EMIT.ROW_ACTION, $event, item)"
          />
        </template>

        <template #empty>
          <AppEmptyState
            icon="mdi-handshake-outline"
            title="Chưa có nhà nhượng quyền"
            description="Tạo nhà nhượng quyền đầu tiên để bắt đầu quản lý."
          >
            <template #actions>
              <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(FRANCHISEE_LIST_EMIT.CREATE)">
                Tạo nhà NQ
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
        @update:page-number="emit(FRANCHISEE_LIST_EMIT.PAGE_CHANGE, $event)"
        @update:page-size="emit(FRANCHISEE_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
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
import { APP_ROUTES } from '@/core/constants/_index'
import {
  FRANCHISEE_LIST_EMIT,
  FRANCHISEE_ROW_ACTION,
  FRANCHISEE_LIST_COLUMNS,
  FRANCHISEE_LIST_ROW_ACTIONS,
  FRANCHISEE_STATUS_CONFIG,
  type FranchiseeListEmits,
} from '@/modules/brand/constants/franchisee-list.constants'
import { FranchiseeStatus } from '@/modules/brand/enums/_index'
import type { FranchiseeViewModel } from '@/modules/brand/models/view-models/franchisee.view-model'

defineProps<{
  items: FranchiseeViewModel[]
  loading: boolean
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItems: number
  activeFilters: ActiveFilters
  filterFields: FilterField[]
  sortBy: SortState | null
}>()

const emit = defineEmits<FranchiseeListEmits>()
</script>
