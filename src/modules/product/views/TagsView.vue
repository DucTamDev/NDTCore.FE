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
            @create="openCreateDialog"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
            @row-action="onRowAction"
        />

        <AppDialog v-model="dialogOpen" :title="dialogTitle" max-width="600px">
            <TagForm
                v-model="formModel"
                :is-submitting="isSubmitting"
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
import TagList from '../components/TagList.vue'
import TagForm from '../components/TagForm.vue'
import { useTag } from '../composables/useTag'
import { createEmptyTagForm } from '../models/form-models/tag.model'
import { TAG_ROW_ACTION } from '../constants/tag-list.constants'
import type { TagViewModel } from '../models/view-models/tag.view-model'
import type { CreateTagRequest, UpdateTagRequest } from '../models/dtos/tag.dto'

const { items, total, isLoading, isSubmitting, loadTags, createTag, updateTag, deleteTag } = useTag()

const page = ref(1)
const pageSize = ref(20)
const dialogOpen = ref(false)
const editId = ref<number | null>(null)
const formModel = ref(createEmptyTagForm())

const dialogTitle = computed(() => (editId.value ? 'Sửa nhãn' : 'Thêm nhãn'))
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

function openCreateDialog() {
    editId.value = null
    formModel.value = createEmptyTagForm()
    dialogOpen.value = true
}

function openEditDialog(item: TagViewModel) {
    editId.value = item.id
    formModel.value = {
        name: item.name,
        textColor: item.textColor ?? '',
        colorHex: item.colorHex ?? '',
        iconUrl: item.iconUrl ?? '',
        displayOrder: item.displayOrder,
        isActive: item.isActive,
    }
    dialogOpen.value = true
}

async function onRowAction(key: string, item: TagViewModel) {
    if (key === TAG_ROW_ACTION.EDIT) {
        openEditDialog(item)
    } else if (key === TAG_ROW_ACTION.DELETE) {
        const ok = await deleteTag(item.id)
        if (ok) fetchData()
    }
}

async function onFormSubmit(form: typeof formModel.value) {
    if (editId.value) {
        const payload: UpdateTagRequest = {
            Name: form.name,
            TextColor: form.textColor || null,
            ColorHex: form.colorHex || null,
            IconUrl: form.iconUrl || null,
            DisplayOrder: form.displayOrder,
            IsActive: form.isActive,
        }
        const ok = await updateTag(editId.value, payload)
        if (ok) { dialogOpen.value = false; fetchData() }
    } else {
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
}

onMounted(fetchData)
</script>
