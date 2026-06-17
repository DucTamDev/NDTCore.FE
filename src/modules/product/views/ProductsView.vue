<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader
            title="Sản phẩm"
            subtitle="Quản lý danh sách sản phẩm của cửa hàng"
        >
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Sản phẩm', disabled: true },
                    ]"
                />
            </template>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
                Thêm sản phẩm
            </v-btn>
        </AppPageHeader>

        <!-- Filter bar -->
        <v-card rounded="lg" elevation="1">
            <v-card-text class="pa-3">
                <v-row dense align="center">
                    <v-col cols="12" md="3">
                        <v-text-field
                            :model-value="filterKeyword"
                            label="Tìm kiếm tên sản phẩm"
                            prepend-inner-icon="mdi-magnify"
                            density="compact"
                            hide-details
                            clearable
                            persistent-clear
                            @update:model-value="(v) => { filterKeyword = v }"
                            @keyup.enter="onSearchClick"
                        />
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-autocomplete
                            :model-value="filterCategoryId"
                            :items="categoryOptionsWithAll"
                            item-value="id"
                            item-title="name"
                            label="Danh mục"
                            density="compact"
                            hide-details
                            @update:model-value="(v) => { filterCategoryId = v }"
                        />
                    </v-col>
                    <v-col cols="12" md="3">
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
                    <v-col cols="12" md="3" class="d-flex justify-end ga-2">
                        <v-btn
                            :disabled="!hasActiveFilters"
                            variant="text"
                            prepend-icon="mdi-filter-remove-outline"
                            @click="clearFilters"
                        >
                            Xóa lọc
                        </v-btn>
                        <v-btn
                            color="primary"
                            prepend-icon="mdi-magnify"
                            @click="onSearchClick"
                        >
                            Tìm kiếm
                        </v-btn>
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

        <AppDialog v-model="dialogOpen" title="Thêm sản phẩm" :hide-actions="true" max-width="1000px" height="700px" >
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
import ProductList from '../components/product/ProductList.vue'
import ProductForm from '../components/product/ProductForm.vue'
import { useProduct } from '../composables/useProduct'
import { useCategoryStore } from '../stores/category.store'
import { emptyForm, toCreatePayload } from '../adapters/product.adapter'
import { PRODUCT_ROW_ACTION } from '../constants/product-list.constants'
import { APP_ROUTES } from '@/core/constants/_index'
import type { ProductViewModel } from '../models/view-models/product.view-model'
import type { ProductFormModel } from '../models/form-models/product.model'

const DEFAULT_PAGE_SIZE = 20

const router = useRouter()
const { items, total, isLoading, isSubmitting, loadProducts, createProduct, deleteProduct } = useProduct()
const categoryStore = useCategoryStore()

const page = ref(1)
const pageSize = ref(DEFAULT_PAGE_SIZE)
const filterKeyword = ref<string | null>(null)
const filterCategoryId = ref<number | null>(null)
const filterIsActive = ref<boolean | null>(null)
const dialogOpen = ref(false)
const formModel = ref<ProductFormModel>(emptyForm())
const confirmOpen = ref(false)
const confirmItem = ref<ProductViewModel | null>(null)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

const categoryOptionsWithAll = computed((): { id: number | null; name: string }[] => [
    { id: null, name: 'Tất cả' },
    ...categoryStore.parentItems.map((c) => ({ id: c.id, name: c.name })),
])

const categoryOptions = computed(() =>
    categoryStore.parentItems.map((c) => ({ id: c.id, name: c.name })),
)

const statusOptionsWithAll = [
    { label: 'Tất cả', value: null },
    { label: 'Đang bán', value: true },
    { label: 'Ngừng bán', value: false },
]

const hasActiveFilters = computed(() =>
    !!(filterKeyword.value?.trim()) || filterCategoryId.value !== null || filterIsActive.value !== null,
)

async function fetchData() {
    await loadProducts({
        PageNumber: page.value,
        PageSize: pageSize.value,
        Keyword: filterKeyword.value || undefined,
        CategoryId: filterCategoryId.value,
        IsActive: filterIsActive.value,
    })
}

function onPageChange(p: number) { page.value = p; void fetchData() }

function onPageSizeChange(s: number) { pageSize.value = s; page.value = 1; void fetchData() }

function onSearchClick() { page.value = 1; void fetchData() }

function clearFilters() {
    filterKeyword.value = null
    filterCategoryId.value = null
    filterIsActive.value = null
    page.value = 1
    void fetchData()
}

function openCreateDialog() {
    formModel.value = emptyForm()
    dialogOpen.value = true
}

async function onFormSubmit(form: ProductFormModel) {
    const result = await createProduct(toCreatePayload(form))
    if (result) { dialogOpen.value = false; void fetchData() }
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

onMounted(async () => {
    await categoryStore.fetchParents()
    void fetchData()
})
</script>
