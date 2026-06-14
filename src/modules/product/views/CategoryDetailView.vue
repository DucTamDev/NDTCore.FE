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
                            :entity="category.data.value"
                            :form="editForm"
                            :errors="formErrors"
                            :is-dirty="isDirty"
                            :submitting="submitting"
                            :parent-options="parentOptions"
                            @update:form="onFormUpdate"
                            @save="saveChanges"
                            @discard="onDiscard"
                            @back="onBack"
                        />
                    </v-window-item>

                    <v-window-item v-if="children.length > 0" value="children">
                        <div class="pa-4">
                            <v-progress-linear :indeterminate="childrenLoading" color="primary" :style="{ opacity: childrenLoading ? 1 : 0, transition: 'opacity 0.15s ease' }" />
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
                            <v-progress-linear :indeterminate="productsLoading" color="primary" :style="{ opacity: productsLoading ? 1 : 0, transition: 'opacity 0.15s ease' }" />
                            <v-list v-if="categoryProducts.length" density="compact">
                                <v-list-item
                                    v-for="p in categoryProducts"
                                    :key="p.id"
                                    :title="p.name"
                                    :subtitle="`${p.regularPrice.toLocaleString('vi-VN')} ₫`"
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
import { categoryService } from '../services/category.service'
import { productService } from '../services/product.service'
import { useCategory } from '../composables/useCategory'
import { toForm, toPayload, emptyForm } from '../adapters/category.adapter'
import type { CategoryFormModel } from '../models/form-models/category.model'
import type { CategoryViewModel } from '../models/view-models/category.view-model'
import CategoryList from '../components/category/CategoryList.vue'
import CategoryOverviewTab from '../components/category/CategoryOverviewTab.vue'

const route = useRoute()
const router = useRouter()
const categoryId = Number(route.params['id'])
const activeTab = ref('overview')
const submitting = ref(false)
const editForm = reactive<CategoryFormModel>(emptyForm())
const snapshot = ref<CategoryFormModel | null>(null)
const formErrors = reactive<Partial<Record<keyof CategoryFormModel, string>>>({})
const confirmOpen = ref(false)
const pendingNavAction = ref<'back' | 'discard' | null>(null)

if (isNaN(categoryId)) void router.replace({ name: APP_ROUTES.PRODUCT.CATEGORIES.NAME })

const category = useAsyncState(() => categoryService.getByIdAsync(categoryId))
const { updateCategory } = useCategory()

const TRACKED_FIELDS: ReadonlyArray<keyof CategoryFormModel> = [
    'name', 'slug', 'description', 'imageUrl', 'parentId', 'displayOrder', 'isActive',
] as const

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return TRACKED_FIELDS.some(f => editForm[f] !== snapshot.value![f])
})

function syncFormFromEntity() {
    if (!category.data.value) return
    Object.assign(editForm, toForm(category.data.value))
    snapshot.value = structuredClone(toRaw(editForm))
}

function onFormUpdate(field: keyof CategoryFormModel, value: unknown) {
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
    else void router.push({ name: APP_ROUTES.PRODUCT.CATEGORIES.NAME })
}

function onDiscard() {
    if (isDirty.value) { pendingNavAction.value = 'discard'; confirmOpen.value = true }
    else discardChanges()
}

function onConfirmUnsaved() {
    confirmOpen.value = false
    if (pendingNavAction.value === 'back') void router.push({ name: APP_ROUTES.PRODUCT.CATEGORIES.NAME })
    else if (pendingNavAction.value === 'discard') discardChanges()
    pendingNavAction.value = null
}

async function saveChanges() {
    if (!editForm.name?.trim()) {
        formErrors.name = 'Tên danh mục là bắt buộc'
        return
    }
    delete formErrors.name
    submitting.value = true
    try {
        const ok = await updateCategory(categoryId, toPayload(editForm))
        if (ok) {
            await category.execute()
            syncFormFromEntity()
        }
    } finally {
        submitting.value = false
    }
}

const parentOptions = ref<{ id: number; name: string }[]>([])

async function loadParentOptions() {
    const result = await categoryService.getPagedAsync({ PageNumber: 1, PageSize: 200, IsActive: true })
    parentOptions.value = result.items
        .filter((c) => c.id !== categoryId)
        .map((c) => ({ id: c.id, name: c.name }))
}

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

const categoryProducts = ref<{ id: number; name: string; regularPrice: number }[]>([])
const categoryProductTotal = ref(0)
const productsLoading = ref(false)

async function loadCategoryProducts() {
    productsLoading.value = true
    try {
        const result = await productService.getPagedAsync({ PageNumber: 1, PageSize: 10, CategoryId: categoryId })
        categoryProducts.value = result.items.map((p) => ({ id: p.id, name: p.name, regularPrice: p.regularPrice }))
        categoryProductTotal.value = result.totalCount
    } finally {
        productsLoading.value = false
    }
}

onMounted(async () => {
    if (isNaN(categoryId)) return
    await category.execute()
    syncFormFromEntity()
    await Promise.all([loadParentOptions(), loadChildren(), loadCategoryProducts()])
})
</script>
