<template>
    <div class="pa-4 d-flex flex-column ga-4">
        <div class="d-flex align-center justify-space-between">
            <span class="text-subtitle-2 text-medium-emphasis">Tags đang gán</span>
            <v-btn size="small" color="primary" prepend-icon="mdi-plus" @click="showAssign = true">
                Gán tag
            </v-btn>
        </div>

        <AppDataTable
            :items="(tags as Record<string, unknown>[])"
            :columns="TAG_ASSIGNED_COLUMNS"
            :loading="isLoading"
            item-key="TagId"
        >
            <template #[`item.actions`]="{ item }">
                <div class="d-flex justify-end" @click.stop>
                    <v-tooltip text="Gỡ tag" location="top">
                        <template #activator="{ props: tp }">
                            <v-btn
                                v-bind="tp"
                                icon="mdi-tag-off-outline"
                                color="error"
                                size="small"
                                variant="text"
                                :disabled="isSubmitting"
                                @click="openConfirm(Number(item['TagId']))"
                            />
                        </template>
                    </v-tooltip>
                </div>
            </template>

            <template #empty>
                <AppEmptyState
                    icon="mdi-tag-off-outline"
                    title="Chưa có tag nào được gán"
                    description="Nhấn 'Gán tag' để thêm tag cho sản phẩm."
                />
            </template>
        </AppDataTable>

        <!-- Assign dialog -->
        <AppDialog v-model="showAssign" title="Gán tag" :hide-actions="true" size="sm">
            <div class="d-flex flex-column ga-3">
                <v-autocomplete
                    v-model="selectedTagId"
                    :items="availableTags"
                    item-value="id"
                    item-title="name"
                    label="Chọn tag"
                    clearable
                />
                <div class="d-flex justify-end ga-2">
                    <v-btn variant="text" @click="showAssign = false">Hủy</v-btn>
                    <v-btn
                        color="primary"
                        :loading="isSubmitting"
                        :disabled="!selectedTagId"
                        @click="onAssign"
                    >
                        Gán
                    </v-btn>
                </div>
            </div>
        </AppDialog>

        <AppConfirmDialog
            v-model="confirmOpen"
            title="Gỡ tag"
            message="Bạn có chắc muốn gỡ tag này khỏi sản phẩm?"
            confirm-label="Xác nhận gỡ"
            confirm-variant="danger"
            @confirm="onConfirmRemove"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TableColumn } from '@/components/ui'
import { AppDialog, AppConfirmDialog, AppDataTable, AppEmptyState } from '@/components/ui'
import { useProductRelations } from '../../composables/useProductRelations'
import { useTagStore } from '../../stores/tag.store'

const props = defineProps<{ productId: number }>()

const TAG_ASSIGNED_COLUMNS: TableColumn[] = [
    { key: 'TagId',   title: 'ID',       width: '70px' },
    { key: 'TagName', title: 'Tên tag',  minWidth: '150px' },
    { key: 'actions', title: '',         width: '70px', align: 'end' },
]

const { isLoading, isSubmitting, tags, loadTags, assignTag, removeTag } =
    useProductRelations(props.productId)

const tagStore      = useTagStore()
const availableTags = ref<{ id: number; name: string }[]>([])
const showAssign    = ref(false)
const selectedTagId = ref<number | null>(null)
const confirmOpen   = ref(false)
const confirmTagId  = ref<number | null>(null)

function openConfirm(tagId: number) {
    confirmTagId.value = tagId
    confirmOpen.value  = true
}

function refreshAvailable() {
    const assignedIds = new Set(tags.value.map((t) => t.TagId))
    availableTags.value = tagStore.items
        .filter((t) => !assignedIds.has(t.id))
        .map((t) => ({ id: t.id, name: t.name }))
}

async function onAssign() {
    if (!selectedTagId.value) return
    const ok = await assignTag({ TagId: selectedTagId.value })
    if (ok) {
        showAssign.value    = false
        selectedTagId.value = null
        await loadTags()
        refreshAvailable()
    }
}

async function onConfirmRemove() {
    if (confirmTagId.value == null) return
    const ok = await removeTag(confirmTagId.value)
    if (ok) {
        await loadTags()
        refreshAvailable()
    }
    confirmTagId.value = null
}

onMounted(async () => {
    await tagStore.fetchPaged({ PageNumber: 1, PageSize: 200 })
    await loadTags()
    refreshAvailable()
})
</script>
