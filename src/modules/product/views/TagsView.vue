<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader
            title="Nhãn sản phẩm"
            subtitle="Quản lý nhãn (Best Seller, New, Seasonal…) để gắn vào sản phẩm"
        >
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Sản phẩm' },
                        { title: 'Nhãn', disabled: true },
                    ]"
                />
            </template>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
                Thêm nhãn
            </v-btn>
        </AppPageHeader>

        <!-- Filter bar -->
        <v-card rounded="lg" variant="outlined">
            <v-card-text class="pa-3">
                <v-row dense align="center">
                    <v-col cols="12" md="4">
                        <v-text-field
                            :model-value="filterKeyword"
                            label="Tìm kiếm"
                            prepend-inner-icon="mdi-magnify"
                            density="compact"
                            hide-details
                            clearable
                            @update:model-value="(v) => { filterKeyword = v }"
                            @keyup.enter="onSearchClick"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            :model-value="filterIsActive"
                            :items="statusOptionsWithAll"
                            item-value="value"
                            item-title="label"
                            label="Trạng thái"
                            density="compact"
                            hide-details
                            @update:model-value="(v) => { filterIsActive = v }"
                        />
                    </v-col>
                    <v-col cols="12" md="4" class="d-flex justify-end ga-2">
                        <v-btn
                            v-if="hasActiveFilters"
                            variant="text"
                            size="small"
                            prepend-icon="mdi-filter-remove-outline"
                            @click="clearFilters"
                        >
                            Xóa lọc
                        </v-btn>
                        <v-btn
                            color="primary"
                            variant="tonal"
                            size="small"
                            prepend-icon="mdi-magnify"
                            @click="onSearchClick"
                        >
                            Tìm kiếm
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <TagList
            :items="items"
            :loading="isLoading"
            :page-number="page"
            :page-size="pageSize"
            :total-pages="totalPages"
            :total-items="total"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
            @row-action="onRowAction"
        />

        <AppDialog v-model="dialogOpen" title="Thêm nhãn" :hide-actions="true" max-width="600px">
            <TagForm
                v-model="formModel"
                :is-submitting="isSubmitting"
                :edit-id="null"
                @submit="onFormSubmit"
                @cancel="dialogOpen = false"
            />
        </AppDialog>

        <AppConfirmDialog
            v-model="confirmOpen"
            title="Xoá nhãn"
            :message="`Bạn có chắc muốn xoá nhãn '${confirmItem?.name}'? Hành động này không thể hoàn tác.`"
            confirm-label="Xác nhận xoá"
            confirm-variant="danger"
            @confirm="onConfirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
    AppBreadcrumb,
    AppPageHeader,
    AppDialog,
    AppConfirmDialog,
} from '@/components/ui'
import TagList from '../components/TagList.vue'
import TagForm from '../components/TagForm.vue'
import { useTag } from '../composables/useTag'
import { emptyForm, toCreatePayload } from '../adapters/tag.adapter'
import { TAG_ROW_ACTION } from '../constants/tag-list.constants'
import { APP_ROUTES } from '@/core/constants/_index'
import type { TagViewModel } from '../models/view-models/tag.view-model'
import type { TagFormModel } from '../models/form-models/tag.model'

const DEFAULT_PAGE_SIZE = 20

const router = useRouter()
const { items, total, isLoading, isSubmitting, loadTags, createTag, deleteTag } = useTag()

const page = ref(1)
const pageSize = ref(DEFAULT_PAGE_SIZE)
const filterKeyword = ref<string | null>(null)
const filterIsActive = ref<boolean | null>(null)
const dialogOpen = ref(false)
const formModel = ref<TagFormModel>(emptyForm())
const confirmOpen = ref(false)
const confirmItem = ref<TagViewModel | null>(null)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

const statusOptionsWithAll = [
    { label: 'Tất cả', value: null },
    { label: 'Đang hoạt động', value: true },
    { label: 'Ngừng hoạt động', value: false },
]

const hasActiveFilters = computed(() =>
    !!(filterKeyword.value?.trim()) || filterIsActive.value !== null,
)

async function fetchData() {
    await loadTags({
        PageNumber: page.value,
        PageSize: pageSize.value,
        Keyword: filterKeyword.value || undefined,
        IsActive: filterIsActive.value,
    })
}

function onPageChange(p: number) { page.value = p; void fetchData() }

function onPageSizeChange(s: number) { pageSize.value = s; page.value = 1; void fetchData() }

function onSearchClick() { page.value = 1; void fetchData() }

function clearFilters() {
    filterKeyword.value = null
    filterIsActive.value = null
    page.value = 1
    void fetchData()
}

function openCreateDialog() {
    formModel.value = emptyForm()
    dialogOpen.value = true
}

async function onFormSubmit(form: TagFormModel) {
    const result = await createTag(toCreatePayload(form))
    if (result) { dialogOpen.value = false; void fetchData() }
}

function onRowAction(key: string, item: TagViewModel) {
    if (key === TAG_ROW_ACTION.DETAIL) {
        void router.push({ name: APP_ROUTES.PRODUCT.TAG_DETAIL.NAME, params: { id: item.id } })
    } else if (key === TAG_ROW_ACTION.DELETE) {
        confirmItem.value = item
        confirmOpen.value = true
    }
}

async function onConfirmDelete() {
    const item = confirmItem.value
    confirmOpen.value = false
    confirmItem.value = null
    if (!item) return
    const ok = await deleteTag(item.id)
    if (ok) void fetchData()
}

onMounted(() => { void fetchData() })
</script>
