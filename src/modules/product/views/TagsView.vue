<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader
            title="Nhãn sản phẩm"
            subtitle="Quản lý nhãn (Best Seller, New, Seasonal…) để gắn vào sản phẩm"
        >
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: '/admin' },
                        { title: 'Sản phẩm' },
                        { title: 'Nhãn', disabled: true },
                    ]"
                />
            </template>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
                Thêm nhãn
            </v-btn>
        </AppPageHeader>

        <TagList
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

        <AppDialog v-model="dialogOpen" title="Thêm nhãn" :hide-actions="true" max-width="600px">
            <TagForm
                v-model="formModel"
                :is-submitting="isSubmitting"
                :edit-id="null"
                @submit="onFormSubmit"
                @cancel="dialogOpen = false"
            />
        </AppDialog>

        <AppConfirmDialog
            v-model="confirmOpen"
            title="Xoá nhãn"
            :message="`Bạn có chắc muốn xoá nhãn '${confirmItem?.name}'? Hành động này không thể hoàn tác.`"
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
import TagList from '../components/TagList.vue'
import TagForm from '../components/TagForm.vue'
import { useTag } from '../composables/useTag'
import { createEmptyTagForm } from '../models/form-models/tag.model'
import { TAG_ROW_ACTION } from '../constants/tag-list.constants'
import { APP_ROUTES } from '@/core/constants/_index'
import type { TagViewModel } from '../models/view-models/tag.view-model'
import type { CreateTagRequest } from '../models/dtos/tag.dto'

const router = useRouter()
const { items, total, isLoading, isSubmitting, loadTags, createTag, deleteTag } = useTag()

const page = ref(1)
const pageSize = ref(20)
const dialogOpen = ref(false)
const formModel = ref(createEmptyTagForm())
const confirmOpen = ref(false)
const confirmItem = ref<TagViewModel | null>(null)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

async function fetchData() {
    await loadTags({ PageNumber: page.value, PageSize: pageSize.value })
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

function onRowAction(key: string, item: TagViewModel) {
    if (key === TAG_ROW_ACTION.DETAIL) {
        void router.push({ name: APP_ROUTES.PRODUCT.TAG_DETAIL.NAME, params: { id: item.id } })
    } else if (key === TAG_ROW_ACTION.DELETE) {
        confirmItem.value = item
        confirmOpen.value = true
    }
}

function openCreateDialog() {
    formModel.value = createEmptyTagForm()
    dialogOpen.value = true
}

async function onFormSubmit(form: typeof formModel.value) {
    const payload: CreateTagRequest = {
        Name: form.name,
        TextColor: form.textColor || null,
        ColorHex: form.colorHex || null,
        IconUrl: form.iconUrl || null,
        DisplayOrder: form.displayOrder,
        IsActive: form.isActive,
    }
    const result = await createTag(payload)
    if (result) { dialogOpen.value = false; fetchData() }
}

async function onConfirmDelete() {
    if (!confirmItem.value) return
    const ok = await deleteTag(confirmItem.value.id)
    confirmOpen.value = false
    confirmItem.value = null
    if (ok) fetchData()
}

onMounted(fetchData)
</script>
