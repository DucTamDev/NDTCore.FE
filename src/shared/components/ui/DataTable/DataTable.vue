<template>
  <div class="flex flex-col gap-4">
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="rounded-md"
    >
      <template v-for="(_, slot) in $slots" #[slot]="props">
        <slot :name="slot" v-bind="props" />
      </template>
    </v-data-table>

    <div v-if="showPagination" class="flex justify-end">
      <AppPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:page="$emit('update:page', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DataTableHeader } from './types'
import AppPagination from '../Pagination/Pagination.vue'

interface Props {
  headers: DataTableHeader[]
  items: any[]
  loading?: boolean
  currentPage?: number
  totalItems?: number
  itemsPerPage?: number
  showPagination?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  currentPage: 1,
  itemsPerPage: 20,
  showPagination: true,
})

const totalPages = computed(() =>
  Math.ceil((props.totalItems || props.items.length) / props.itemsPerPage),
)
</script>
