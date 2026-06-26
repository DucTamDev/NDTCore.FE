<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader title="Đơn hàng" subtitle="Theo dõi và xử lý đơn hàng">
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Đơn hàng', disabled: true },
                    ]"
                />
            </template>
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
                :columns="ORDER_LIST_COLUMNS"
                :loading="listPage.loading.value"
                :sort-by="listPage.sortBy.value"
                item-key="id"
                @update:sort-by="listPage.onSort"
                @row-click="onRowClick"
            >
                <template #[`item.status`]="{ item }">
                    <AppStatusChip :config="resolveOrderStatusConfig(item.status as string)" />
                </template>

                <template #[`item.totalAmount`]="{ item }">
                    {{ formatCurrency(item.totalAmount as number) }}
                </template>

                <template #[`item.createdAt`]="{ item }">
                    {{ formatDateTime(item.createdAt as string | null) }}
                </template>

                <template #empty>
                    <AppEmptyState
                        icon="mdi-clipboard-text-off-outline"
                        title="Không có đơn hàng"
                        description="Không tìm thấy đơn hàng phù hợp với điều kiện lọc."
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
    AppBreadcrumb,
    AppPageHeader,
    AppFilterBar,
    AppDataFilter,
    AppDataTable,
    AppPagination,
    AppStatusChip,
    AppEmptyState,
} from '@/components/ui'
import type { FilterOption } from '@/components/ui'
import { useListPage } from '@/components/ui/composables'
import type { ListPageParams } from '@/components/ui/composables'
import { APP_ROUTES, DEFAULT_PAGINATION, SYSTEM_ROLES } from '@/core/constants/_index'
import { useUserStore } from '@/modules/user/stores/user.store'
import { useOrder } from '@/modules/order/composables/useOrder'
import { useStore } from '@/modules/store/composables/useStore'
import { useBrand } from '@/modules/brand/composables/useBrand'
import {
    ORDER_LIST_COLUMNS,
    buildOrderFilterFields,
    resolveOrderStatusConfig,
} from '@/modules/order/constants/order-list.constants'
import type { OrderViewModel } from '@/modules/order/models/view-models/order.view-model'

const router = useRouter()
const userStore = useUserStore()
const { getPagedOrders } = useOrder()
const { getPagedStores } = useStore()
const { getPagedBrands } = useBrand()

// ── Role-based filter visibility ────────────────────────────────────────────
const userRoles = computed(() => userStore.profile?.Roles?.map((r) => r.Name) ?? [])
const BRAND_FILTER_ROLES: readonly string[] = [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN]
const canSeeBrandFilter = computed(() => userRoles.value.some((r) => BRAND_FILTER_ROLES.includes(r)))

// ── Filter options ─────────────────────────────────────────────────────────
const storeOptions = ref<FilterOption[]>([])
const brandOptions = ref<FilterOption[]>([])
const filterFields = computed(() =>
    buildOrderFilterFields(storeOptions.value, canSeeBrandFilter.value ? brandOptions.value : null),
)

// ── List page ───────────────────────────────────────────────────────────────
const fetchOrders = async (params: ListPageParams): Promise<{ items: OrderViewModel[]; total: number }> => {
    const dateRange = params.filters['dateRange'] as [string, string] | null
    const result = await getPagedOrders({
        PageNumber: params.pageNumber,
        PageSize: params.pageSize,
        StoreId: params.filters['storeId'] ? Number(params.filters['storeId']) : null,
        Status: (params.filters['status'] as string | null) ?? null,
        Channel: (params.filters['channel'] as string | null) ?? null,
        FromDate: dateRange?.[0] ? `${dateRange[0]}T00:00:00` : null,
        ToDate: dateRange?.[1] ? `${dateRange[1]}T23:59:59` : null,
        SortBy: params.sortBy?.key ?? null,
        SortDirection: params.sortBy?.order ?? null,
    })
    return { items: result.items, total: result.totalCount }
}

const listPage = useListPage<OrderViewModel>({
    fetchFn: fetchOrders,
    keyField: 'id',
    defaultPageSize: DEFAULT_PAGINATION.LIMIT,
})

const viewItems = computed<OrderViewModel[]>(() => listPage.items.value ?? [])

const onResetFilters = async () => {
    listPage.filters.resetFilters()
    applyTodayDefault()
    listPage.pagination.reset()
    await listPage.refresh()
}

watch(
    () => listPage.filters.activeFilters.value['brandId'],
    async (brandId) => {
        listPage.filters.setFilter('storeId', null)
        const result = await getPagedStores({
            PageNumber: 1,
            PageSize: 200,
            BrandId: brandId ? Number(brandId) : null,
        })
        storeOptions.value = result.items.map((s) => ({ label: s.name, value: s.id }))
    },
)

function applyTodayDefault(): void {
    const today = new Date().toISOString().slice(0, 10)
    listPage.filters.setFilter('dateRange', [today, today])
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function formatDateTime(value: string | null | undefined): string {
    if (!value) return '—'
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
}

function onRowClick(item: OrderViewModel): void {
    void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.ORDER_DETAIL.NAME, params: { id: item.id } })
}

onMounted(async () => {
    const storesResult = await getPagedStores({ PageNumber: 1, PageSize: 200 })
    storeOptions.value = storesResult.items.map((s) => ({ label: s.name, value: s.id }))

    if (canSeeBrandFilter.value) {
        const brandsResult = await getPagedBrands({ PageNumber: 1, PageSize: 200 })
        brandOptions.value = brandsResult.items.map((b) => ({ label: b.name, value: b.id }))
    }

    applyTodayDefault()
    await listPage.refresh()
})
</script>
