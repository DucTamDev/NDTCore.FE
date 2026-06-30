<template>
    <v-row>
        <v-col v-for="card in cards" :key="card.label" cols="12" sm="6" md="3">
            <v-card rounded="lg" variant="flat" class="border">
                <v-card-text v-if="loading">
                    <v-skeleton-loader type="text" width="60%" />
                    <v-skeleton-loader type="heading" class="mt-2" />
                </v-card-text>

                <v-card-text v-else>
                    <div class="text-caption text-medium-emphasis">{{ card.label }}</div>
                    <div class="d-flex align-center ga-2 mt-1">
                        <v-icon v-if="card.icon" :icon="card.icon" :color="card.color" size="20" />
                        <span class="text-h5 font-weight-medium" :class="card.color ? `text-${card.color}` : undefined">{{ card.value }}</span>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StoreRevenueDetailViewModel } from '@/modules/report/models/view-models/store-revenue.view-model'

interface Props {
    detail: StoreRevenueDetailViewModel | null
    loading: boolean
}

interface KpiCard {
    label: string
    value: string
    icon?: string
    color?: 'success' | 'error'
}

const props = defineProps<Props>()

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function formatGrowth(growthPercent: number | null): { value: string; icon?: string; color?: 'success' | 'error' } {
    if (growthPercent === null) {
        return { value: '—' }
    }
    if (growthPercent > 0) {
        return { value: `+${growthPercent.toFixed(1)}%`, icon: 'mdi-arrow-up', color: 'success' }
    }
    if (growthPercent < 0) {
        return { value: `−${Math.abs(growthPercent).toFixed(1)}%`, icon: 'mdi-arrow-down', color: 'error' }
    }
    return { value: `${growthPercent.toFixed(1)}%` }
}

const cards = computed<KpiCard[]>(() => {
    const growth = formatGrowth(props.detail?.growthPercent ?? null)
    return [
        { label: 'Tổng doanh thu', value: formatCurrency(props.detail?.totalRevenue ?? 0) },
        { label: 'Tổng số đơn', value: String(props.detail?.totalOrderCount ?? 0) },
        { label: 'Giá trị TB/đơn (AOV)', value: formatCurrency(props.detail?.averageOrderValue ?? 0) },
        { label: 'Tăng trưởng', value: growth.value, icon: growth.icon, color: growth.color },
    ]
})
</script>
