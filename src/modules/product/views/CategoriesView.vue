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

        <CategoryList
            :items="items"
            :loading="isLoading"
            :page-number="page"
            :page-size="pageSize"
            :total-pages="totalPages"
            :total-items="total"
            @create="openCreateDialog"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
            @row-action="onRowAction"
        />

        <AppDialog v-model="dialogOpen" :title="dialogTitle" max-width="700px">
            <CategoryForm
                v-model="formModel"
                :is-submitting="isSubmitting"
                :parent-options="parentOptions"
                :edit-id="editId"
                @submit="onFormSubmit"
                @cancel="dialogOpen = false"
            />
        </AppDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
    AppBreadcrumb,
    AppPageHeader,
    AppDialog,
} from '@/components/ui'
import CategoryList from '../components/CategoryList.vue'
import CategoryForm from '../components/CategoryForm.vue'
import { useCategory } from '../composables/useCategory'
import { createEmptyCategoryForm } from '../models/form-models/category.model'
import { CATEGORY_ROW_ACTION } from '../constants/category-list.constants'
import type { CategoryViewModel } from '../models/view-models/category.view-model'
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../models/dtos/category.dto'

const { items, total, isLoading, isSubmitting, loadCategories, createCategory, updateCategory, deleteCategory } =
    useCategory()

const page = ref(1)
const pageSize = ref(20)
const dialogOpen = ref(false)
const editId = ref<number | null>(null)
const formModel = ref(createEmptyCategoryForm())

const dialogTitle = computed(() => (editId.value ? 'Sửa danh mục' : 'Thêm danh mục'))
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const parentOptions = computed(() => items.value.map((c) => ({ id: c.id, name: c.name })))

async function fetchData() {
    await loadCategories({ PageNumber: page.value, PageSize: pageSize.value })
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

function openCreateDialog() {
    editId.value = null
    formModel.value = createEmptyCategoryForm()
    dialogOpen.value = true
}

function openEditDialog(item: CategoryViewModel) {
    editId.value = item.id
    formModel.value = {
        name: item.name,
        slug: item.slug ?? '',
        description: item.description ?? '',
        imageUrl: item.imageUrl ?? '',
        parentId: item.parentId,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
    }
    dialogOpen.value = true
}

async function onRowAction(key: string, item: CategoryViewModel) {
    if (key === CATEGORY_ROW_ACTION.EDIT) {
        openEditDialog(item)
    } else if (key === CATEGORY_ROW_ACTION.DELETE) {
        const ok = await deleteCategory(item.id)
        if (ok) fetchData()
    }
}

async function onFormSubmit(form: typeof formModel.value) {
    if (editId.value) {
        const payload: UpdateCategoryRequest = {
            Name: form.name,
            Slug: form.slug || null,
            Description: form.description || null,
            ImageUrl: form.imageUrl || null,
            ParentId: form.parentId,
            DisplayOrder: form.displayOrder,
            IsActive: form.isActive,
        }
        const ok = await updateCategory(editId.value, payload)
        if (ok) { dialogOpen.value = false; fetchData() }
    } else {
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
}

onMounted(fetchData)
</script>
