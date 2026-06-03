<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader
            title="Nhóm option"
            subtitle="Quản lý nhóm option để cấu hình lựa chọn cho sản phẩm"
        >
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: '/admin' },
                        { title: 'Sản phẩm' },
                        { title: 'Nhóm option', disabled: true },
                    ]"
                />
            </template>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
                Thêm nhóm
            </v-btn>
        </AppPageHeader>

        <OptionGroupList
            :items="groupItems"
            :loading="groupIsLoading"
            :page-number="groupPage"
            :page-size="groupPageSize"
            :total-pages="groupTotalPages"
            :total-items="groupTotal"
            @page-change="onGroupPageChange"
            @page-size-change="onGroupPageSizeChange"
            @row-action="onGroupRowAction"
        />

        <AppDialog v-model="dialogOpen" title="Thêm nhóm option" :hide-actions="true" max-width="700px">
            <OptionGroupForm
                v-model="formModel"
                :is-submitting="isSubmitting"
                :edit-id="null"
                @submit="onFormSubmit"
                @cancel="dialogOpen = false"
            />
        </AppDialog>

        <AppConfirmDialog
            v-model="confirmGroupOpen"
            title="Xoá nhóm option"
            :message="`Bạn có chắc muốn xoá nhóm '${confirmGroupItem?.name}'? Hành động này không thể hoàn tác.`"
            confirm-label="Xác nhận xoá"
            confirm-variant="danger"
            @confirm="onConfirmGroupDelete"
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
import OptionGroupList from '../components/OptionGroupList.vue'
import OptionGroupForm from '../components/OptionGroupForm.vue'
import { useOptionGroup } from '../composables/useOptionGroup'
import { createEmptyOptionGroupForm } from '../models/form-models/option-group.model'
import { OPTION_GROUP_ROW_ACTION } from '../constants/option-group-list.constants'
import { APP_ROUTES } from '@/core/constants/_index'
import type { OptionGroupViewModel } from '../models/view-models/option-group.view-model'
import type { CreateOptionGroupRequest } from '../models/dtos/option-group.dto'

const router = useRouter()

const {
    items: groupItems,
    total: groupTotal,
    isLoading: groupIsLoading,
    isSubmitting,
    loadOptionGroups,
    createOptionGroup,
    deleteOptionGroup,
} = useOptionGroup()

const groupPage = ref(1)
const groupPageSize = ref(20)
const dialogOpen = ref(false)
const formModel = ref(createEmptyOptionGroupForm())
const confirmGroupOpen = ref(false)
const confirmGroupItem = ref<OptionGroupViewModel | null>(null)

const groupTotalPages = computed(() => Math.max(1, Math.ceil(groupTotal.value / groupPageSize.value)))

async function fetchGroupData() {
    await loadOptionGroups({ PageNumber: groupPage.value, PageSize: groupPageSize.value })
}

function onGroupPageChange(p: number) {
    groupPage.value = p
    void fetchGroupData()
}

function onGroupPageSizeChange(s: number) {
    groupPageSize.value = s
    groupPage.value = 1
    void fetchGroupData()
}

function openCreateDialog() {
    formModel.value = createEmptyOptionGroupForm()
    dialogOpen.value = true
}

async function onFormSubmit(form: typeof formModel.value) {
    const payload: CreateOptionGroupRequest = {
        Name: form.name,
        UiType: form.uiType,
        Description: form.description || null,
        DisplayOrder: form.displayOrder,
        IsActive: form.isActive,
    }
    const result = await createOptionGroup(payload)
    if (result) { dialogOpen.value = false; void fetchGroupData() }
}

function onGroupRowAction(key: string, item: OptionGroupViewModel) {
    if (key === OPTION_GROUP_ROW_ACTION.DETAIL) {
        void router.push({ name: APP_ROUTES.PRODUCT.OPTION_GROUP_DETAIL.NAME, params: { id: item.id } })
    } else if (key === OPTION_GROUP_ROW_ACTION.DELETE) {
        confirmGroupItem.value = item
        confirmGroupOpen.value = true
    }
}

async function onConfirmGroupDelete() {
    const item = confirmGroupItem.value
    confirmGroupOpen.value = false
    confirmGroupItem.value = null
    if (!item) return
    const ok = await deleteOptionGroup(item.id)
    if (ok) void fetchGroupData()
}

onMounted(fetchGroupData)
</script>
