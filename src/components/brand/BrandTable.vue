<template>
    <div class="d-flex flex-column ga-4">
        <v-card rounded="lg">
            <v-card-text>
                <div class="d-flex flex-column flex-md-row ga-3">
                    <v-text-field
                        :model-value="keyword"
                        label="Tìm theo tên, mã, pháp nhân"
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        hide-details
                        @update:model-value="emit('update:keyword', String($event ?? ''))"
                    />

                    <v-select
                        :model-value="statusFilter"
                        label="Trạng thái"
                        variant="outlined"
                        hide-details
                        :items="statusItems"
                        item-title="title"
                        item-value="value"
                        style="max-width: 220px"
                        @update:model-value="emit('update:statusFilter', ($event as boolean | null) ?? null)"
                    />

                    <div class="d-flex ga-2 ml-md-auto">
                        <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="emit('refresh')">
                            Tải lại
                        </v-btn>
                        <v-btn color="primary" prepend-icon="mdi-plus" @click="emit('create')">
                            Tạo thương hiệu
                        </v-btn>
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <v-card rounded="lg">
            <v-data-table
                :headers="headers"
                :items="items"
                :loading="loading"
                :items-per-page="itemsPerPage"
                :page="currentPage"
                hide-default-footer
            >
                <template #item.name="{ item }">
                    <div class="d-flex flex-column">
                        <span class="font-weight-medium">{{ item.raw.name }}</span>
                        <span class="text-caption text-medium-emphasis">
                            {{ item.raw.legalName || 'Chưa có tên pháp nhân' }}
                        </span>
                    </div>
                </template>

                <template #item.code="{ item }">
                    <v-chip size="small" variant="tonal" color="primary">{{ item.raw.code }}</v-chip>
                </template>

                <template #item.isActive="{ item }">
                    <v-switch
                        :model-value="item.raw.isActive"
                        color="success"
                        hide-details
                        inset
                        @update:model-value="emit('toggle-status', item.raw)"
                    />
                </template>

                <template #item.updatedAt="{ item }">
                    {{ formatDate(item.raw.updatedAt) }}
                </template>

                <template #item.actions="{ item }">
                    <div class="d-flex justify-end ga-1">
                        <v-btn
                            icon="mdi-eye-outline"
                            size="small"
                            variant="text"
                            @click="emit('view', item.raw)"
                        />
                        <v-btn
                            icon="mdi-account-multiple-outline"
                            size="small"
                            variant="text"
                            @click="emit('members', item.raw)"
                        />
                        <v-btn
                            icon="mdi-pencil-outline"
                            size="small"
                            variant="text"
                            @click="emit('edit', item.raw)"
                        />
                        <v-btn
                            icon="mdi-delete-outline"
                            size="small"
                            variant="text"
                            color="error"
                            @click="emit('delete', item.raw)"
                        />
                    </div>
                </template>
            </v-data-table>

            <v-card-actions class="justify-end px-4 pb-4">
                <v-pagination
                    :model-value="currentPage"
                    :length="pageCount"
                    density="comfortable"
                    @update:model-value="emit('update:page', $event)"
                />
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BrandModel } from '@/models/brand.model'
import type { DataTableHeader } from '@/core/types'

interface Props {
    items: BrandModel[]
    loading?: boolean
    currentPage: number
    totalItems: number
    itemsPerPage: number
    keyword: string
    statusFilter: boolean | null
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
})

const emit = defineEmits<{
    create: []
    refresh: []
    view: [brand: BrandModel]
    edit: [brand: BrandModel]
    delete: [brand: BrandModel]
    members: [brand: BrandModel]
    'toggle-status': [brand: BrandModel]
    'update:page': [page: number]
    'update:keyword': [keyword: string]
    'update:statusFilter': [status: boolean | null]
}>()

const headers: DataTableHeader[] = [
    { key: 'name', title: 'Thương hiệu' },
    { key: 'code', title: 'Mã' },
    { key: 'currency', title: 'Tiền tệ' },
    { key: 'timeZone', title: 'Múi giờ' },
    { key: 'isActive', title: 'Kích hoạt' },
    { key: 'updatedAt', title: 'Cập nhật' },
    { key: 'actions', title: 'Thao tác', align: 'end' },
]

const statusItems = [
    { title: 'Tất cả', value: null },
    { title: 'Đang hoạt động', value: true },
    { title: 'Ngừng hoạt động', value: false },
]

const pageCount = computed(() =>
    Math.max(1, Math.ceil((props.totalItems || props.items.length) / props.itemsPerPage)),
)

function formatDate(value: string | null) {
    if (!value) {
        return '--'
    }

    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(value))
}
</script>
