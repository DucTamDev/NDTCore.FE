<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader
            title="Danh mục sản phẩm"
            subtitle="Quản lý danh mục để phân loại sản phẩm trên menu"
        >
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Sản phẩm' },
                        { title: 'Danh mục', disabled: true },
                    ]"
                />
            </template>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
                Thêm danh mục
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
                            persistent-clear
                            @update:model-value="(v) => { filterKeyword = v }"
                            @keyup.enter="onSearchClick"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-autocomplete
                            :model-value="filterParentId"
                            :items="parentOptionsWithAll"
                            item-value="id"
                            item-title="name"
                            label="Danh mục cha"
                            density="compact"
                            hide-details
                            @update:model-value="(v) => { filterParentId = v }"
                        />
                    </v-col>
                    <v-col cols="12" md="4" class="d-flex justify-end ga-2">
                        <v-btn
                            :style="{ visibility: hasActiveFilters ? 'visible' : 'hidden' }"
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

        <CategoryList
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

        <AppDialog v-model="dialogOpen" title="Thêm danh mục" :hide-actions="true" max-width="700px">
            <CategoryForm
                v-model="formModel"
                :is-submitting="isSubmitting"
                :parent-options="parentOptions"
                :edit-id="null"
                @submit="onFormSubmit"
                @cancel="dialogOpen = false"
            />
        </AppDialog>

        <AppConfirmDialog
            v-model="confirmOpen"
            title="Xoá danh mục"
            :message="`Bạn có chắc muốn xoá danh mục '${confirmItem?.name}'? Hành động này không thể hoàn tác.`"
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
import CategoryList from '../components/category/CategoryList.vue'
import CategoryForm from '../components/category/CategoryForm.vue'
import { useCategory } from '../composables/useCategory'
import { useCategoryStore } from '../stores/category.store'
import { emptyForm, toCreatePayload } from '../adapters/category.adapter'
import { CATEGORY_ROW_ACTION } from '../constants/category-list.constants'
import { APP_ROUTES } from '@/core/constants/_index'
import type { CategoryViewModel } from '../models/view-models/category.view-model'
import type { CategoryFormModel } from '../models/form-models/category.model'

const DEFAULT_PAGE_SIZE = 20

const router = useRouter()
const { items, total, isLoading, isSubmitting, loadCategories, createCategory, deleteCategory } = useCategory()
const categoryStore = useCategoryStore()

const page = ref(1)
const pageSize = ref(DEFAULT_PAGE_SIZE)
const filterKeyword = ref<string | null>(null)
const filterParentId = ref<number | null>(null)
const dialogOpen = ref(false)
const formModel = ref<CategoryFormModel>(emptyForm())
const confirmOpen = ref(false)
const confirmItem = ref<CategoryViewModel | null>(null)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

const parentOptionsWithAll = computed((): { id: number | null; name: string }[] => [
    { id: null, name: 'Tất cả' },
    ...categoryStore.items.map((c) => ({ id: c.id, name: c.name })),
])

const parentOptions = computed(() =>
    categoryStore.items.filter((c) => c.isActive).map((c) => ({ id: c.id, name: c.name })),
)

const hasActiveFilters = computed(() =>
    !!(filterKeyword.value?.trim()) || filterParentId.value !== null,
)

async function fetchData() {
    await loadCategories({
        PageNumber: page.value,
        PageSize: pageSize.value,
        Keyword: filterKeyword.value || undefined,
        ParentId: filterParentId.value,
    })
}

function onPageChange(p: number) { page.value = p; void fetchData() }

function onPageSizeChange(s: number) { pageSize.value = s; page.value = 1; void fetchData() }

function onSearchClick() { page.value = 1; void fetchData() }

function clearFilters() {
    filterKeyword.value = null
    filterParentId.value = null
    page.value = 1
    void fetchData()
}

function openCreateDialog() {
    formModel.value = emptyForm()
    dialogOpen.value = true
}

async function onFormSubmit(form: CategoryFormModel) {
    const result = await createCategory(toCreatePayload(form))
    if (result) { dialogOpen.value = false; void fetchData() }
}

function onRowAction(key: string, item: CategoryViewModel) {
    if (key === CATEGORY_ROW_ACTION.DETAIL) {
        void router.push({ name: APP_ROUTES.PRODUCT.CATEGORY_DETAIL.NAME, params: { id: item.id } })
    } else if (key === CATEGORY_ROW_ACTION.DELETE) {
        confirmItem.value = item
        confirmOpen.value = true
    }
}

async function onConfirmDelete() {
    const item = confirmItem.value
    confirmOpen.value = false
    confirmItem.value = null
    if (!item) return
    const ok = await deleteCategory(item.id)
    if (ok) void fetchData()
}

onMounted(async () => {
    await categoryStore.fetchPaged({ PageNumber: 1, PageSize: 200 })
    void fetchData()
})
</script>
