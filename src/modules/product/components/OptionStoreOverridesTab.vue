<template>
    <div class="pa-4 d-flex flex-column ga-4">
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />
        <v-row>
            <!-- Availability column -->
            <v-col cols="12" md="6">
                <v-card variant="outlined" rounded="lg">
                    <v-card-title class="text-subtitle-2 pa-3">Khả dụng theo cửa hàng</v-card-title>
                    <v-divider />
                    <v-card-text>
                        <v-table v-if="availability.length" density="compact">
                            <thead>
                                <tr>
                                    <th>Store ID</th>
                                    <th class="text-center">Khả dụng</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="a in availability" :key="a.StoreId">
                                    <td>{{ a.StoreId }}</td>
                                    <td class="text-center">
                                        <v-icon
                                            :color="a.IsAvailable ? 'success' : 'error'"
                                            :icon="a.IsAvailable ? 'mdi-check-circle' : 'mdi-close-circle'"
                                        />
                                    </td>
                                    <td class="text-end">
                                        <v-btn
                                            size="x-small"
                                            icon="mdi-delete-outline"
                                            variant="text"
                                            color="error"
                                            @click="() => { confirmAvailStoreId = a.StoreId; confirmAvailOpen = true }"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        <v-alert v-else-if="!isLoading" type="info" variant="tonal" density="compact" class="mb-2">
                            Chưa có cài đặt.
                        </v-alert>
                        <div class="d-flex ga-2 mt-2 align-center flex-wrap">
                            <v-text-field
                                v-model.number="newStoreId"
                                label="Store ID"
                                type="number"
                                density="compact"
                                hide-details
                                style="max-width: 120px"
                            />
                            <v-switch v-model="newIsAvailable" label="Khả dụng" color="primary" hide-details />
                            <v-btn color="primary" size="small" :loading="isSubmitting" @click="onUpsertAvailability">
                                Lưu
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Price column -->
            <v-col cols="12" md="6">
                <v-card variant="outlined" rounded="lg">
                    <v-card-title class="text-subtitle-2 pa-3">Giá theo cửa hàng</v-card-title>
                    <v-divider />
                    <v-card-text>
                        <v-table v-if="prices.length" density="compact">
                            <thead>
                                <tr>
                                    <th>Store ID</th>
                                    <th class="text-end">Giá</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="p in prices" :key="p.StoreId">
                                    <td>{{ p.StoreId }}</td>
                                    <td class="text-end">{{ p.Price.toLocaleString('vi-VN') }} ₫</td>
                                    <td class="text-end">
                                        <v-btn
                                            size="x-small"
                                            icon="mdi-delete-outline"
                                            variant="text"
                                            color="error"
                                            @click="() => { confirmPriceStoreId = p.StoreId; confirmPriceOpen = true }"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        <v-alert v-else-if="!isLoading" type="info" variant="tonal" density="compact" class="mb-2">
                            Chưa có giá riêng.
                        </v-alert>
                        <div class="d-flex ga-2 mt-2 align-center flex-wrap">
                            <v-text-field
                                v-model.number="priceStoreId"
                                label="Store ID"
                                type="number"
                                density="compact"
                                hide-details
                                style="max-width: 120px"
                            />
                            <AppCurrencyField v-model="priceValue" label="Giá" style="max-width: 160px" />
                            <v-btn color="primary" size="small" :loading="isSubmitting" @click="onUpsertPrice">
                                Lưu
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <AppConfirmDialog
            v-model="confirmAvailOpen"
            title="Xoá cài đặt khả dụng"
            :message="`Xoá cài đặt khả dụng cho Store ID ${confirmAvailStoreId}?`"
            confirm-variant="danger"
            @confirm="onRemoveAvailability"
        />
        <AppConfirmDialog
            v-model="confirmPriceOpen"
            title="Xoá giá override"
            :message="`Xoá giá riêng cho Store ID ${confirmPriceStoreId}?`"
            confirm-variant="danger"
            @confirm="onRemovePrice"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AppCurrencyField, AppConfirmDialog } from '@/components/ui'
import { useOptionStoreOverrides } from '../composables/useStoreOverrides'

const props = defineProps<{ optionId: number }>()

const {
    isLoading,
    isSubmitting,
    availability,
    prices,
    loadOverview,
    upsertAvailability,
    removeAvailability,
    upsertPrice,
    removePrice,
} = useOptionStoreOverrides(props.optionId)

const newStoreId = ref(0)
const newIsAvailable = ref(true)
const priceStoreId = ref(0)
const priceValue = ref<number>(0)

const confirmAvailOpen = ref(false)
const confirmAvailStoreId = ref(0)
const confirmPriceOpen = ref(false)
const confirmPriceStoreId = ref(0)

async function onUpsertAvailability() {
    const ok = await upsertAvailability(newStoreId.value, newIsAvailable.value)
    if (ok) { newStoreId.value = 0; await loadOverview() }
}

async function onRemoveAvailability() {
    const ok = await removeAvailability(confirmAvailStoreId.value)
    if (ok) await loadOverview()
}

async function onUpsertPrice() {
    const ok = await upsertPrice(priceStoreId.value, priceValue.value)
    if (ok) { priceStoreId.value = 0; priceValue.value = 0; await loadOverview() }
}

async function onRemovePrice() {
    const ok = await removePrice(confirmPriceStoreId.value)
    if (ok) await loadOverview()
}

onMounted(loadOverview)
</script>
