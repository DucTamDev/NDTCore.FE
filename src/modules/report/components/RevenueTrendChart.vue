<template>
    <Line :data="chartData" :options="chartOptions" />
</template>

<script lang="ts">
import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import type { RevenueBucketViewModel } from '@/modules/report/models/view-models/store-revenue.view-model'

interface Props {
    currentBuckets: RevenueBucketViewModel[]
    previousBuckets: RevenueBucketViewModel[]
}

const props = defineProps<Props>()

function formatBucketLabel(bucketStart: string): string {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(bucketStart))
}

const chartData = computed<ChartData<'line'>>(() => ({
    labels: props.currentBuckets.map((b) => formatBucketLabel(b.bucketStart)),
    datasets: [
        {
            label: 'Kỳ này',
            data: props.currentBuckets.map((b) => b.revenue),
            borderColor: '#1867C0',
            backgroundColor: '#1867C0',
            tension: 0.3,
        },
        {
            label: 'Kỳ trước',
            data: props.previousBuckets.map((b) => b.revenue),
            borderColor: '#9E9E9E',
            backgroundColor: '#9E9E9E',
            tension: 0.3,
        },
    ],
}))

const chartOptions: ChartOptions<'line'> = {
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
