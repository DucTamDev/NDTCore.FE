<template>
    <div class="d-flex flex-column ga-5">
        <template v-if="product.loading.value">
            <v-skeleton-loader type="heading" />
            <v-skeleton-loader type="card" height="120" />
            <v-skeleton-loader type="card" />
        </template>

        <template v-else-if="product.data.value">
            <!-- Hero header -->
            <v-card variant="tonal" color="primary" rounded="lg" flat>
                <v-card-text class="pa-5">
                    <AppBreadcrumb
                        :items="[
                            { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                            { title: 'Sản phẩm', to: { name: APP_ROUTES.PRODUCT.PRODUCTS.NAME } },
                            { title: product.data.value.name, disabled: true },
                        ]"
                    />
                    <div class="d-flex align-center ga-3 mt-3">
                        <v-sheet
                            rounded="lg"
                            width="52"
                            height="52"
                            class="d-flex align-center justify-center flex-shrink-0"
                        >
                            <v-icon icon="mdi-package-variant-closed" size="28" color="primary" />
                        </v-sheet>
                        <div>
                            <div class="text-h6 font-weight-bold">{{ product.data.value.name }}</div>
                            <div class="text-body-2 text-medium-emphasis">SKU: {{ product.data.value.sku }}</div>
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
                    <v-tab value="tags" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-tag-multiple-outline" size="18" />
                        Tags
                    </v-tab>
                    <v-tab value="option-groups" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-tune-variant" size="18" />
                        Nhóm option
                    </v-tab>
                    <v-tab value="option-configs" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-cog-outline" size="18" />
                        Cấu hình option
                    </v-tab>
                    <v-tab value="stores" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-store-outline" size="18" />
                        Cửa hàng
                    </v-tab>
                </v-tabs>
                <v-divider />
                <v-window v-model="activeTab">
                    <v-window-item value="overview">
                        <ProductOverviewTab
                            :product="product.data.value"
                            :form="editForm"
                            :errors="formErrors"
                            :is-dirty="isDirty"
                            :submitting="submitting"
                            :category-options="categoryOptions"
                            @update:form="onFormUpdate"
                            @save="saveChanges"
                            @discard="discardChanges"
                        />
                    </v-window-item>
                    <v-window-item value="tags">
                        <ProductTagsTab :product-id="productId" />
                    </v-window-item>
                    <v-window-item value="option-groups">
                        <ProductOptionGroupsTab :product-id="productId" />
                    </v-window-item>
                    <v-window-item value="option-configs">
                        <ProductOptionConfigsTab :product-id="productId" />
                    </v-window-item>
                    <v-window-item value="stores">
                        <ProductStoreOverridesTab :product-id="productId" />
                    </v-window-item>
                </v-window>
            </v-card>
        </template>

        <AppEmptyState
            v-else-if="!product.loading.value"
            icon="mdi-package-variant-closed-remove"
            title="Không tìm thấy sản phẩm"
            description="Sản phẩm này không tồn tại hoặc đã bị xóa."
        >
            <template #actions>
                <v-btn
                    color="primary"
                    prepend-icon="mdi-arrow-left"
                    :to="{ name: APP_ROUTES.PRODUCT.PRODUCTS.NAME }"
                >
                    Quay lại danh sách
                </v-btn>
            </template>
        </AppEmptyState>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppBreadcrumb, AppEmptyState } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { productService } from '../services/product.service'
import { useProduct } from '../composables/useProduct'
import { useCategoryStore } from '../stores/category.store'
import { createEmptyProductForm } from '../models/form-models/product.model'
import type { ProductFormModel } from '../models/form-models/product.model'
import type { UpdateProductRequest } from '../models/dtos/product.dto'
import ProductOverviewTab from '../components/ProductOverviewTab.vue'
import ProductTagsTab from '../components/ProductTagsTab.vue'
import ProductOptionGroupsTab from '../components/ProductOptionGroupsTab.vue'
import ProductOptionConfigsTab from '../components/ProductOptionConfigsTab.vue'
import ProductStoreOverridesTab from '../components/ProductStoreOverridesTab.vue'

const route = useRoute()
const router = useRouter()
const productId = Number(route.params['id'])

if (isNaN(productId)) {
    void router.replace({ name: APP_ROUTES.PRODUCT.PRODUCTS.NAME })
}

const activeTab = ref('overview')

const product = useAsyncState(() => productService.getByIdAsync(productId))
const { updateProduct } = useProduct()
const categoryStore = useCategoryStore()

const categoryOptions = computed(() => categoryStore.items.map((c) => ({ id: c.id, name: c.name })))

// ── Edit form & isDirty ───────────────────────────────────────
const editForm = reactive<ProductFormModel>(createEmptyProductForm())
const snapshot = ref<ProductFormModel | null>(null)
const formErrors = reactive<Partial<Record<keyof ProductFormModel, string>>>({})
const submitting = ref(false)

function syncFormFromProduct() {
    if (!product.data.value) return
    const p = product.data.value
    editForm.categoryId = p.categoryId
    editForm.sku = p.sku
    editForm.name = p.name
    editForm.slug = p.slug ?? ''
    editForm.description = p.description ?? ''
    editForm.shortDescription = p.shortDescription ?? ''
    editForm.basePrice = p.basePrice
    editForm.costPrice = p.costPrice
    editForm.isActive = p.isActive
    editForm.displayOrder = p.displayOrder
    editForm.isFeatured = p.isFeatured
    snapshot.value = { ...editForm }
}

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return (
        editForm.name !== snapshot.value.name ||
        editForm.slug !== snapshot.value.slug ||
        editForm.description !== snapshot.value.description ||
        editForm.categoryId !== snapshot.value.categoryId ||
        editForm.shortDescription !== snapshot.value.shortDescription ||
        editForm.basePrice !== snapshot.value.basePrice ||
        editForm.costPrice !== snapshot.value.costPrice ||
        editForm.isActive !== snapshot.value.isActive ||
        editForm.displayOrder !== snapshot.value.displayOrder ||
        editForm.isFeatured !== snapshot.value.isFeatured
    )
})

// ── Save / Discard ────────────────────────────────────────────
async function saveChanges() {
    if (!editForm.name?.trim()) {
        formErrors.name = 'Tên sản phẩm là bắt buộc'
        return
    }
    delete formErrors.name
    submitting.value = true
    try {
        const payload: UpdateProductRequest = {
            CategoryId: editForm.categoryId,
            Name: editForm.name.trim(),
            Slug: editForm.slug || null,
            Description: editForm.description || null,
            ShortDescription: editForm.shortDescription || null,
            BasePrice: editForm.basePrice,
            CostPrice: editForm.costPrice,
            IsActive: editForm.isActive,
            DisplayOrder: editForm.displayOrder,
            IsFeatured: editForm.isFeatured,
        }
        const ok = await updateProduct(productId, payload)
        if (ok) {
            await product.execute()
            syncFormFromProduct()
        }
    } finally {
        submitting.value = false
    }
}

function discardChanges() {
    syncFormFromProduct()
    delete formErrors.name
}

function onFormUpdate(field: keyof ProductFormModel, value: unknown) {
    ;(editForm as Record<string, unknown>)[field] = value
    if (field === 'name' && typeof value === 'string' && value.trim()) {
        delete formErrors.name
    }
}

// ── Lifecycle ─────────────────────────────────────────────────
onMounted(async () => {
    if (isNaN(productId)) return
    await categoryStore.fetchPaged({ PageNumber: 1, PageSize: 200 })
    await product.execute()
    syncFormFromProduct()
})
</script>
