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
        </AppPageHeader>

        <v-card rounded="lg">
            <v-card-text class="d-flex flex-wrap justify-space-between ga-6">
                <div class="d-flex flex-wrap ga-6">
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
                </div>
                <div class="text-body-2 text-medium-emphasis align-self-end">
                    {{ fromDate && toDate ? `${formatBucketLabel(fromDate)} – ${formatBucketLabel(toDate)}` : '—' }}
                </div>
            </v-card-text>
        </v-card>

        <v-card rounded="lg">
            <v-card-text class="d-flex flex-wrap align-center ga-4 border-b">
                <v-btn-toggle
                    :model-value="datePreset"
                    mandatory
                    density="compact"
                    color="primary"
                    @update:model-value="onPresetToggle"
                >
                    <v-btn
                        v-for="option in DATE_PRESET_OPTIONS.filter((o) => o.value !== 'custom')"
                        :key="option.value"
                        :value="option.value"
                        class="text-none"
                    >
                        {{ option.label }}
                    </v-btn>
                    <v-btn value="custom" class="text-none">
                        {{ customRangeLabel || 'Tùy chỉnh' }}
                        <v-menu
                            v-model="isCustomMenuOpen"
                            activator="parent"
                            location="bottom end"
                            :close-on-content-click="false"
                            @update:model-value="onCustomMenuToggle"
                        >
                            <v-card min-width="280">
                                <v-card-text class="d-flex flex-column ga-3">
                                    <div class="text-caption font-weight-medium">Chọn khoảng thời gian</div>
                                    <v-text-field
                                        v-model="draftFromDate"
                                        label="Từ ngày"
                                        type="date"
                                        :max="maxDate"
                                        density="compact"
                                        hide-details="auto"
                                    />
                                    <v-text-field
                                        v-model="draftToDate"
                                        label="Đến ngày"
                                        type="date"
                                        :max="maxDate"
                                        density="compact"
                                        hide-details="auto"
                                    />
                                    <div class="text-caption text-error" style="min-height: 20px">
                                        {{ customRangeError }}
                                    </div>
                                    <div class="d-flex justify-end ga-2">
                                        <v-btn variant="text" @click="cancelCustomRange">Hủy</v-btn>
                                        <v-btn variant="flat" color="primary" @click="applyCustomRange">Áp dụng</v-btn>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-menu>
                    </v-btn>
                </v-btn-toggle>

                <v-spacer />

                <v-tabs v-model="granularity" color="primary" density="compact" @update:model-value="onFilterChange">
                    <v-tab v-for="option in GRANULARITY_TAB_OPTIONS" :key="option.value" :value="option.value" class="text-none">
                        {{ option.label }}
                    </v-tab>
                </v-tabs>
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
            <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2">
                <span class="text-body-1 font-weight-bold">Bảng chi tiết</span>
                <div class="d-flex ga-2">
                    <v-btn
                        variant="outlined"
                        prepend-icon="mdi-file-excel-outline"
                        :loading="exporting"
                        @click="onExport('excel')"
                    >
                        Xuất Excel
                    </v-btn>
                    <v-btn
                        variant="outlined"
                        prepend-icon="mdi-file-delimited-outline"
                        :loading="exporting"
                        @click="onExport('csv')"
                    >
                        Xuất CSV
                    </v-btn>
                </div>
            </v-card-title>
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
import { downloadBlob } from '@/core/utils/download.util'
import { useStoreRevenueDetail } from '@/modules/report/composables/useStoreRevenueDetail'
import {
    STORE_REVENUE_BUCKET_COLUMNS,
    GRANULARITY_TAB_OPTIONS,
    DATE_PRESET_OPTIONS,
    type DatePreset,
} from '@/modules/report/constants/store-revenue-detail.constants'
import RevenueKpiCards from '@/modules/report/components/RevenueKpiCards.vue'
import RevenueTrendChart from '@/modules/report/components/RevenueTrendChart.vue'
import RevenueOrderChart from '@/modules/report/components/RevenueOrderChart.vue'
import type { RevenueBucketViewModel } from '@/modules/report/models/view-models/store-revenue.view-model'
import type { BucketGranularityDto } from '@/modules/report/models/dtos/store-revenue.dto'
import {
    toDateKey,
    currentMonthDateKeys,
    todayKey,
    yesterdayKey,
    last7DaysKeys,
    last30DaysKeys,
    toRangeStart,
    toRangeEnd,
} from '@/modules/report/utils/date-range.util'

