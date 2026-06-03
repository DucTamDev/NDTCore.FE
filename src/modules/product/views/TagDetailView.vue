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
                            :entity="tag.data.value"
                            :form="editForm"
                            :errors="formErrors"
                            :is-dirty="isDirty"
                            :submitting="submitting"
                            @update:form="onFormUpdate"
                            @save="saveChanges"
                            @discard="onDiscard"
                            @back="onBack"
                        />
                    </v-window-item>

                    <v-window-item value="products">
                        <div class="pa-4">
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

        <!-- Confirm bỏ thay đổi -->
        <AppConfirmDialog
            v-model="confirmOpen"
            title="Bỏ thay đổi?"
            message="Bạn có thay đổi chưa được lưu. Nếu tiếp tục, các thay đổi sẽ bị mất."
            confirm-label="Bỏ thay đổi"
            @confirm="onConfirmUnsaved"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppBreadcrumb, AppEmptyState, AppConfirmDialog } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { tagService } from '../services/tag.service'
import { useTag } from '../composables/useTag'
import { toForm, toPayload, emptyForm } from '../adapters/tag.adapter'
import type { TagFormModel } from '../models/form-models/tag.model'
import TagOverviewTab from '../components/TagOverviewTab.vue'

const route = useRoute()
const router = useRouter()
const tagId = Number(route.params['id'])
const activeTab = ref('overview')
const submitting = ref(false)
const editForm = reactive<TagFormModel>(emptyForm())
const snapshot = ref<TagFormModel | null>(null)
const formErrors = reactive<Partial<Record<keyof TagFormModel, string>>>({})
const confirmOpen = ref(false)
const pendingNavAction = ref<'back' | 'discard' | null>(null)

if (isNaN(tagId)) void router.replace({ name: APP_ROUTES.PRODUCT.TAGS.NAME })

const tag = useAsyncState(() => tagService.getByIdAsync(tagId))
const { updateTag } = useTag()

const TRACKED_FIELDS: ReadonlyArray<keyof TagFormModel> = [
    'name', 'textColor', 'colorHex', 'iconUrl', 'displayOrder', 'isActive',
] as const

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return TRACKED_FIELDS.some(f => editForm[f] !== snapshot.value![f])
})

function syncFormFromEntity() {
    if (!tag.data.value) return
    Object.assign(editForm, toForm(tag.data.value))
    snapshot.value = structuredClone(toRaw(editForm))
}

function onFormUpdate(field: keyof TagFormModel, value: unknown) {
    ;(editForm as Record<string, unknown>)[field] = value
    if (field === 'name' && typeof value === 'string' && value.trim())
        delete formErrors.name
}

function discardChanges() {
    syncFormFromEntity()
    delete formErrors.name
}

function onBack() {
    if (isDirty.value) { pendingNavAction.value = 'back'; confirmOpen.value = true }
    else void router.push({ name: APP_ROUTES.PRODUCT.TAGS.NAME })
}

function onDiscard() {
    if (isDirty.value) { pendingNavAction.value = 'discard'; confirmOpen.value = true }
    else discardChanges()
}

function onConfirmUnsaved() {
    confirmOpen.value = false
    if (pendingNavAction.value === 'back') void router.push({ name: APP_ROUTES.PRODUCT.TAGS.NAME })
    else if (pendingNavAction.value === 'discard') discardChanges()
    pendingNavAction.value = null
}

async function saveChanges() {
    if (!editForm.name?.trim()) {
        formErrors.name = 'Tên nhãn là bắt buộc'
        return
    }
    delete formErrors.name
    submitting.value = true
    try {
        const ok = await updateTag(tagId, toPayload(editForm))
        if (ok) {
            await tag.execute()
            syncFormFromEntity()
        }
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    if (isNaN(tagId)) return
    await tag.execute()
    syncFormFromEntity()
})
</script>
