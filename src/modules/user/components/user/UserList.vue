<template>
  <div class="d-flex flex-column ga-4">
    <AppPageHeader
      title="Người dùng"
      subtitle="Quản lý tài khoản người dùng và phân quyền"
    >
      <template #breadcrumb>
        <AppBreadcrumb
          :items="[
            { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
            { title: 'Người dùng', disabled: true },
          ]"
        />
      </template>

      <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(USER_LIST_EMIT.CREATE)">
        Tạo người dùng
      </v-btn>
    </AppPageHeader>

    <AppFilterBar>
      <AppDataFilter
        :fields="filterFields"
        :model-value="activeFilters"
        @update:model-value="emit(USER_LIST_EMIT.UPDATE_ACTIVE_FILTERS, $event)"
        @search="emit(USER_LIST_EMIT.SEARCH)"
      />

      <template #actions>
        <v-btn variant="outlined" prepend-icon="mdi-filter-off-outline" @click="emit(USER_LIST_EMIT.RESET)">
          Xóa lọc
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-magnify" @click="emit(USER_LIST_EMIT.SEARCH)">
          Tìm kiếm
        </v-btn>
      </template>
    </AppFilterBar>

    <v-card rounded="lg">
      <AppDataTable
        :items="items"
        :columns="USER_LIST_COLUMNS"
        :loading="loading"
        :sort-by="sortBy"
        item-key="id"
        @update:sort-by="emit(USER_LIST_EMIT.SORT_CHANGE, $event)"
      >
        <template #[`item.fullName`]="{ item }">
          <div class="d-flex flex-column py-1">
            <span class="font-weight-medium">{{ item.fullName }}</span>
            <span class="text-caption text-medium-emphasis">{{ item.userName }}</span>
          </div>
        </template>

        <template #[`item.roles`]="{ item }">
          <div class="d-flex flex-wrap ga-1">
            <v-chip v-for="role in item.roles" :key="role" size="small" variant="tonal" color="primary">
              {{ role }}
            </v-chip>
          </div>
        </template>

        <template #[`item.isActive`]="{ item }">
          <AppStatusChip :config="USER_STATUS_CONFIG[item.isActive ? 'active' : 'inactive']" />
        </template>

        <template #[`item.lastLoginAt`]="{ item }">
          <span class="text-body-2">{{ item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleString('vi-VN') : '—' }}</span>
        </template>

        <template #[`item.actions`]="{ item }">
          <AppRowActions
            :actions="USER_LIST_ROW_ACTIONS"
            :item="item"
            @action="emit(USER_LIST_EMIT.ROW_ACTION, $event, item)"
          />
        </template>

        <template #empty>
          <AppEmptyState
            icon="mdi-account-off-outline"
            title="Chưa có người dùng"
            description="Tạo người dùng đầu tiên để bắt đầu quản lý."
          >
            <template #actions>
              <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(USER_LIST_EMIT.CREATE)">
                Tạo người dùng
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
        @update:page-number="emit(USER_LIST_EMIT.PAGE_CHANGE, $event)"
        @update:page-size="emit(USER_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { ActiveFilters, FilterField, SortState, StatusConfig } from '@/components/ui'
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
  USER_LIST_EMIT,
  USER_LIST_COLUMNS,
  USER_LIST_ROW_ACTIONS,
  type UserListEmits,
} from '@/modules/user/constants/user-list.constants'
import type { UserViewModel } from '@/modules/user/models/view-models/user.view-model'

defineProps<{
  items: UserViewModel[]
  loading: boolean
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItems: number
  activeFilters: ActiveFilters
  filterFields: FilterField[]
  sortBy: SortState | null
}>()

const emit = defineEmits<UserListEmits>()

const USER_STATUS_CONFIG: Record<'active' | 'inactive', StatusConfig> = {
  active: { label: 'Hoạt động', color: 'success', icon: 'mdi-check-circle-outline', variant: 'tonal' },
  inactive: { label: 'Ngừng', color: 'error', icon: 'mdi-close-circle-outline', variant: 'tonal' },
}
</script>
