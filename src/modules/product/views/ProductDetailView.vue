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
                            <div class="text-h6 font-weight-bold text-high-emphasis">{{ product.data.value.name }}</div>
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
                            :entity="product.data.value"
                            :form="editForm"
                            :errors="formErrors"
                            :is-dirty="isDirty"
                            :submitting="submitting"
                            :category-options="categoryOptions"
                            @update:form="onFormUpdate"
                            @save="saveChanges"
                            @discard="onDiscard"
                            @back="onBack"
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
import { ref, reactive, computed, onMounted, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppBreadcrumb, AppEmptyState, AppConfirmDialog } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { productService } from '../services/product.service'
import { useProduct } from '../composables/useProduct'
import { useCategoryStore } from '../stores/category.store'
import { toForm, toPayload, emptyForm } from '../adapters/product.adapter'
import type { ProductFormModel } from '../models/form-models/product.model'
import ProductOverviewTab from '../components/product/ProductOverviewTab.vue'
import ProductTagsTab from '../components/product/ProductTagsTab.vue'
import ProductOptionGroupsTab from '../components/product/ProductOptionGroupsTab.vue'
import ProductOptionConfigsTab from '../components/product/ProductOptionConfigsTab.vue'
import ProductStoreOverridesTab from '../components/product/ProductStoreOverridesTab.vue'

const route = useRoute()
const router = useRouter()
const productId = Number(route.params['id'])
const activeTab = ref('overview')
const submitting = ref(false)
const editForm = reactive<ProductFormModel>(emptyForm())
const snapshot = ref<ProductFormModel | null>(null)
const formErrors = reactive<Partial<Record<keyof ProductFormModel, string>>>({})
const confirmOpen = ref(false)
const pendingNavAction = ref<'back' | 'discard' | null>(null)

if (isNaN(productId)) void router.replace({ name: APP_ROUTES.PRODUCT.PRODUCTS.NAME })

const product = useAsyncState(() => productService.getByIdAsync(productId))
const { updateProduct } = useProduct()
const categoryStore = useCategoryStore()

const categoryOptions = computed(() => categoryStore.parentItems.map((c) => ({ id: c.id, name: c.name })))

const TRACKED_FIELDS: ReadonlyArray<keyof ProductFormModel> = [
    'name', 'slug', 'description', 'shortDescription', 'categoryId',
    'regularPrice', 'costPrice', 'isActive', 'displayOrder',
] as const

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return TRACKED_FIELDS.some(f => editForm[f] !== snapshot.value![f])
})

function syncFormFromEntity() {
    if (!product.data.value) return
    Object.assign(editForm, toForm(product.data.value))
    snapshot.value = structuredClone(toRaw(editForm))
}

function onFormUpdate(field: keyof ProductFormModel, value: unknown) {
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
    else void router.push({ name: APP_ROUTES.PRODUCT.PRODUCTS.NAME })
}

function onDiscard() {
    if (isDirty.value) { pendingNavAction.value = 'discard'; confirmOpen.value = true }
    else discardChanges()
}

function onConfirmUnsaved() {
    confirmOpen.value = false
    if (pendingNavAction.value === 'back') void router.push({ name: APP_ROUTES.PRODUCT.PRODUCTS.NAME })
    else if (pendingNavAction.value === 'discard') discardChanges()
    pendingNavAction.value = null
}

async function saveChanges() {
    if (!editForm.name?.trim()) {
        formErrors.name = 'Tên sản phẩm là bắt buộc'
        return
    }
    delete formErrors.name
    submitting.value = true
    try {
        const ok = await updateProduct(productId, toPayload(editForm))
        if (ok) {
            await product.execute()
            syncFormFromEntity()
        }
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    if (isNaN(productId)) return
    await categoryStore.fetchParents()
    await product.execute()
    syncFormFromEntity()
})
</script>
