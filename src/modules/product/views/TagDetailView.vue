<template>
    <div class="d-flex flex-column ga-5">
        <template v-if="tag.loading.value">
            <v-skeleton-loader type="heading" />
            <v-skeleton-loader type="card" height="120" />
            <v-skeleton-loader type="card" />
        </template>

        <template v-else-if="tag.data.value">
            <!-- Hero header -->
            <v-card variant="tonal" color="primary" rounded="lg" flat>
                <v-card-text class="pa-5">
                    <AppBreadcrumb
                        :items="[
                            { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                            { title: 'Sản phẩm' },
                            { title: 'Nhãn', to: { name: APP_ROUTES.PRODUCT.TAGS.NAME } },
                            { title: tag.data.value.name, disabled: true },
                        ]"
                    />
                    <div class="d-flex align-center ga-3 mt-3">
                        <v-sheet
                            rounded="lg"
                            width="52"
                            height="52"
                            class="d-flex align-center justify-center flex-shrink-0"
                        >
                            <v-icon icon="mdi-tag-outline" size="28" color="primary" />
                        </v-sheet>
                        <div class="d-flex flex-column ga-1">
                            <div class="text-h6 font-weight-bold text-high-emphasis">
                                {{ tag.data.value.name }}
                            </div>
                            <v-chip
                                v-if="tag.data.value.colorHex"
                                size="small"
                                :style="{
                                    backgroundColor: tag.data.value.colorHex,
                                    color: tag.data.value.textColor ?? '#ffffff',
                                }"
                            >
                                {{ tag.data.value.name }}
                            </v-chip>
                        </div>
                    </div>
                </v-card-text>
            </v-card>

            <!-- Tabs -->
            <v-card rounded="lg" elevation="1">
                <v-tabs v-model="activeTab" color="primary" class="px-2">
                    <v-tab value="overview" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-information-outline" size="18" />
                        Tổng quan
                    </v-tab>
                    <v-tab value="products" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-package-variant-closed" size="18" />
                        Sản phẩm
                    </v-tab>
                </v-tabs>

                <v-divider />

                <v-window v-model="activeTab">
                    <v-window-item value="overview">
                        <TagOverviewTab
                            :tag="tag.data.value"
                            :form="editForm"
                            :errors="formErrors"
                            :is-dirty="isDirty"
                            :submitting="submitting"
                            @update:form="onFormUpdate"
                            @save="saveChanges"
                            @discard="discardChanges"
                        />
                    </v-window-item>

                    <v-window-item value="products">
                        <div class="pa-4">
                            <!-- TODO: requires TagId filter in ProductFilterDto -->
                            <AppEmptyState
                                icon="mdi-package-variant-closed-remove"
                                title="Chưa có dữ liệu"
                                description="Tính năng lọc sản phẩm theo nhãn chưa được hỗ trợ (cần bổ sung TagId vào ProductFilterDto)."
                            />
                        </div>
                    </v-window-item>
                </v-window>
            </v-card>
        </template>

        <AppEmptyState
            v-else-if="!tag.loading.value"
            icon="mdi-tag-remove-outline"
            title="Không tìm thấy nhãn"
            description="Nhãn này không tồn tại hoặc đã bị xóa."
        >
            <template #actions>
                <v-btn
                    color="primary"
                    prepend-icon="mdi-arrow-left"
                    :to="{ name: APP_ROUTES.PRODUCT.TAGS.NAME }"
                >
                    Quay lại danh sách
                </v-btn>
            </template>
        </AppEmptyState>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AppBreadcrumb, AppEmptyState } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { tagService } from '../services/tag.service'
import { useTag } from '../composables/useTag'
import { createEmptyTagForm } from '../models/form-models/tag.model'
import type { TagFormModel } from '../models/form-models/tag.model'
import type { UpdateTagRequest } from '../models/dtos/tag.dto'
import TagOverviewTab from '../components/TagOverviewTab.vue'

const route = useRoute()
const tagId = Number(route.params['id'])
const activeTab = ref('overview')

const tag = useAsyncState(() => tagService.getByIdAsync(tagId))
const { updateTag } = useTag()

// Inline edit form
const editForm = reactive<TagFormModel>(createEmptyTagForm())
const snapshot = ref<TagFormModel | null>(null)

function syncFormFromTag() {
    if (!tag.data.value) return
    const t = tag.data.value
    editForm.name = t.name
    editForm.textColor = t.textColor ?? ''
    editForm.colorHex = t.colorHex ?? ''
    editForm.iconUrl = t.iconUrl ?? ''
    editForm.displayOrder = t.displayOrder
    editForm.isActive = t.isActive
    snapshot.value = { ...editForm }
}

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return (
        editForm.name !== snapshot.value.name ||
        editForm.textColor !== snapshot.value.textColor ||
        editForm.colorHex !== snapshot.value.colorHex ||
        editForm.iconUrl !== snapshot.value.iconUrl ||
        editForm.displayOrder !== snapshot.value.displayOrder ||
        editForm.isActive !== snapshot.value.isActive
    )
})

const formErrors = reactive<Partial<Record<keyof TagFormModel, string>>>({})

function onFormUpdate(field: keyof TagFormModel, value: unknown) {
    ;(editForm as Record<string, unknown>)[field] = value
    if (field === 'name' && typeof value === 'string' && value.trim()) {
        delete formErrors.name
    }
}

// Save / Discard
const submitting = ref(false)

function discardChanges() {
    syncFormFromTag()
    delete formErrors.name
}

async function saveChanges() {
    formErrors.name = editForm.name?.trim() ? undefined : 'Tên nhãn là bắt buộc'
    if (formErrors.name) return

    submitting.value = true
    try {
        const payload: UpdateTagRequest = {
            Name: editForm.name.trim(),
            TextColor: editForm.textColor || null,
            ColorHex: editForm.colorHex || null,
            IconUrl: editForm.iconUrl || null,
            DisplayOrder: editForm.displayOrder,
            IsActive: editForm.isActive,
        }
        const ok = await updateTag(tagId, payload)
        if (ok) {
            await tag.execute()
            syncFormFromTag()
        }
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    await tag.execute()
    syncFormFromTag()
})
</script>
