<template>
    <v-card rounded="lg">
        <AppDataTable
            :items="items"
            :columns="TAG_LIST_COLUMNS"
            :loading="loading"
            item-key="id"
            @row-click="(item) => emit(TAG_LIST_EMIT.ROW_ACTION, TAG_ROW_ACTION.EDIT, item)"
        >
            <template #[`item.colorHex`]="{ item }">
                <div class="d-flex align-center ga-2">
                    <div
                        v-if="item.colorHex"
                        class="rounded"
                        :style="{
                            background: item.colorHex,
                            width: '18px',
                            height: '18px',
                            border: '1px solid rgba(0,0,0,0.15)',
                            flexShrink: 0,
                        }"
                    />
                    <span class="text-caption">{{ item.colorHex ?? '—' }}</span>
                </div>
            </template>

            <template #[`item.isActive`]="{ item }">
                <AppStatusChip
                    :config="TAG_STATUS_CONFIG[item.isActive ? 'active' : 'inactive']"
                />
            </template>

            <template #[`item.actions`]="{ item }">
                <AppRowActions
                    :actions="TAG_ROW_ACTIONS"
                    :item="item"
                    @action="(key) => emit(TAG_LIST_EMIT.ROW_ACTION, key, item)"
                />
            </template>

            <template #empty>
                <AppEmptyState
                    icon="mdi-tag-multiple-outline"
                    title="Chưa có nhãn"
                    description="Tạo nhãn đầu tiên để gắn vào sản phẩm."
                >
                    <template #actions>
                        <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(TAG_LIST_EMIT.CREATE)">
                            Thêm nhãn
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
            @update:page-number="emit(TAG_LIST_EMIT.PAGE_CHANGE, $event)"
            @update:page-size="emit(TAG_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
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
    TAG_LIST_EMIT,
    TAG_LIST_COLUMNS,
    TAG_ROW_ACTION,
    TAG_ROW_ACTIONS,
    TAG_STATUS_CONFIG,
    type TagListEmits,
} from '../constants/tag-list.constants'
import type { TagViewModel } from '../models/view-models/tag.view-model'

defineProps<{
    items: TagViewModel[]
    loading: boolean
    pageNumber: number
    pageSize: number
    totalPages: number
    totalItems: number
}>()

const emit = defineEmits<TagListEmits>()
</script>
