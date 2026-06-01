<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader
            title="Sản phẩm"
            subtitle="Quản lý danh sách sản phẩm của cửa hàng"
        >
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: '/admin' },
                        { title: 'Sản phẩm', disabled: true },
                    ]"
                />
            </template>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
                Thêm sản phẩm
            </v-btn>
        </AppPageHeader>

        <ProductList
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

        <AppDialog v-model="dialogOpen" :title="dialogTitle" max-width="800px">
            <ProductForm
                v-model="formModel"
                :is-submitting="isSubmitting"
                :category-options="categoryOptions"
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
import ProductList from '../components/ProductList.vue'
import ProductForm from '../components/ProductForm.vue'
import { useProduct } from '../composables/useProduct'
import { useCategoryStore } from '../stores/category.store'
import { createEmptyProductForm } from '../models/form-models/product.model'
import { PRODUCT_ROW_ACTION } from '../constants/product-list.constants'
import type { ProductViewModel } from '../models/view-models/product.view-model'
import type { CreateProductRequest, UpdateProductRequest } from '../models/dtos/product.dto'

const { items, total, isLoading, isSubmitting, loadProducts, createProduct, updateProduct, deleteProduct } =
    useProduct()

const categoryStore = useCategoryStore()

const page = ref(1)
const pageSize = ref(20)
const dialogOpen = ref(false)
const editId = ref<number | null>(null)
const formModel = ref(createEmptyProductForm())

const dialogTitle = computed(() => (editId.value ? 'Sửa sản phẩm' : 'Thêm sản phẩm'))
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const categoryOptions = computed(() => categoryStore.items.map((c) => ({ id: c.id, name: c.name })))

async function fetchData() {
    await loadProducts({ PageNumber: page.value, PageSize: pageSize.value })
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
    formModel.value = createEmptyProductForm()
    dialogOpen.value = true
}

function openEditDialog(item: ProductViewModel) {
    editId.value = item.id
    formModel.value = {
        categoryId: item.categoryId,
        sku: item.sku,
        name: item.name,
        slug: item.slug ?? '',
        description: item.description ?? '',
        shortDescription: item.shortDescription ?? '',
        basePrice: item.basePrice,
        costPrice: item.costPrice,
        isActive: item.isActive,
        displayOrder: item.displayOrder,
        isFeatured: item.isFeatured,
    }
    dialogOpen.value = true
}

async function onRowAction(key: string, item: ProductViewModel) {
    if (key === PRODUCT_ROW_ACTION.EDIT) {
        openEditDialog(item)
    } else if (key === PRODUCT_ROW_ACTION.DELETE) {
        const ok = await deleteProduct(item.id)
        if (ok) fetchData()
    }
}

async function onFormSubmit(form: typeof formModel.value) {
    if (editId.value) {
        const payload: UpdateProductRequest = {
            CategoryId: form.categoryId,
            Name: form.name,
            Slug: form.slug || null,
            Description: form.description || null,
            ShortDescription: form.shortDescription || null,
            BasePrice: form.basePrice,
            CostPrice: form.costPrice,
            IsActive: form.isActive,
            DisplayOrder: form.displayOrder,
            IsFeatured: form.isFeatured,
        }
        const ok = await updateProduct(editId.value, payload)
        if (ok) { dialogOpen.value = false; fetchData() }
    } else {
        const payload: CreateProductRequest = {
            CategoryId: form.categoryId,
            Sku: form.sku,
            Name: form.name,
            Slug: form.slug || null,
            Description: form.description || null,
            ShortDescription: form.shortDescription || null,
            BasePrice: form.basePrice,
            CostPrice: form.costPrice,
            IsActive: form.isActive,
            DisplayOrder: form.displayOrder,
            IsFeatured: form.isFeatured,
        }
        const result = await createProduct(payload)
        if (result) { dialogOpen.value = false; fetchData() }
    }
}

onMounted(async () => {
    await categoryStore.fetchPaged({ PageNumber: 1, PageSize: 200 })
    fetchData()
})
</script>
