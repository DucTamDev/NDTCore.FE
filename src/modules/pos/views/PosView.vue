<template>
  <div class="pos-root d-flex flex-column" style="height: 100dvh; overflow: hidden;">
    <PosHeader @open-history="historyOpen = true" />

    <div class="pos-body d-flex flex-row flex-grow-1 overflow-hidden">
      <PosMenuPanel
        style="flex: 65; min-width: 0; overflow: hidden;"
        @pick="openOptionPicker"
      />
      <v-divider vertical />
      <PosOrderPanel
        :store-id="storeId"
        style="flex: 35; min-width: 320px; overflow: hidden;"
        @open-history="historyOpen = true"
        @edit-product="openPickerByProductId"
      />
    </div>

    <PosOptionPicker
      v-model="optionPickerOpen"
      :product="pickedProduct"
      @add="onAddToCart"
    />

    <PosOrderHistoryDrawer v-model="historyOpen" :store-id="storeId" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePosShiftStore } from '../stores/pos-shift.store'
import { usePosCatalogStore } from '../stores/pos-catalog.store'
import { usePosCartStore } from '../stores/pos-cart.store'
import PosHeader from '../components/PosHeader.vue'
import PosMenuPanel from '../components/PosMenuPanel.vue'
import PosOrderPanel from '../components/PosOrderPanel.vue'
import PosOptionPicker from '../components/PosOptionPicker.vue'
import PosOrderHistoryDrawer from '../components/PosOrderHistoryDrawer.vue'
import type { PosProductDto } from '../models/dtos/pos-catalog.dto'
import type { PosCartItem } from '../models/types/pos-cart.types'

const route   = useRoute()
const storeId = computed(() => Number(route.params['storeId']))

const shiftStore   = usePosShiftStore()
const catalogStore = usePosCatalogStore()
const cartStore    = usePosCartStore()

const optionPickerOpen = ref(false)
const pickedProduct    = ref<PosProductDto | null>(null)
const historyOpen      = ref(false)

function openOptionPicker(product: PosProductDto): void {
    pickedProduct.value    = product
    optionPickerOpen.value = true
}

function openPickerByProductId(productId: number): void {
    const product = catalogStore.products.find((p) => p.Id === productId)
    if (product) openOptionPicker(product)
}

function onAddToCart(item: PosCartItem): void {
    cartStore.addItem(item)
    optionPickerOpen.value = false
}

onMounted(async () => {
    await Promise.all([
        shiftStore.fetchStatus(storeId.value),
        catalogStore.fetchCatalog(storeId.value),
    ])
})
</script>
