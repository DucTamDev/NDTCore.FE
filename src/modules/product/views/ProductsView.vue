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

        <!-- Filter bar -->
        <v-card rounded="lg" variant="outlined">
            <v-card-text class="pa-3">
                <v-row dense>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="filterKeyword"
                            label="Tìm kiếm tên sản phẩm"
                            prepend-inner-icon="mdi-magnify"
                            clearable density="compact" hide-details
                            @update:model-value="onFilterChange"
                            @keyup.enter="onFilterChange"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-autocomplete
                            v-model="filterCategoryId"
                            :items="categoryOptions"
                            item-value="id" item-title="name"
                            label="Danh mục"
                            clearable density="compact" hide-details
                            @update:model-value="onFilterChange"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="filterIsActive"
                            :items="statusOptions"
                            item-value="value" item-title="label"
                            label="Trạng thái"
                            clearable density="compact" hide-details
                            @update:model-value="onFilterChange"
                        />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <ProductList
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

        <AppDialog v-model="dialogOpen" title="Thêm sản phẩm" :hide-actions="true" max-width="800px">
            <ProductForm
                v-model="formModel"
                :is-submitting="isSubmitting"
                :category-options="categoryOptions"
                :edit-id="null"
                @submit="onFormSubmit"
                @cancel="dialogOpen = false"
            />
        </AppDialog>

        <AppConfirmDialog
            v-model="confirmOpen"
            title="Xoá sản phẩm"
            :message="`Bạn có chắc muốn xoá sản phẩm '${confirmItem?.name}'? Hành động này không thể hoàn tác.`"
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
import ProductList from '../components/ProductList.vue'
import ProductForm from '../components/ProductForm.vue'
import { useProduct } from '../composables/useProduct'
import { useCategoryStore } from '../stores/category.store'
import { createEmptyProductForm } from '../models/form-models/product.model'
import { PRODUCT_ROW_ACTION } from '../constants/product-list.constants'
import { APP_ROUTES } from '@/core/constants/_index'
import type { ProductViewModel } from '../models/view-models/product.view-model'
import type { CreateProductRequest } from '../models/dtos/product.dto'

const router = useRouter()
const { items, total, isLoading, isSubmitting, loadProducts, createProduct, deleteProduct } =
    useProduct()

const categoryStore = useCategoryStore()

const page = ref(1)
const pageSize = ref(20)
const filterKeyword = ref<string | null>(null)
const filterCategoryId = ref<number | null>(null)
const filterIsActive = ref<boolean | null>(null)
const dialogOpen = ref(false)
const formModel = ref(createEmptyProductForm())
const confirmOpen = ref(false)
const confirmItem = ref<ProductViewModel | null>(null)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const categoryOptions = computed(() => categoryStore.items.map((c) => ({ id: c.id, name: c.name })))

const statusOptions = [
    { label: 'Đang bán', value: true },
    { label: 'Ngừng bán', value: false },
]

function onFilterChange() { page.value = 1; void fetchData() }

async function fetchData() {
    await loadProducts({
        PageNumber: page.value,
        PageSize: pageSize.value,
        Keyword: filterKeyword.value || undefined,
        CategoryId: filterCategoryId.value,
        IsActive: filterIsActive.value,
    })
}

function onPageChange(p: number) {
    page.value = p
    void fetchData()
}

function onPageSizeChange(s: number) {
    pageSize.value = s
    page.value = 1
    void fetchData()
}

function openCreateDialog() {
    formModel.value = createEmptyProductForm()
    dialogOpen.value = true
}

function onRowAction(key: string, item: ProductViewModel) {
    if (key === PRODUCT_ROW_ACTION.DETAIL) {
        void router.push({ name: APP_ROUTES.PRODUCT.PRODUCT_DETAIL.NAME, params: { id: item.id } })
    } else if (key === PRODUCT_ROW_ACTION.DELETE) {
        confirmItem.value = item
        confirmOpen.value = true
    }
}

async function onConfirmDelete() {
    const item = confirmItem.value
    confirmOpen.value = false
    confirmItem.value = null
    if (!item) return
    const ok = await deleteProduct(item.id)
    if (ok) void fetchData()
}

async function onFormSubmit(form: typeof formModel.value) {
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
    if (result) { dialogOpen.value = false; void fetchData() }
}

onMounted(async () => {
    await categoryStore.fetchPaged({ PageNumber: 1, PageSize: 200 })
    void fetchData()
})
</script>
