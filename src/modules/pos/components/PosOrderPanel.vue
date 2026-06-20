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

    <!-- ───────────────────────── Header zone ───────────────────────── -->
    <div class="panel-header">
      <div class="pa-3 pb-2">
        <div v-if="!showCustomerForm" class="d-flex align-center justify-space-between">
          <span class="text-body-2">Khách lẻ</span>
          <v-btn variant="text" size="small" color="primary" class="text-none" @click="showCustomerForm = true">
            + Thêm khách
          </v-btn>
        </div>
        <div v-else class="d-flex flex-column ga-2">
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
      </div>

      <v-divider />

      <div class="px-3 py-2">
        <span class="text-caption text-medium-emphasis">Loại đơn</span>
        <v-btn-toggle
          v-model="cartStore.serviceType"
          mandatory
          divided
          rounded="lg"
          density="comfortable"
          class="w-100 mt-1 bg-surface-light"
        >
          <v-btn
            v-for="opt in POS_SERVICE_TYPE_OPTIONS"
            :key="opt.value"
            :value="opt.value"
            :color="cartStore.serviceType === opt.value ? 'primary' : undefined"
            :variant="cartStore.serviceType === opt.value ? 'flat' : 'text'"
            class="text-none"
            style="flex: 1 1 0%; min-width: 0"
            :prepend-icon="opt.icon"
          >
            {{ opt.label }}
          </v-btn>
        </v-btn-toggle>
      </div>

      <div v-if="cartStore.serviceType === ServiceType.Delivery" class="px-3 pb-2 d-flex flex-column ga-2">
        <v-text-field
          v-model="cartStore.deliveryAddress"
          label="Địa chỉ giao hàng"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          maxlength="300"
        />
        <v-text-field
          v-model.number="cartStore.deliveryFee"
          label="Phí giao hàng"
          type="number"
          density="compact"
          variant="outlined"
          hide-details
          suffix="₫"
        />
      </div>

      <v-divider />
    </div>

    <!-- ───────────────────────── Cart zone ───────────────────────── -->
    <div class="panel-cart px-3">
      <div
        v-if="cartStore.items.length === 0"
        class="d-flex flex-column align-center justify-center ga-2 h-100 text-medium-emphasis"
      >
        <v-icon icon="mdi-cart-outline" size="48" />
        <span class="text-body-2">Chưa có món nào</span>
      </div>
      <template v-else>
        <template v-for="(item, idx) in cartStore.items" :key="item.uid">
          <v-divider v-if="idx > 0" class="my-1" />
          <PosOrderItem :item="item" @edit="handleEditItem" />
        </template>

        <v-textarea
          v-model="cartStore.orderNote"
          label="Ghi chú đơn hàng"
          density="compact"
          variant="outlined"
          hide-details
          rows="1"
          auto-grow
          class="mt-3 mb-3"
        />
      </template>
    </div>

    <!-- ───────────────────────── Checkout zone ───────────────────────── -->
    <div class="panel-checkout pa-3 d-flex flex-column ga-3">
      <div v-if="cartStore.serviceType === ServiceType.Delivery" class="d-flex flex-column ga-1">
        <div class="d-flex justify-space-between text-body-2 text-medium-emphasis">
          <span>Tiền món</span>
          <span>{{ cartStore.subtotalAmount.toLocaleString('vi-VN') }}₫</span>
        </div>
        <div
          v-if="cartStore.deliveryFee > 0"
          class="d-flex justify-space-between text-body-2 text-medium-emphasis"
        >
          <span>Phí giao hàng</span>
          <span>{{ cartStore.deliveryFee.toLocaleString('vi-VN') }}₫</span>
        </div>
      </div>

      <div class="d-flex justify-space-between align-center pb-2 total-row">
        <span class="text-body-2 text-medium-emphasis">{{ cartStore.itemCount }} món</span>
        <span class="text-subtitle-1 font-weight-semibold">
          {{ cartStore.totalAmount.toLocaleString('vi-VN') }}₫
        </span>
      </div>

      <div v-if="cartStore.paymentMethod === PaymentMethod.Cash" class="d-flex align-center">
        <div class="flex-grow-1 text-center">
          <div class="text-caption text-medium-emphasis">Đã nhận</div>
          <div class="text-body-2 font-weight-medium">
            {{ (cartStore.amountReceived ?? 0).toLocaleString('vi-VN') }}₫
          </div>
        </div>
        <v-divider vertical class="mx-2" style="height: 32px" />
        <div class="flex-grow-1 text-center">
          <div
            class="text-caption"
            :class="(cartStore.changeAmount ?? 0) < 0 ? 'text-error' : 'text-medium-emphasis'"
          >
            {{ (cartStore.changeAmount ?? 0) < 0 ? 'Còn thiếu' : 'Tiền thừa' }}
          </div>
          <div
            class="text-body-2 font-weight-medium"
            :class="(cartStore.changeAmount ?? 0) < 0 ? 'text-error' : undefined"
          >
            {{ Math.abs(cartStore.changeAmount ?? 0).toLocaleString('vi-VN') }}₫
          </div>
        </div>
      </div>

      <div>
        <span class="text-caption text-medium-emphasis">Phương thức thanh toán</span>
        <v-btn-toggle
          v-model="cartStore.paymentMethod"
          mandatory
          divided
          rounded="lg"
          density="comfortable"
          class="w-100 mt-1 bg-surface-light"
        >
          <v-btn
            v-for="opt in POS_PAYMENT_METHOD_OPTIONS"
            :key="opt.value"
            :value="opt.value"
            :color="cartStore.paymentMethod === opt.value ? 'primary' : undefined"
            :variant="cartStore.paymentMethod === opt.value ? 'flat' : 'text'"
            class="text-none"
            style="flex: 1 1 0%; min-width: 0"
            :prepend-icon="opt.icon"
          >
            {{ opt.label }}
          </v-btn>
        </v-btn-toggle>
      </div>

      <div v-if="cartStore.paymentMethod === PaymentMethod.Cash" class="d-flex flex-column ga-2">
        <v-text-field
          v-model.number="cartStore.amountReceived"
          label="Số tiền khách đưa"
          type="number"
          density="compact"
          variant="outlined"
          hide-details
          suffix="₫"
        />
        <div class="quick-cash-grid">
          <v-btn
            v-for="amount in POS_QUICK_CASH_AMOUNTS"
            :key="amount"
            variant="tonal"
            size="small"
            class="text-none"
            @click="cartStore.amountReceived = amount"
          >
            {{ formatQuickCash(amount) }}
          </v-btn>
        </div>
      </div>

      <div>
        <span class="text-caption text-medium-emphasis">Trạng thái thanh toán</span>
        <v-btn-toggle
          v-model="cartStore.paymentStatus"
          mandatory
          divided
          rounded="lg"
          density="comfortable"
          class="w-100 mt-1 bg-surface-light"
        >
          <v-btn
            v-for="opt in POS_PAYMENT_STATUS_OPTIONS"
            :key="opt.value"
            :value="opt.value"
            :color="cartStore.paymentStatus === opt.value ? 'primary' : undefined"
            :variant="cartStore.paymentStatus === opt.value ? 'flat' : 'text'"
            class="text-none"
            style="flex: 1 1 0%; min-width: 0"
            :prepend-icon="opt.icon"
          >
            {{ opt.label }}
          </v-btn>
        </v-btn-toggle>
      </div>

      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          icon="mdi-delete-sweep-outline"
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
import {
    POS_PAYMENT_METHOD_OPTIONS,
    POS_PAYMENT_STATUS_OPTIONS,
    POS_QUICK_CASH_AMOUNTS,
    POS_SERVICE_TYPE_OPTIONS,
} from '../constants/pos-order-panel.constants'
import { PaymentMethod, ServiceType } from '../enums/_index'

