<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader
            :title="detail ? `Doanh thu - ${detail.storeName}` : 'Doanh thu cửa hàng'"
            subtitle="Chi tiết doanh thu cửa hàng"
        >
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        {
                            title: 'Doanh thu',
                            to: `/${APP_ROUTES.ADMIN.BASE.PATH}/${APP_ROUTES.ADMIN.CHILDREN.REPORTS_STORE_REVENUE.PATH}`,
                        },
                        { title: detail?.storeName ?? '...', disabled: true },
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

        <v-card rounded="lg">
            <v-card-text class="d-flex flex-wrap ga-6">
                <div>
                    <div class="text-caption text-medium-emphasis">Cửa hàng</div>
                    <div>{{ detail?.storeName ?? '—' }}</div>
                </div>
                <div>
                    <div class="text-caption text-medium-emphasis">Mã cửa hàng</div>
                    <div>{{ detail?.storeCode ?? '—' }}</div>
                </div>
                <div>
                    <div class="text-caption text-medium-emphasis">Franchisee</div>
                    <div>{{ detail?.franchiseeName ?? '—' }}</div>
                </div>
                <div>
                    <div class="text-caption text-medium-emphasis">Brand</div>
                    <div>{{ detail?.brandName ?? '—' }}</div>
                </div>
            </v-card-text>
        </v-card>

        <v-card rounded="lg">
            <v-card-text class="d-flex flex-wrap align-center ga-4">
                <v-tabs v-model="granularity" color="primary" density="compact" @update:model-value="onFilterChange">
                    <v-tab v-for="option in GRANULARITY_TAB_OPTIONS" :key="option.value" :value="option.value" class="text-none">
                        {{ option.label }}
                    </v-tab>
                </v-tabs>

                <v-spacer />

                <v-text-field
                    v-model="fromDate"
                    label="Từ ngày"
                    type="date"
                    density="compact"
                    hide-details="auto"
                    style="min-width: 160px; max-width: 200px; flex: 0 0 auto"
                    @update:model-value="onFilterChange"
                />
                <v-text-field
                    v-model="toDate"
                    label="Đến ngày"
                    type="date"
                    density="compact"
                    hide-details="auto"
                    style="min-width: 160px; max-width: 200px; flex: 0 0 auto"
                    @update:model-value="onFilterChange"
                />
            </v-card-text>
        </v-card>

        <RevenueKpiCards :detail="detail" :loading="loading" />

        <v-row>
            <v-col cols="12" md="6">
                <v-card rounded="lg">
                    <v-card-title class="text-body-1 font-weight-bold">Xu hướng doanh thu</v-card-title>
                    <v-card-text style="height: 320px">
                        <RevenueTrendChart
                            :current-buckets="detail?.currentPeriodBuckets ?? []"
                            :previous-buckets="detail?.previousPeriodBuckets ?? []"
                        />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card rounded="lg">
                    <v-card-title class="text-body-1 font-weight-bold">Số đơn theo thời gian</v-card-title>
                    <v-card-text style="height: 320px">
                        <RevenueOrderChart :buckets="detail?.currentPeriodBuckets ?? []" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-card rounded="lg">
            <AppDataTable
                :items="bucketItems"
                :columns="STORE_REVENUE_BUCKET_COLUMNS"
                :loading="loading"
                item-key="bucketStart"
            >
                <template #[`item.bucketStart`]="{ item }">
                    {{ formatBucketLabel(item.bucketStart as string) }}
                </template>
                <template #[`item.revenue`]="{ item }">
                    {{ formatCurrency(item.revenue as number) }}
                </template>
                <template #[`item.averageOrderValue`]="{ item }">
                    {{ formatCurrency(item.averageOrderValue as number) }}
                </template>

                <template #empty>
                    <AppEmptyState
                        icon="mdi-chart-line"
                        title="Không có dữ liệu"
                        description="Không có dữ liệu doanh thu trong khoảng thời gian đã chọn."
                    />
                </template>
            </AppDataTable>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AppBreadcrumb, AppPageHeader, AppDataTable, AppEmptyState } from '@/components/ui'
import { APP_ROUTES } from '@/core/constants/_index'
import { useStoreRevenueDetail } from '@/modules/report/composables/useStoreRevenueDetail'
import {
    STORE_REVENUE_BUCKET_COLUMNS,
    GRANULARITY_TAB_OPTIONS,
} from '@/modules/report/constants/store-revenue-detail.constants'
import RevenueKpiCards from '@/modules/report/components/RevenueKpiCards.vue'
import RevenueTrendChart from '@/modules/report/components/RevenueTrendChart.vue'
import RevenueOrderChart from '@/modules/report/components/RevenueOrderChart.vue'
import type { RevenueBucketViewModel } from '@/modules/report/models/view-models/store-revenue.view-model'
import type { BucketGranularityDto } from '@/modules/report/models/dtos/store-revenue.dto'

// AppDataTable requires T extends Record<string, unknown>; RevenueBucketViewModel doesn't carry that index
// signature (it's a plain DTO-shaped model), so we widen it locally for table rendering only.
type BucketRow = RevenueBucketViewModel & Record<string, unknown>

const route = useRoute()
const { detail, loading, fetchDetail, exportDetail } = useStoreRevenueDetail()

const storeId = Number(route.params.storeId)

const granularity = ref<BucketGranularityDto>('Day')
const fromDate = ref('')
const toDate = ref('')

const bucketItems = computed<BucketRow[]>(() => (detail.value?.currentPeriodBuckets ?? []) as BucketRow[])

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

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function formatBucketLabel(bucketStart: string): string {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        new Date(bucketStart),
    )
}

async function loadDetail(): Promise<void> {
    await fetchDetail(
        storeId,
        `${fromDate.value}T00:00:00`,
        `${toDate.value}T23:59:59`,
        granularity.value,
    )
}

async function onFilterChange(): Promise<void> {
    await loadDetail()
}

async function onExport(format: 'excel' | 'csv'): Promise<void> {
    await exportDetail(
        storeId,
        `${fromDate.value}T00:00:00`,
        `${toDate.value}T23:59:59`,
        granularity.value,
        format,
    )
}

onMounted(async () => {
    const [from, to] = currentMonthDateKeys()
    fromDate.value = from
    toDate.value = to
    granularity.value = 'Day'
    await loadDetail()
})
</script>
