<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader
            title="Nhóm danh mục"
            subtitle="Quản lý các nhóm phân loại cấp cao nhất"
        >
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Sản phẩm' },
                        { title: 'Nhóm danh mục', disabled: true },
                    ]"
                />
            </template>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
                Thêm nhóm
            </v-btn>
        </AppPageHeader>

        <!-- Filter bar -->
        <v-card rounded="lg" variant="outlined">
            <v-card-text class="pa-3">
                <v-row dense align="center">
                    <v-col cols="12" md="8">
                        <v-text-field
                            v-model="filterKeyword"
                            label="Tìm kiếm"
                            prepend-inner-icon="mdi-magnify"
                            density="compact"
                            hide-details
                            clearable
                            persistent-clear
                        />
                    </v-col>
                    <v-col cols="12" md="4" class="d-flex justify-end">
                        <v-btn
                            :style="{ visibility: filterKeyword ? 'visible' : 'hidden' }"
                            variant="text"
                            size="small"
                            prepend-icon="mdi-filter-remove-outline"
                            @click="filterKeyword = ''"
                        >
                            Xóa lọc
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <CategoryList
            :items="filteredItems"
            :loading="loading"
            :page-number="1"
            :page-size="filteredItems.length || 1"
            :total-pages="1"
            :total-items="filteredItems.length"
            @row-action="onRowAction"
        />

        <AppDialog v-model="dialogOpen" title="Thêm nhóm danh mục" :hide-actions="true" max-width="700px">
            <CategoryGroupForm
                v-model="formModel"
                :is-submitting="isSubmitting"
                :edit-id="null"
                @submit="onFormSubmit"
                @cancel="dialogOpen = false"
            />
        </AppDialog>

        <AppConfirmDialog
            v-model="confirmOpen"
            title="Xoá nhóm danh mục"
            :message="`Bạn có chắc muốn xoá nhóm '${confirmItem?.name}'? Hành động này không thể hoàn tác.`"
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
import CategoryGroupForm from '../components/category/CategoryGroupForm.vue'
import { useCategory } from '../composables/useCategory'
import { useCategoryStore } from '../stores/category.store'
import { emptyForm, toCreatePayload } from '../adapters/category.adapter'
import { CATEGORY_ROW_ACTION } from '../constants/category-list.constants'
import { APP_ROUTES } from '@/core/constants/_index'
import type { CategoryViewModel } from '../models/view-models/category.view-model'
import type { CategoryFormModel } from '../models/form-models/category.model'

const router = useRouter()
const { isSubmitting, createCategory, deleteCategory } = useCategory()
const categoryStore = useCategoryStore()

const loading = ref(false)
const filterKeyword = ref('')
const dialogOpen = ref(false)
const formModel = ref<CategoryFormModel>(emptyForm())
const confirmOpen = ref(false)
const confirmItem = ref<CategoryViewModel | null>(null)

const filteredItems = computed(() => {
    const kw = filterKeyword.value.trim().toLowerCase()
    if (!kw) return categoryStore.parentItems
    return categoryStore.parentItems.filter((c) => c.name.toLowerCase().includes(kw))
})

function openCreateDialog() {
    formModel.value = emptyForm()
    dialogOpen.value = true
}

async function onFormSubmit(form: CategoryFormModel) {
    const result = await createCategory(toCreatePayload({ ...form, parentId: null }))
    if (result) {
        dialogOpen.value = false
        await categoryStore.fetchParents()
    }
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
    if (ok) await categoryStore.fetchParents()
}

onMounted(async () => {
    loading.value = true
    try {
        await categoryStore.fetchParents()
    } finally {
        loading.value = false
    }
})
</script>
