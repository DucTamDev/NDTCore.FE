<template>
    <div class="d-flex flex-column ga-5">
        <template v-if="category.loading.value">
            <v-skeleton-loader type="heading" />
            <v-skeleton-loader type="card" height="120" />
            <v-skeleton-loader type="card" />
        </template>

        <template v-else-if="category.data.value">
            <!-- Hero header -->
            <v-card variant="tonal" color="primary" rounded="lg" flat>
                <v-card-text class="pa-5">
                    <AppBreadcrumb
                        :items="[
                            { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                            { title: 'Danh mục', to: { name: APP_ROUTES.PRODUCT.CATEGORIES.NAME } },
                            { title: category.data.value.name, disabled: true },
                        ]"
                    />
                    <div class="d-flex align-center ga-3 mt-3">
                        <v-sheet
                            rounded="lg"
                            width="52"
                            height="52"
                            class="d-flex align-center justify-center flex-shrink-0"
                        >
                            <v-icon icon="mdi-shape-outline" size="28" color="primary" />
                        </v-sheet>
                        <div>
                            <div class="text-h6 font-weight-bold text-high-emphasis">
                                {{ category.data.value.name }}
                            </div>
                            <div class="text-body-2 text-medium-emphasis mt-1">
                                {{ category.data.value.slug }}
                            </div>
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
                    <v-tab v-if="children.length > 0" value="children" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-sitemap-outline" size="18" />
                        Danh mục con
                    </v-tab>
                    <v-tab value="products" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-package-variant-closed" size="18" />
                        Sản phẩm
                    </v-tab>
                </v-tabs>

                <v-divider />

                <v-window v-model="activeTab">
                    <v-window-item value="overview">
                        <CategoryOverviewTab
                            :category="category.data.value"
                            :form="editForm"
                            :errors="formErrors"
                            :is-dirty="isDirty"
                            :submitting="submitting"
                            :parent-options="parentOptions"
                            @update:form="onFormUpdate"
                            @save="saveChanges"
                            @discard="discardChanges"
                        />
                    </v-window-item>

                    <v-window-item v-if="children.length > 0" value="children">
                        <div class="pa-4">
                            <v-progress-linear v-if="childrenLoading" indeterminate color="primary" class="mb-3" />
                            <CategoryList
                                :items="children"
                                :loading="childrenLoading"
                                :page-number="1"
                                :page-size="100"
                                :total-pages="1"
                                :total-items="children.length"
                                @row-action="onChildAction"
                            />
                        </div>
                    </v-window-item>

                    <v-window-item value="products">
                        <div class="pa-4">
                            <v-progress-linear v-if="productsLoading" indeterminate color="primary" class="mb-3" />
                            <v-list v-if="categoryProducts.length" density="compact">
                                <v-list-item
                                    v-for="p in categoryProducts"
                                    :key="p.id"
                                    :title="p.name"
                                    :subtitle="`${p.basePrice.toLocaleString('vi-VN')} ₫`"
                                    :to="{ name: APP_ROUTES.PRODUCT.PRODUCT_DETAIL.NAME, params: { id: p.id } }"
                                />
                            </v-list>
                            <v-alert v-else-if="!productsLoading" type="info" variant="tonal" density="compact">
                                Chưa có sản phẩm nào.
                            </v-alert>
                            <div v-if="categoryProductTotal > 10" class="d-flex justify-end mt-2">
                                <v-btn
                                    variant="text"
                                    size="small"
                                    :to="{ name: APP_ROUTES.PRODUCT.PRODUCTS.NAME }"
                                >
                                    Xem tất cả {{ categoryProductTotal }} sản phẩm →
                                </v-btn>
                            </div>
                        </div>
                    </v-window-item>
                </v-window>
            </v-card>
        </template>

        <AppEmptyState
            v-else-if="!category.loading.value"
            icon="mdi-shape-remove"
            title="Không tìm thấy danh mục"
            description="Danh mục này không tồn tại hoặc đã bị xóa."
        >
            <template #actions>
                <v-btn
                    color="primary"
                    prepend-icon="mdi-arrow-left"
                    :to="{ name: APP_ROUTES.PRODUCT.CATEGORIES.NAME }"
                >
                    Quay lại danh sách
                </v-btn>
            </template>
        </AppEmptyState>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppBreadcrumb, AppEmptyState } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { categoryService } from '../services/category.service'
