<template>
  <div class="d-flex flex-column ga-4">
    <AppPageHeader
      title="Thương hiệu"
      subtitle="Quản lý danh sách thương hiệu và trạng thái hoạt động"
    >
      <template #breadcrumb>
        <AppBreadcrumb
          :items="[
            { title: 'Dashboard', to: '/admin' },
            { title: 'Thương hiệu', disabled: true },
          ]"
        />
      </template>

      <!-- <v-btn
        variant="outlined"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="emit(BRAND_LIST_EMIT.REFRESH)"
      >
        Tải lại
      </v-btn> -->
      <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(BRAND_LIST_EMIT.CREATE)">
        Tạo thương hiệu
      </v-btn>
    </AppPageHeader>

    <AppFilterBar>
      <AppDataFilter
        :fields="BRAND_LIST_FILTER_FIELDS"
        :model-value="activeFilters"
        @update:model-value="emit(BRAND_LIST_EMIT.UPDATE_ACTIVE_FILTERS, $event)"
        @search="emit(BRAND_LIST_EMIT.SEARCH)"
      />

      <template #actions>
        <v-btn
          variant="text"
          prepend-icon="mdi-filter-off-outline"
          @click="emit(BRAND_LIST_EMIT.RESET)"
        >
          Xóa lọc
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-magnify" @click="emit(BRAND_LIST_EMIT.SEARCH)">
          Tìm kiếm
        </v-btn>
      </template>
    </AppFilterBar>

    <v-card rounded="lg">
      <AppDataTable
        :items="items"
        :columns="BRAND_LIST_COLUMNS"
        :loading="loading"
        :sort-by="sortBy"
        item-key="id"
        @update:sort-by="emit(BRAND_LIST_EMIT.SORT_CHANGE, $event)"
        @row-click="(item) => emit(BRAND_LIST_EMIT.ROW_ACTION, BRAND_ROW_ACTION.VIEW, item)"
      >
        <template #[`item.name`]="{ item }">
          <div class="d-flex flex-column py-1">
            <span class="font-weight-medium">{{ item.name }}</span>
            <span v-if="item.legalName" class="text-caption text-medium-emphasis">
              {{ item.legalName }}
            </span>
          </div>
        </template>

        <template #[`item.code`]="{ item }">
          <v-chip size="small" variant="tonal" color="primary">{{ item.code }}</v-chip>
        </template>

        <template #[`item.isActive`]="{ item }">
          <AppStatusChip
            :config="BRAND_STATUS_CONFIG[item.isActive ? BrandStatus.Active : BrandStatus.Inactive]"
          />
        </template>

        <template #[`item.actions`]="{ item }">
          <AppRowActions
            :actions="BRAND_LIST_ROW_ACTIONS"
            :item="item"
            @action="emit(BRAND_LIST_EMIT.ROW_ACTION, $event, item)"
          />
        </template>

        <template #empty>
          <AppEmptyState
            icon="mdi-domain-off"
            title="Chưa có thương hiệu"
            description="Tạo thương hiệu đầu tiên để bắt đầu quản lý hệ thống."
          >
            <template #actions>
              <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(BRAND_LIST_EMIT.CREATE)">
                Tạo thương hiệu
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
        @update:page-number="emit(BRAND_LIST_EMIT.PAGE_CHANGE, $event)"
        @update:page-size="emit(BRAND_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { ActiveFilters, SortState } from '@/components/ui'
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
  BRAND_LIST_EMIT,
  BRAND_ROW_ACTION,
  BRAND_LIST_FILTER_FIELDS,
  BRAND_LIST_COLUMNS,
  BRAND_LIST_ROW_ACTIONS,
  BRAND_STATUS_CONFIG,
  type BrandListEmits,
} from '@/modules/brand/constants/brand-list.constants'
import { BrandStatus } from '@/modules/brand/enums/_index'
import type { BrandViewModel } from '@/modules/brand/models/view-models/brand.view-model'

defineProps<{
  items: BrandViewModel[]
  loading: boolean
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItems: number
  activeFilters: ActiveFilters
  sortBy: SortState | null
}>()

const emit = defineEmits<BrandListEmits>()
</script>
