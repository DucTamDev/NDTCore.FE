<!-- NDTCore.FE/src/modules/order/views/OrderDetailView.vue -->
<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader :title="order ? `Đơn hàng ${order.orderNumber}` : 'Chi tiết đơn hàng'" subtitle="Chi tiết đơn hàng">
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Đơn hàng', to: `/${APP_ROUTES.ADMIN.BASE.PATH}/${APP_ROUTES.ADMIN.CHILDREN.ORDERS.PATH}` },
                        { title: order?.orderNumber ?? '...', disabled: true },
                    ]"
                />
            </template>

            <v-btn v-if="canConfirm" color="primary" prepend-icon="mdi-check" :loading="actionLoading" @click="onConfirm">
                Xác nhận
            </v-btn>
            <v-btn v-if="canComplete" color="success" prepend-icon="mdi-check-all" :loading="actionLoading" @click="onComplete">
                Hoàn thành
            </v-btn>
            <v-btn v-if="canCancel" color="error" variant="outlined" prepend-icon="mdi-close" :loading="actionLoading" @click="isCancelDialogOpen = true">
                Huỷ đơn
            </v-btn>
        </AppPageHeader>

        <v-skeleton-loader v-if="loading" type="card" />

        <template v-else-if="order">
            <v-card rounded="lg">
                <v-card-text class="d-flex flex-wrap ga-6">
                    <div>
                        <div class="text-caption text-medium-emphasis">Trạng thái</div>
                        <AppStatusChip :config="resolveOrderStatusConfig(order.status)" />
                    </div>
                    <div>
                        <div class="text-caption text-medium-emphasis">Kênh</div>
                        <div>{{ order.channel ?? '—' }}</div>
                    </div>
                    <div>
                        <div class="text-caption text-medium-emphasis">Loại phục vụ</div>
                        <div>{{ order.serviceType }}</div>
                    </div>
                    <div>
                        <div class="text-caption text-medium-emphasis">Khách hàng</div>
                        <div>{{ order.customerName ?? '—' }} {{ order.customerPhone ? `(${order.customerPhone})` : '' }}</div>
                    </div>
                    <div>
                        <div class="text-caption text-medium-emphasis">Thời gian tạo</div>
                        <div>{{ formatDateTime(order.createdAt) }}</div>
                    </div>
                    <div v-if="order.cancelledReason">
                        <div class="text-caption text-medium-emphasis">Lý do huỷ</div>
                        <div>{{ order.cancelledReason }}</div>
                    </div>
                </v-card-text>
            </v-card>

            <v-card rounded="lg">
                <v-table>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th class="text-end">SL</th>
                            <th class="text-end">Đơn giá</th>
                            <th class="text-end">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in order.items" :key="item.id">
                            <td>
                                <div class="font-weight-medium">{{ item.productName }}</div>
                                <div v-if="item.options.length" class="text-caption text-medium-emphasis">
                                    {{ item.options.map((o) => o.optionName).join(', ') }}
                                </div>
                                <div v-if="item.note" class="text-caption text-medium-emphasis">Note: {{ item.note }}</div>
                            </td>
                            <td class="text-end">{{ item.quantity }}</td>
                            <td class="text-end">{{ formatCurrency(item.salePrice) }}</td>
                            <td class="text-end">{{ formatCurrency(item.lineNetAmount) }}</td>
                        </tr>
                    </tbody>
                </v-table>

                <v-divider />

                <v-card-text class="d-flex flex-column ga-1 align-end">
                    <div>Tạm tính: {{ formatCurrency(order.subtotal) }}</div>
                    <div v-if="order.discountAmount > 0">Giảm giá: -{{ formatCurrency(order.discountAmount) }}</div>
                    <div v-if="order.deliveryFee > 0">Phí giao hàng: {{ formatCurrency(order.deliveryFee) }}</div>
                    <div class="text-h6 font-weight-bold">Tổng cộng: {{ formatCurrency(order.totalAmount) }}</div>
                </v-card-text>
            </v-card>
        </template>

        <AppEmptyState
            v-else
            icon="mdi-alert-circle-outline"
            title="Không tìm thấy đơn hàng"
            description="Đơn hàng không tồn tại hoặc bạn không có quyền xem."
        />

        <AppDialog
            v-model="isCancelDialogOpen"
            title="Huỷ đơn hàng"
            size="sm"
            confirm-label="Huỷ đơn"
            cancel-label="Đóng"
            :loading="actionLoading"
            @confirm="onCancelConfirm"
        >
            <v-textarea
                v-model="cancelledReason"
                label="Lý do huỷ (tuỳ chọn)"
                rows="3"
                density="compact"
                hide-details="auto"
            />
        </AppDialog>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AppBreadcrumb, AppPageHeader, AppStatusChip, AppEmptyState, AppDialog } from '@/components/ui'
import { APP_ROUTES } from '@/core/constants/_index'
import { useOrder } from '@/modules/order/composables/useOrder'
import { ORDER_STATUS, resolveOrderStatusConfig } from '@/modules/order/constants/order-list.constants'
import type { OrderViewModel } from '@/modules/order/models/view-models/order.view-model'

const route = useRoute()
const { getOrder, updateOrderStatus, cancelOrder } = useOrder()

const orderId = Number(route.params.id)

const order = ref<OrderViewModel | null>(null)
const loading = ref(true)
const actionLoading = ref(false)
const isCancelDialogOpen = ref(false)
const cancelledReason = ref('')

const canConfirm = computed(() => order.value?.status === ORDER_STATUS.PENDING)
const canComplete = computed(() => order.value?.status === ORDER_STATUS.CONFIRMED)
const canCancel = computed(
    () => order.value?.status === ORDER_STATUS.PENDING || order.value?.status === ORDER_STATUS.CONFIRMED,
)

async function loadOrder(): Promise<void> {
    loading.value = true
    try {
        order.value = await getOrder(orderId)
    } finally {
        loading.value = false
    }
}

async function onConfirm(): Promise<void> {
    actionLoading.value = true
    try {
        await updateOrderStatus(orderId, { Status: ORDER_STATUS.CONFIRMED })
        await loadOrder()
    } finally {
        actionLoading.value = false
    }
}

async function onComplete(): Promise<void> {
    actionLoading.value = true
    try {
        await updateOrderStatus(orderId, { Status: ORDER_STATUS.COMPLETED })
        await loadOrder()
    } finally {
        actionLoading.value = false
    }
}

async function onCancelConfirm(): Promise<void> {
    actionLoading.value = true
    try {
        await cancelOrder(orderId, { CancelledReason: cancelledReason.value || null })
        isCancelDialogOpen.value = false
        cancelledReason.value = ''
        await loadOrder()
    } finally {
        actionLoading.value = false
    }
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function formatDateTime(value: string | null | undefined): string {
    if (!value) return '—'
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
}

onMounted(loadOrder)
</script>
