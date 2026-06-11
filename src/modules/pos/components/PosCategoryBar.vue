<template>
  <div class="overflow-x-auto" style="white-space: nowrap;">
    <v-chip-group
      v-model="selectedIndex"
      mandatory
      class="flex-nowrap px-2"
      selected-class="text-primary"
    >
      <v-chip
        v-for="cat in allCategories"
        :key="String(cat.id)"
        :value="cat.id"
        variant="text"
        rounded="lg"
        @click="onSelect(cat.id)"
      >
        {{ cat.label }}
        <v-badge v-if="cat.count != null" :content="cat.count" inline class="ml-1" />
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePosCatalogStore } from '../stores/pos-catalog.store'

const catalogStore = usePosCatalogStore()

const selectedIndex = ref<number | null>(null)

const allCategories = computed(() => {
    const cats: { id: number | null; label: string; count: number | null }[] = [
        { id: null, label: 'Tất cả', count: null },
    ]
    for (const c of catalogStore.categories) {
        cats.push({ id: c.Id, label: c.Name, count: c.ProductCount })
    }
    return cats
})

function onSelect(id: number | null): void {
    catalogStore.selectCategory(id)
}

watch(
    () => catalogStore.selectedCategoryId,
    (val) => { selectedIndex.value = val },
)
</script>
