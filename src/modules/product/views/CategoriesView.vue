<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader
            title="Danh mục sản phẩm"
            subtitle="Quản lý danh mục để phân loại sản phẩm trên menu"
        >
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: '/admin' },
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
                <v-row dense>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="filterKeyword"
                            label="Tìm kiếm theo tên"
                            prepend-inner-icon="mdi-magnify"
                            clearable
                            density="compact"
                            hide-details
                            @update:model-value="onFilterChange"
                            @keyup.enter="onFilterChange"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-autocomplete
                            v-model="filterParentId"
                            :items="allCategoryOptions"
                            item-value="id"
                            item-title="name"
                            label="Lọc theo danh mục cha"
                            clearable
                            density="compact"
                            hide-details
                            @update:model-value="onFilterChange"
                        />
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
import CategoryList from '../components/CategoryList.vue'
import CategoryForm from '../components/CategoryForm.vue'
import { useCategory } from '../composables/useCategory'
import { createEmptyCategoryForm } from '../models/form-models/category.model'
import { CATEGORY_ROW_ACTION } from '../constants/category-list.constants'
import { APP_ROUTES } from '@/core/constants/_index'
import type { CategoryViewModel } from '../models/view-models/category.view-model'
import type { CreateCategoryRequest } from '../models/dtos/category.dto'

const router = useRouter()

const { items, total, isLoading, isSubmitting, loadCategories, createCategory, deleteCategory } = useCategory()

const page = ref(1)
const pageSize = ref(20)
const filterParentId = ref<number | null>(null)
const filterKeyword = ref<string | null>(null)
const dialogOpen = ref(false)
const formModel = ref(createEmptyCategoryForm())
const confirmOpen = ref(false)
const confirmItem = ref<CategoryViewModel | null>(null)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const allCategoryOptions = computed(() => items.value.map((c) => ({ id: c.id, name: c.name })))
const parentOptions = computed(() => items.value.filter((c) => c.isActive).map((c) => ({ id: c.id, name: c.name })))

function onFilterChange() { page.value = 1; fetchData() }

async function fetchData() {
    await loadCategories({
        PageNumber: page.value,
        PageSize: pageSize.value,
        ParentId: filterParentId.value,
        Keyword: filterKeyword.value || undefined,
    })
}

function onPageChange(p: number) {
    page.value = p
    fetchData()
}

function onPageSizeChange(s: number) {
    pageSize.value = s
    page.value = 1
    fetchData()
}

async function onRowAction(key: string, item: CategoryViewModel) {
    if (key === CATEGORY_ROW_ACTION.DETAIL) {
        void router.push({ name: APP_ROUTES.PRODUCT.CATEGORY_DETAIL.NAME, params: { id: item.id } })
    } else if (key === CATEGORY_ROW_ACTION.DELETE) {
        confirmItem.value = item
        confirmOpen.value = true
    }
}

function openCreateDialog() {
    formModel.value = createEmptyCategoryForm()
    dialogOpen.value = true
}

async function onFormSubmit(form: typeof formModel.value) {
    const payload: CreateCategoryRequest = {
        Name: form.name,
        Slug: form.slug || null,
        Description: form.description || null,
        ImageUrl: form.imageUrl || null,
        ParentId: form.parentId,
        DisplayOrder: form.displayOrder,
        IsActive: form.isActive,
    }
    const result = await createCategory(payload)
    if (result) { dialogOpen.value = false; fetchData() }
}

async function onConfirmDelete() {
    if (!confirmItem.value) return
    const ok = await deleteCategory(confirmItem.value.id)
    if (ok) fetchData()
    confirmItem.value = null
}

onMounted(fetchData)
</script>
