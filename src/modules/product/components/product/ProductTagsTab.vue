<template>
    <div class="pa-4 d-flex flex-column ga-4">
        <div class="d-flex align-center justify-space-between">
            <span class="text-subtitle-2 text-medium-emphasis">Tags đang gán</span>
            <v-btn size="small" color="primary" prepend-icon="mdi-plus" @click="showAssign = true">
                Gán tag
            </v-btn>
        </div>

        <v-progress-linear :indeterminate="isLoading" color="primary" :style="{ opacity: isLoading ? 1 : 0, transition: 'opacity 0.15s ease' }" />

        <v-chip-group v-if="tags.length">
            <v-chip
                v-for="t in tags"
                :key="t.TagId"
                closable
                :disabled="isSubmitting"
                @click:close="() => { confirmTagId = t.TagId; confirmTagOpen = true }"
            >
                {{ t.TagName }}
            </v-chip>
        </v-chip-group>
        <v-alert v-else-if="!isLoading" type="info" variant="tonal" density="compact">
            Chưa có tag nào được gán.
        </v-alert>

        <AppDialog v-model="showAssign" title="Gán tag" :hide-actions="true" max-width="500px">
            <div class="pa-2 d-flex flex-column ga-3">
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
            v-model="confirmTagOpen"
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
import { AppDialog, AppConfirmDialog } from '@/components/ui'
import { useProductRelations } from '../composables/useProductRelations'
import { useTagStore } from '../stores/tag.store'

const props = defineProps<{ productId: number }>()

const { isLoading, isSubmitting, tags, loadTags, assignTag, removeTag } = useProductRelations(props.productId)
const tagStore = useTagStore()
const availableTags = ref<{ id: number; name: string }[]>([])
const showAssign = ref(false)
const selectedTagId = ref<number | null>(null)
const confirmTagOpen = ref(false)
const confirmTagId = ref<number | null>(null)

async function onAssign() {
    if (!selectedTagId.value) return
    const ok = await assignTag({ TagId: selectedTagId.value })
    if (ok) {
        showAssign.value = false
        selectedTagId.value = null
        await loadTags()
        const assignedIds = new Set(tags.value.map((t) => t.TagId))
        availableTags.value = tagStore.items
            .filter((t) => !assignedIds.has(t.id))
            .map((t) => ({ id: t.id, name: t.name }))
    }
}

async function onConfirmRemove() {
    if (confirmTagId.value == null) return
    const ok = await removeTag(confirmTagId.value)
    if (ok) await loadTags()
    confirmTagId.value = null
}

onMounted(async () => {
    await tagStore.fetchPaged({ PageNumber: 1, PageSize: 200 })
    await loadTags()
    const assignedIds = new Set(tags.value.map((t) => t.TagId))
    availableTags.value = tagStore.items
        .filter((t) => !assignedIds.has(t.id))
        .map((t) => ({ id: t.id, name: t.name }))
})
</script>
