<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader title="Báo cáo doanh thu theo cửa hàng" subtitle="Theo dõi doanh thu các cửa hàng">
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Doanh thu', disabled: true },
                    ]"
                />
            </template>

            <v-btn variant="outlined" prepend-icon="mdi-file-excel-outline" @click="onExport('excel')">
                Xuất Excel
            </v-btn>
            <v-btn variant="outlined" prepend-icon="mdi-file-delimited-outline" @click="onExport('csv')">
                Xuất CSV
            </v-btn>
        </AppPageHeader>

        <AppFilterBar>
            <AppDataFilter
                :fields="filterFields"
                :model-value="listPage.filters.activeFilters.value"
                @update:model-value="listPage.filters.setFilters"
                @search="listPage.onSearch"
            />

            <template #actions>
                <v-btn variant="text" prepend-icon="mdi-filter-off-outline" @click="onResetFilters">
                    Xóa lọc
                </v-btn>
                <v-btn color="primary" prepend-icon="mdi-magnify" @click="listPage.onSearch">
                    Tìm kiếm
                </v-btn>
            </template>
        </AppFilterBar>

        <v-card rounded="lg">
            <AppDataTable
                :items="viewItems"
                :columns="STORE_REVENUE_LIST_COLUMNS"
                :loading="listPage.loading.value"
                :sort-by="listPage.sortBy.value"
                item-key="storeId"
                @update:sort-by="listPage.onSort"
            >
                <template #[`item.revenue`]="{ item }">
                    {{ formatCurrency(item.revenue as number) }}
                </template>

                <template #[`item.actions`]="{ item }">
                    <AppRowActions
                        :actions="STORE_REVENUE_LIST_ROW_ACTIONS"
                        :item="item"
                        @action="onRowAction"
                    />
                </template>

                <template #empty>
                    <AppEmptyState
                        icon="mdi-store-off-outline"
                        title="Không có dữ liệu"
                        description="Không tìm thấy cửa hàng phù hợp với điều kiện lọc."
                    />
                </template>
            </AppDataTable>

            <v-divider />

            <AppPagination
                :page-number="listPage.pagination.pageNumber.value"
                :page-size="listPage.pagination.pageSize.value"
                :total-pages="listPage.pagination.totalPages.value"
                :total-items="listPage.pagination.totalItems.value"
                @update:page-number="listPage.onPageChange"
                @update:page-size="listPage.onPageSizeChange"
            />
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
    AppBreadcrumb,
    AppPageHeader,
    AppFilterBar,
    AppDataFilter,
    AppDataTable,
    AppPagination,
    AppRowActions,
    AppEmptyState,
} from '@/components/ui'
import { useListPage } from '@/components/ui/composables'
import type { ListPageParams } from '@/components/ui/composables'
import { APP_ROUTES, DEFAULT_PAGINATION } from '@/core/constants/_index'
import { useStoreRevenueList } from '@/modules/report/composables/useStoreRevenueList'
import {
    STORE_REVENUE_LIST_COLUMNS,
    STORE_REVENUE_LIST_ROW_ACTIONS,
    STORE_REVENUE_ROW_ACTION,
    buildStoreRevenueFilterFields,
} from '@/modules/report/constants/store-revenue-list.constants'
import type { StoreRevenueListItemViewModel } from '@/modules/report/models/view-models/store-revenue.view-model'

const router = useRouter()
const { getPagedStoreRevenue, exportStoreRevenueList } = useStoreRevenueList()

const filterFields = buildStoreRevenueFilterFields()

// Scope is resolved entirely server-side for this endpoint, so no requiresStoreScope workaround is needed here.
const fetchStoreRevenue = async (
    params: ListPageParams,
): Promise<{ items: StoreRevenueListItemViewModel[]; total: number }> => {
    const dateRange = params.filters['dateRange'] as [string, string] | null
    const result = await getPagedStoreRevenue({
        PageNumber: params.pageNumber,
        PageSize: params.pageSize,
        From: dateRange?.[0] ? `${dateRange[0]}T00:00:00` : defaultDateRange().from,
        To: dateRange?.[1] ? `${dateRange[1]}T23:59:59` : defaultDateRange().to,
        Keyword: (params.filters['keyword'] as string | null) ?? null,
        SortBy: params.sortBy?.key ?? null,
        SortDirection: params.sortBy?.order ?? null,
    })
    return { items: result.items, total: result.totalCount }
}

const listPage = useListPage<StoreRevenueListItemViewModel>({
    fetchFn: fetchStoreRevenue,
    keyField: 'storeId',
    defaultPageSize: DEFAULT_PAGINATION.LIMIT,
})

const viewItems = computed<StoreRevenueListItemViewModel[]>(() => listPage.items.value ?? [])

const onResetFilters = async () => {
    listPage.filters.resetFilters()
    applyCurrentMonthDefault()
    listPage.pagination.reset()
    await listPage.refresh()
}

function toDateKey(date: Date): string {
    return date.toISOString().slice(0, 10)
}

// new Date(year, month + 1, 0) rolls back to the last day of `month` — avoids an off-by-one.
function currentMonthDateKeys(): [string, string] {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return [toDateKey(firstDay), toDateKey(lastDay)]
}

function defaultDateRange(): { from: string; to: string } {
    const [from, to] = currentMonthDateKeys()
    return { from: `${from}T00:00:00`, to: `${to}T23:59:59` }
}

function applyCurrentMonthDefault(): void {
    listPage.filters.setFilter('dateRange', currentMonthDateKeys())
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function onRowAction(actionKey: string, item: StoreRevenueListItemViewModel): void {
    if (actionKey === STORE_REVENUE_ROW_ACTION.VIEW) {
        void router.push({
            name: APP_ROUTES.ADMIN.CHILDREN.REPORTS_STORE_REVENUE_DETAIL.NAME,
            params: { storeId: item.storeId },
        })
    }
}

async function onExport(format: 'excel' | 'csv'): Promise<void> {
    const dateRange = listPage.filters.activeFilters.value['dateRange'] as [string, string] | null
    await exportStoreRevenueList({
        PageNumber: listPage.pagination.pageNumber.value,
        PageSize: listPage.pagination.pageSize.value,
        From: dateRange?.[0] ? `${dateRange[0]}T00:00:00` : defaultDateRange().from,
        To: dateRange?.[1] ? `${dateRange[1]}T23:59:59` : defaultDateRange().to,
        Keyword: (listPage.filters.activeFilters.value['keyword'] as string | null) ?? null,
        SortBy: listPage.sortBy.value?.key ?? null,
        SortDirection: listPage.sortBy.value?.order ?? null,
        format,
    })
}

onMounted(async () => {
    applyCurrentMonthDefault()
    await listPage.refresh()
})
</script>
