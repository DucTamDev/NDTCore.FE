<template>
    <Bar :data="chartData" :options="chartOptions" />
</template>

<script lang="ts">
import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js'

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend)
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme as useVuetifyTheme } from 'vuetify'
import { Bar } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import type { RevenueBucketViewModel } from '@/modules/report/models/view-models/store-revenue.view-model'

interface Props {
    buckets: RevenueBucketViewModel[]
}

const props = defineProps<Props>()

const vuetifyTheme = useVuetifyTheme()
const barColor = computed(() => vuetifyTheme.current.value.colors.primary)

function formatBucketLabel(bucketStart: string): string {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(bucketStart))
}

const chartData = computed<ChartData<'bar'>>(() => ({
    labels: props.buckets.map((b) => formatBucketLabel(b.bucketStart)),
    datasets: [
        {
            label: 'Số đơn',
            data: props.buckets.map((b) => b.orderCount),
            backgroundColor: barColor.value,
        },
    ],
}))

const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top' },
    },
    scales: {
        y: { beginAtZero: true },
    },
}
</script>