const props = defineProps<{ storeId: number }>()
const emit  = defineEmits<{ editItem: [uid: string] }>()

const cartStore  = usePosCartStore()
const shiftStore = usePosShiftStore()

const showCustomerForm = ref(cartStore.customerName !== '' || cartStore.customerPhone !== '')

function formatQuickCash(amount: number): string {
    return `${(amount / 1000).toLocaleString('vi-VN')}K`
}

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

function handleEditItem(uid: string): void {
    emit('editItem', uid)
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
    submitting.value = true
    try {
        const payload = {
            StoreId:        props.storeId,
            Channel:        null,
            CustomerName:   cartStore.customerName || null,
            CustomerPhone:  cartStore.customerPhone || null,
            Note:           cartStore.orderNote || null,
            DiscountAmount: 0,
            TaxAmount:      0,
            DeliveryFee:    cartStore.deliveryFee,
            DeliveryAddress: cartStore.deliveryAddress || null,
            PaymentMethod:  cartStore.paymentMethod,
            PaymentStatus:  cartStore.paymentStatus,
            AmountReceived: cartStore.amountReceived,
            ServiceType:    cartStore.serviceType,
            Items:          cartStore.items.map((i) => ({
                ProductId:      i.productId,
                ProductCode:    i.productCode,
                ProductName:    i.productName,
                RegularPrice:   i.resolvedPrice,
                Quantity:       i.quantity,
                DiscountAmount: 0,
                Note:           i.note || null,
                Options:        i.selectedOptions.map((o) => ({
                    OptionId:   o.optionId,
                    GroupName:  o.groupName,
                    OptionName: o.optionName,
                    Price:      o.resolvedPrice,
                })),
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

<style scoped>
.panel-header {
    flex-shrink: 0;
}

.panel-cart {
    flex-grow: 1;
    overflow-y: auto;
    min-height: 0;
}

.panel-checkout {
    flex-shrink: 0;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.total-row {
    border-bottom: 1px dashed rgba(var(--v-theme-on-surface), 0.2);
}

.quick-cash-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
}
</style>
