<template>
  <div class="pos-root d-flex flex-column" style="height: 100dvh; overflow: hidden;">
    <PosHeader @open-history="historyOpen = true" />

    <div class="pos-body d-flex flex-grow-1 overflow-hidden">
      <PosMenuPanel
        class="pos-panel pos-menu-panel"
        :class="{ 'panel-hidden': activeTab !== 'menu' }"
        @pick="openOptionPicker"
      />
      <v-divider class="d-none d-md-block" vertical />
      <PosOrderPanel
        :store-id="storeId"
        class="pos-panel pos-order-panel"
        :class="{ 'panel-hidden': activeTab !== 'order' }"
        @open-history="historyOpen = true"
        @edit-product="openPickerByProductId"
      />
    </div>

    <!-- Mobile bottom tab bar -->
    <div class="mobile-tab-bar d-flex d-md-none">
      <button
        class="mobile-tab"
        :class="{ active: activeTab === 'menu' }"
        @click="activeTab = 'menu'"
      >
        <v-icon size="22">mdi-food-variant</v-icon>
        <span>Menu</span>
      </button>
      <button
        class="mobile-tab"
        :class="{ active: activeTab === 'order' }"
        @click="activeTab = 'order'"
      >
        <div class="tab-icon-wrap">
          <v-badge
            v-if="cartStore.itemCount > 0"
            :content="String(cartStore.itemCount)"
            color="error"
            floating
          >
            <v-icon size="22">mdi-cart-outline</v-icon>
          </v-badge>
          <v-icon v-else size="22">mdi-cart-outline</v-icon>
        </div>
        <span>Giỏ hàng</span>
      </button>
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
const activeTab        = ref<'menu' | 'order'>('menu')

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

<style scoped>
/* Desktop: side-by-side panels */
.pos-body {
    flex-direction: row;
}

.pos-panel {
    overflow: hidden;
}

.pos-menu-panel {
    flex: 65;
    min-width: 0;
}

.pos-order-panel {
    flex: 35;
    min-width: 320px;
}

/* Mobile: stacked panels, one visible at a time */
@media (max-width: 959px) {
    .pos-body {
        flex-direction: column;
    }

    .pos-menu-panel,
    .pos-order-panel {
        flex: 1;
        min-width: 0;
    }

    .panel-hidden {
        display: none !important;
    }
}

/* Mobile bottom tab bar */
.mobile-tab-bar {
    height: 56px;
    flex-shrink: 0;
    border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgb(var(--v-theme-surface));
}

.mobile-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 11px;
    border: none;
    background: none;
    cursor: pointer;
    color: rgba(var(--v-theme-on-surface), 0.6);
    transition: color 0.15s;
}

.mobile-tab.active {
    color: rgb(var(--v-theme-primary));
}

.tab-icon-wrap {
    position: relative;
    line-height: 1;
}
</style>