const route = useRoute()
const { detail, loading, fetchDetail, exportDetail } = useStoreRevenueDetail()

const storeId = Number(route.params.storeId)

const granularity = ref<BucketGranularityDto>('Day')
const fromDate = ref('')
const toDate = ref('')

const datePreset = ref<DatePreset>('thisMonth')
const isCustomMenuOpen = ref(false)
const draftFromDate = ref('')
const draftToDate = ref('')
const customRangeError = ref('')
const customRangeLabel = ref('')

const maxDate = computed(() => todayKey())

const bucketItems = computed<RevenueBucketViewModel[]>(() => detail.value?.currentPeriodBuckets ?? [])

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function formatBucketLabel(bucketStart: string): string {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        new Date(bucketStart),
    )
}

function applyPreset(preset: DatePreset): void {
    if (preset === 'today') {
        const key = todayKey()
        fromDate.value = key
        toDate.value = key
    } else if (preset === 'yesterday') {
        const key = yesterdayKey()
        fromDate.value = key
        toDate.value = key
    } else if (preset === 'last7') {
        const [from, to] = last7DaysKeys()
        fromDate.value = from
        toDate.value = to
    } else if (preset === 'last30') {
        const [from, to] = last30DaysKeys()
        fromDate.value = from
        toDate.value = to
    } else if (preset === 'thisMonth') {
        const [from, to] = currentMonthDateKeys()
        fromDate.value = from
        toDate.value = to
    }
    datePreset.value = preset
}

async function onPresetToggle(preset: DatePreset | null): Promise<void> {
    if (preset === null || preset === 'custom') return
    applyPreset(preset)
    await onFilterChange()
}

function onCustomMenuToggle(isOpen: boolean): void {
    if (isOpen) {
        draftFromDate.value = fromDate.value
        draftToDate.value = toDate.value
        customRangeError.value = ''
    }
}

function cancelCustomRange(): void {
    isCustomMenuOpen.value = false
}

async function applyCustomRange(): Promise<void> {
    if (draftFromDate.value > draftToDate.value) {
        customRangeError.value = 'Từ ngày phải nhỏ hơn hoặc bằng đến ngày.'
        return
    }
    customRangeError.value = ''
    fromDate.value = draftFromDate.value
    toDate.value = draftToDate.value
    datePreset.value = 'custom'
    customRangeLabel.value = `${formatBucketLabel(fromDate.value)} – ${formatBucketLabel(toDate.value)}`
    isCustomMenuOpen.value = false
    await onFilterChange()
}

async function loadDetail(): Promise<void> {
    await fetchDetail(
        storeId,
        toRangeStart(fromDate.value),
        toRangeEnd(toDate.value),
        granularity.value,
    )
}

async function onFilterChange(): Promise<void> {
    await loadDetail()
}

const exporting = ref(false)

async function onExport(format: 'excel' | 'csv'): Promise<void> {
    exporting.value = true
    try {
        const blob = await exportDetail(
            storeId,
            toRangeStart(fromDate.value),
            toRangeEnd(toDate.value),
            granularity.value,
            format,
        )
        const today = toDateKey(new Date())
        const extension = format === 'excel' ? 'xlsx' : 'csv'
        const storeCode = detail.value?.storeCode ?? storeId
        downloadBlob(blob, `chi-tiet-doanh-thu-${storeCode}-${today}.${extension}`)
    } finally {
        exporting.value = false
    }
}

onMounted(async () => {
    const [from, to] = currentMonthDateKeys()
    fromDate.value = from
    toDate.value = to
    granularity.value = 'Day'
    await loadDetail()
})
</script>
