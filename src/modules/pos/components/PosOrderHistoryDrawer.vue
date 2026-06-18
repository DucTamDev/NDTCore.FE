<template>
  <v-navigation-drawer
    :model-value="modelValue"
    location="right"
    width="380"
    temporary
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="d-flex flex-column h-100">
      <div class="d-flex align-center justify-space-between px-4 py-3">
        <span class="text-subtitle-1 font-weight-semibold">Lịch sử đơn hàng</span>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('update:modelValue', false)" />
      </div>

      <v-divider />

      <!-- Status filter -->
      <div class="px-3 py-2">
        <v-chip-group v-model="selectedStatus" column>
          <v-chip value="" variant="tonal" size="small">Tất cả</v-chip>
          <v-chip value="Pending" variant="tonal" size="small">Chờ xử lý</v-chip>
          <v-chip value="Completed" variant="tonal" size="small">Hoàn tất</v-chip>
          <v-chip value="Cancelled" variant="tonal" size="small">Đã huỷ</v-chip>
        </v-chip-group>
      </div>

      <v-divider />

      <!-- Content -->
      <div class="overflow-y-auto flex-grow-1">
        <div v-if="isLoading" class="d-flex justify-center align-center pa-8">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <div
          v-else-if="filteredOrders.length === 0"
          class="d-flex flex-column align-center justify-center ga-2 pa-8 text-medium-emphasis"
        >
          <v-icon icon="mdi-receipt-outline" size="48" />
          <span class="text-body-2">Không có đơn hàng</span>
        </div>

        <v-list v-else lines="three" class="pa-0">
          <template v-for="(order, idx) in filteredOrders" :key="order.Id">
            <v-list-item class="px-4">
              <template #prepend>
                <v-chip
                  :color="statusColor(order.Status)"
                  variant="tonal"
                  size="x-small"
                  class="mr-2"
                >
                  {{ statusLabel(order.Status) }}
                </v-chip>
              </template>

              <template #append v-if="order.Status !== 'Cancelled'">
                <v-btn
                  icon="mdi-printer-outline"
                  variant="text"
                  size="small"
                  :loading="isPrinting"
                  @click="printBill(order.Id)"
                />
              </template>

              <v-list-item-title class="font-weight-semibold text-body-2">
                #{{ order.OrderNumber }}
                <span class="text-medium-emphasis font-weight-regular">
                  — {{ order.TotalAmount.toLocaleString('vi-VN') }}₫
                </span>
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption mt-0.5">{{ order.ItemSummary }}</v-list-item-subtitle>
              <v-list-item-subtitle class="text-caption text-medium-emphasis">
                {{ formatTime(order.CreatedAt) }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-divider v-if="idx < filteredOrders.length - 1" />
          </template>
        </v-list>
      </div>

      <v-divider />

      <div class="pa-3">
        <v-btn block variant="tonal" prepend-icon="mdi-refresh" :loading="isLoading" @click="load">
          Làm mới
        </v-btn>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { posService } from '../services/pos.service'
import type { PosOrderHistoryItemDto } from '../models/dtos/pos-order.dto'
import { usePrintBill } from '../composables/usePrintBill'

const props = defineProps<{ modelValue: boolean; storeId: number }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { isPrinting, printBill } = usePrintBill()

const orders         = ref<PosOrderHistoryItemDto[]>([])
const isLoading      = ref(false)
const selectedStatus = ref<string>('')

const filteredOrders = computed(() =>
    selectedStatus.value
        ? orders.value.filter((o) => o.Status === selectedStatus.value)
        : orders.value,
)

watch(
    () => props.modelValue,
    (open) => { if (open) load() },
)

async function load(): Promise<void> {
    isLoading.value = true
    try {
        orders.value = await posService.getOrderHistoryAsync(props.storeId)
    } finally {
        isLoading.value = false
    }
}

function statusLabel(status: string): string {
    const map: Record<string, string> = {
        Pending:   'Chờ xử lý',
        Completed: 'Hoàn tất',
        Cancelled: 'Đã huỷ',
    }
    return map[status] ?? status
}

function statusColor(status: string): string {
    const map: Record<string, string> = {
        Pending:   'warning',
        Completed: 'success',
        Cancelled: 'error',
    }
    return map[status] ?? 'default'
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleString('vi-VN', {
        day:    '2-digit',
        month:  '2-digit',
        hour:   '2-digit',
        minute: '2-digit',
    })
}
</script>
