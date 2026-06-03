<template>
    <v-card rounded="lg">
        <AppDataTable
            :items="items"
            :columns="CATEGORY_LIST_COLUMNS"
            :loading="loading"
            item-key="id"
            @row-click="(item) => emit(CATEGORY_LIST_EMIT.ROW_ACTION, CATEGORY_ROW_ACTION.DETAIL, item)"
        >
            <template #[`item.slug`]="{ item }">
                <span class="text-caption text-medium-emphasis">{{ item.slug ?? '—' }}</span>
            </template>

            <template #[`item.isActive`]="{ item }">
                <AppStatusChip
                    :config="CATEGORY_STATUS_CONFIG[item.isActive ? 'active' : 'inactive']"
                />
            </template>

            <template #[`item.createdAt`]="{ item }">
                {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—' }}
            </template>

            <template #[`item.actions`]="{ item }">
                <AppRowActions
                    :actions="CATEGORY_ROW_ACTIONS"
                    :item="item"
                    @action="(key) => emit(CATEGORY_LIST_EMIT.ROW_ACTION, key, item)"
                />
            </template>

            <template #empty>
                <AppEmptyState
                    icon="mdi-format-list-bulleted-type"
                    title="Chưa có danh mục"
                    description="Tạo danh mục đầu tiên để phân loại sản phẩm."
                >
                    <template #actions>
                        <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(CATEGORY_LIST_EMIT.CREATE)">
                            Thêm danh mục
                        </v-btn>
                    </template>
                </AppEmptyState>
            </template>
        </AppDataTable>

        <v-divider />

        <AppPagination
            :page-number="pageNumber"
            :page-size="pageSize"
            :total-pages="totalPages"
            :total-items="totalItems"
            @update:page-number="emit(CATEGORY_LIST_EMIT.PAGE_CHANGE, $event)"
            @update:page-size="emit(CATEGORY_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
        />
    </v-card>
</template>

<script setup lang="ts">
import {
    AppDataTable,
    AppPagination,
    AppRowActions,
    AppStatusChip,
    AppEmptyState,
} from '@/components/ui'
import {
    CATEGORY_LIST_EMIT,
    CATEGORY_LIST_COLUMNS,
    CATEGORY_ROW_ACTION,
    CATEGORY_ROW_ACTIONS,
    CATEGORY_STATUS_CONFIG,
    type CategoryListEmits,
} from '../constants/category-list.constants'
import type { CategoryViewModel } from '../models/view-models/category.view-model'

defineProps<{
    items: CategoryViewModel[]
    loading: boolean
    pageNumber: number
    pageSize: number
    totalPages: number
    totalItems: number
}>()

const emit = defineEmits<CategoryListEmits>()
</script>
