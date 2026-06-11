<template>
  <div class="d-flex flex-column h-100 bg-surface">
    <!-- Alerts -->
    <v-alert
      v-if="!shiftStore.isAcceptingOrders"
      type="warning"
      variant="tonal"
      density="compact"
      class="ma-2 mb-0"
      rounded="lg"
    >
      Cửa hàng không nhận đơn
    </v-alert>
    <v-alert
      v-else-if="!shiftStore.hasOpenShift"
      type="warning"
      variant="tonal"
      density="compact"
      class="ma-2 mb-0"
      rounded="lg"
    >
      Chưa mở ca làm việc
    </v-alert>

    <!-- Customer info -->
    <div class="pa-3 d-flex flex-column ga-2">
      <v-text-field
        v-model="cartStore.customerName"
        label="Tên khách hàng"
        density="compact"
        variant="outlined"
        hide-details
        clearable
      />
      <v-text-field
        v-model="cartStore.customerPhone"
        label="Số điện thoại"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        type="tel"
      />
    </div>

    <v-divider />

    <!-- Cart items -->
    <div v-if="cartStore.items.length === 0" class="d-flex flex-column align-center justify-center ga-2 flex-grow-1 text-medium-emphasis">
      <v-icon icon="mdi-cart-outline" size="48" />
      <span class="text-body-2">Chưa có món nào</span>
    </div>

    <div v-else class="overflow-y-auto flex-grow-1 px-3">
      <template v-for="(item, idx) in cartStore.items" :key="item.uid">
        <v-divider v-if="idx > 0" class="my-1" />
        <PosOrderItem :item="item" />
      </template>
    </div>

    <v-divider />

    <!-- Order note -->
    <div class="pa-3 pb-2">
      <v-textarea
        v-model="cartStore.orderNote"
        label="Ghi chú đơn hàng"
        density="compact"
        variant="outlined"
        hide-details
        rows="1"
        auto-grow
      />
    </div>

    <!-- Totals -->
    <div class="px-3 pb-2 d-flex justify-space-between align-center">
      <span class="text-body-2 text-medium-emphasis">{{ cartStore.itemCount }} món</span>
      <span class="text-subtitle-1 font-weight-semibold">
        {{ cartStore.totalAmount.toLocaleString('vi-VN') }}₫
      </span>
    </div>

    <!-- Actions -->
    <div class="pa-3 pt-1 d-flex ga-2">
      <v-btn
        variant="tonal"
        icon="mdi-history"
        size="small"
        :title="'Lịch sử đơn'"
        @click="$emit('openHistory')"
      />
      <v-btn
        variant="tonal"
        icon="mdi-delete-sweep-outline"
        size="small"
        color="error"
        :disabled="cartStore.items.length === 0"
        :title="'Xoá tất cả'"
        @click="confirmClear"
      />
      <v-btn
        color="primary"
        variant="flat"
        class="flex-grow-1"
        :disabled="!canSubmit"
        :loading="submitting"
        @click="confirmSubmit"
      >
        Tạo đơn
      </v-btn>
    </div>

    <!-- Confirm dialog -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title>{{ confirmTitle }}</v-card-title>
        <v-card-text>{{ confirmMessage }}</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="confirmDialog = false">Huỷ</v-btn>
          <v-btn :color="confirmColor" variant="flat" @click="runConfirmed">Xác nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success overlay -->
    <v-dialog v-model="successDialog" max-width="380">
      <v-card rounded="lg" class="text-center pa-6">
        <v-icon icon="mdi-check-circle" color="success" size="64" />
        <v-card-title class="justify-center">Đặt hàng thành công!</v-card-title>
        <v-card-text>
          <div class="text-h6 font-weight-semibold text-primary">#{{ lastOrderNumber }}</div>
          <div class="text-body-2 text-medium-emphasis mt-1">{{ lastOrderStatus }}</div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" variant="flat" @click="successDialog = false">Đơn mới</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePosCartStore } from '../stores/pos-cart.store'
import { usePosShiftStore } from '../stores/pos-shift.store'
import { posService } from '../services/pos.service'
import PosOrderItem from './PosOrderItem.vue'

const props = defineProps<{ storeId: number }>()
const emit  = defineEmits<{ openHistory: [] }>()

const cartStore  = usePosCartStore()
const shiftStore = usePosShiftStore()

const submitting     = ref(false)
const confirmDialog  = ref(false)
const confirmTitle   = ref('')
const confirmMessage = ref('')
const confirmColor   = ref<'primary' | 'error'>('primary')
const pendingAction  = ref<(() => void) | null>(null)

const successDialog    = ref(false)
const lastOrderNumber  = ref('')
const lastOrderStatus  = ref('')

const canSubmit = computed(
    () => shiftStore.canCreateOrder && cartStore.items.length > 0 && !submitting.value,
)

function openConfirm(title: string, message: string, color: 'primary' | 'error', action: () => void): void {
    confirmTitle.value   = title
    confirmMessage.value = message
    confirmColor.value   = color
    pendingAction.value  = action
    confirmDialog.value  = true
}

function runConfirmed(): void {
    confirmDialog.value = false
    pendingAction.value?.()
    pendingAction.value = null
}

function confirmClear(): void {
    openConfirm(
        'Xoá đơn hàng',
        'Tất cả món trong giỏ sẽ bị xoá. Tiếp tục?',
        'error',
        () => cartStore.clearCart(),
    )
}

function confirmSubmit(): void {
    openConfirm(
        'Xác nhận đặt hàng',
        `Tổng cộng ${cartStore.itemCount} món — ${cartStore.totalAmount.toLocaleString('vi-VN')}₫. Tạo đơn?`,
        'primary',
        submitOrder,
    )
}

async function submitOrder(): Promise<void> {
    const shiftId = shiftStore.shiftId
    if (!shiftId) return
    submitting.value = true
    try {
        const payload = {
            StoreId:       props.storeId,
            ShiftId:       shiftId,
            CustomerName:  cartStore.customerName || null,
            CustomerPhone: cartStore.customerPhone || null,
            Note:          cartStore.orderNote || null,
            Items:         cartStore.items.map((i) => ({
                ProductId:         i.productId,
                Quantity:          i.quantity,
                Note:              i.note || null,
                SelectedOptionIds: i.selectedOptions.map((o) => o.optionId),
            })),
        }
        const result = await posService.createOrderAsync(payload)
        if (result) {
            lastOrderNumber.value = result.OrderNumber
            lastOrderStatus.value = result.Status
            cartStore.clearCart()
            successDialog.value = true
        }
    } finally {
        submitting.value = false
    }
}
</script>