import { productService } from '../services/product.service'
import { useCategory } from '../composables/useCategory'
import { createEmptyCategoryForm } from '../models/form-models/category.model'
import type { CategoryFormModel } from '../models/form-models/category.model'
import type { UpdateCategoryRequest } from '../models/dtos/category.dto'
import type { CategoryViewModel } from '../models/view-models/category.view-model'
import CategoryList from '../components/CategoryList.vue'
import CategoryOverviewTab from '../components/CategoryOverviewTab.vue'

const route = useRoute()
const router = useRouter()
const categoryId = Number(route.params['id'])
const activeTab = ref('overview')

const category = useAsyncState(() => categoryService.getByIdAsync(categoryId))
const { updateCategory } = useCategory()

// Inline edit form
const editForm = reactive<CategoryFormModel>(createEmptyCategoryForm())
const snapshot = ref<CategoryFormModel | null>(null)

function syncFormFromCategory() {
    if (!category.data.value) return
    const c = category.data.value
    editForm.name = c.name
    editForm.slug = c.slug ?? ''
    editForm.description = c.description ?? ''
    editForm.imageUrl = c.imageUrl ?? ''
    editForm.parentId = c.parentId
    editForm.displayOrder = c.displayOrder
    editForm.isActive = c.isActive
    snapshot.value = { ...editForm }
}

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return (
        editForm.name !== snapshot.value.name ||
        editForm.slug !== snapshot.value.slug ||
        editForm.description !== snapshot.value.description ||
        editForm.parentId !== snapshot.value.parentId ||
        editForm.displayOrder !== snapshot.value.displayOrder ||
        editForm.isActive !== snapshot.value.isActive ||
        editForm.imageUrl !== snapshot.value.imageUrl
    )
})

const formErrors = reactive<Partial<Record<keyof CategoryFormModel, string>>>({})

function onFormUpdate(field: keyof CategoryFormModel, value: unknown) {
    ;(editForm as Record<string, unknown>)[field] = value
    if (field === 'name' && typeof value === 'string' && value.trim()) {
        delete formErrors.name
    }
}

// Save / Discard
const submitting = ref(false)

function discardChanges() {
    syncFormFromCategory()
    formErrors.name = undefined
}

async function saveChanges() {
    formErrors.name = editForm.name?.trim() ? undefined : 'Tên danh mục là bắt buộc'
    if (formErrors.name) return

    submitting.value = true
    try {
        const payload: UpdateCategoryRequest = {
            Name: editForm.name.trim(),
            Slug: editForm.slug || null,
            Description: editForm.description || null,
            ImageUrl: editForm.imageUrl || null,
            ParentId: editForm.parentId,
            DisplayOrder: editForm.displayOrder,
            IsActive: editForm.isActive,
        }
        const ok = await updateCategory(categoryId, payload)
        if (ok) {
            await category.execute()
            syncFormFromCategory()
        }
    } finally {
        submitting.value = false
    }
}

// Parent options (all categories except self)
const parentOptions = ref<{ id: number; name: string }[]>([])

async function loadParentOptions() {
    const result = await categoryService.getPagedAsync({ PageNumber: 1, PageSize: 200, IsActive: true })
    parentOptions.value = result.items
        .filter((c) => c.id !== categoryId)
        .map((c) => ({ id: c.id, name: c.name }))
}

// Children
const children = ref<CategoryViewModel[]>([])
const childrenLoading = ref(false)

async function loadChildren() {
    childrenLoading.value = true
    try {
        const result = await categoryService.getPagedAsync({ PageNumber: 1, PageSize: 100, ParentId: categoryId })
        children.value = result.items
    } finally {
        childrenLoading.value = false
    }
}

function onChildAction(key: string, item: CategoryViewModel) {
    if (key === 'detail') {
        void router.push({ name: APP_ROUTES.PRODUCT.CATEGORY_DETAIL.NAME, params: { id: item.id } })
    }
}

// Category products
const categoryProducts = ref<{ id: number; name: string; basePrice: number }[]>([])
const categoryProductTotal = ref(0)
const productsLoading = ref(false)

async function loadCategoryProducts() {
    productsLoading.value = true
    try {
        const result = await productService.getPagedAsync({
            PageNumber: 1,
            PageSize: 10,
            CategoryId: categoryId,
        })
        categoryProducts.value = result.items.map((p) => ({
            id: p.id,
            name: p.name,
            basePrice: p.basePrice,
        }))
        categoryProductTotal.value = result.totalCount
    } finally {
        productsLoading.value = false
    }
}

onMounted(async () => {
    await category.execute()
    syncFormFromCategory()
    await Promise.all([loadParentOptions(), loadChildren(), loadCategoryProducts()])
})
</script>
