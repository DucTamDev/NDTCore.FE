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
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateGroupDialog">
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
            @create="openCreateGroupDialog"
            @page-change="onGroupPageChange"
            @page-size-change="onGroupPageSizeChange"
            @row-action="onGroupRowAction"
            @row-select="onGroupRowSelect"
        />

        <template v-if="selectedGroup">
            <v-card rounded="lg" color="surface-variant" variant="tonal">
                <v-card-title class="d-flex align-center ga-2 pa-4">
                    <v-icon icon="mdi-checkbox-multiple-marked-outline" />
                    <span>Options của nhóm: <strong>{{ selectedGroup.name }}</strong></span>
                    <v-spacer />
                    <v-btn
                        color="primary"
                        prepend-icon="mdi-plus"
                        size="small"
                        @click="openCreateOptionDialog"
                    >
                        Thêm option
                    </v-btn>
                    <v-btn
                        icon="mdi-close"
                        variant="text"
                        size="small"
                        @click="selectedGroup = null"
                    />
                </v-card-title>
            </v-card>

            <OptionList
                :items="optionItems"
                :loading="optionIsLoading"
                :page-number="optionPage"
                :page-size="optionPageSize"
                :total-pages="optionTotalPages"
                :total-items="optionTotal"
                @create="openCreateOptionDialog"
                @page-change="onOptionPageChange"
                @page-size-change="onOptionPageSizeChange"
                @row-action="onOptionRowAction"
            />
        </template>

        <AppDialog v-model="groupDialogOpen" :title="groupDialogTitle" max-width="700px">
            <OptionGroupForm
                v-model="groupFormModel"
                :is-submitting="groupIsSubmitting"
                :edit-id="groupEditId"
                @submit="onGroupFormSubmit"
                @cancel="groupDialogOpen = false"
            />
        </AppDialog>

        <AppDialog v-model="optionDialogOpen" :title="optionDialogTitle" max-width="700px">
            <OptionForm
                v-model="optionFormModel"
                :is-submitting="optionIsSubmitting"
                :edit-id="optionEditId"
                @submit="onOptionFormSubmit"
                @cancel="optionDialogOpen = false"
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
import OptionGroupList from '../components/OptionGroupList.vue'
import OptionGroupForm from '../components/OptionGroupForm.vue'
import OptionList from '../components/OptionList.vue'
import OptionForm from '../components/OptionForm.vue'
import { useOptionGroup } from '../composables/useOptionGroup'
import { useOption } from '../composables/useOption'
import { createEmptyOptionGroupForm } from '../models/form-models/option-group.model'
import { createEmptyOptionForm } from '../models/form-models/option.model'
import { OPTION_GROUP_ROW_ACTION } from '../constants/option-group-list.constants'
import { OPTION_ROW_ACTION } from '../constants/option-list.constants'
import type { OptionGroupViewModel } from '../models/view-models/option-group.view-model'
import type { OptionViewModel } from '../models/view-models/option.view-model'
import type { CreateOptionGroupRequest, UpdateOptionGroupRequest } from '../models/dtos/option-group.dto'
import type { CreateOptionRequest, UpdateOptionRequest } from '../models/dtos/option.dto'

// Option Groups
const {
    items: groupItems,
    total: groupTotal,
    isLoading: groupIsLoading,
    isSubmitting: groupIsSubmitting,
    loadOptionGroups,
    createOptionGroup,
    updateOptionGroup,
    deleteOptionGroup,
} = useOptionGroup()

const groupPage = ref(1)
const groupPageSize = ref(20)
const groupDialogOpen = ref(false)
const groupEditId = ref<number | null>(null)
const groupFormModel = ref(createEmptyOptionGroupForm())
const selectedGroup = ref<OptionGroupViewModel | null>(null)

const groupDialogTitle = computed(() => (groupEditId.value ? 'Sửa nhóm option' : 'Thêm nhóm option'))
const groupTotalPages = computed(() => Math.max(1, Math.ceil(groupTotal.value / groupPageSize.value)))

// Options
const {
    items: optionItems,
    total: optionTotal,
    isLoading: optionIsLoading,
    isSubmitting: optionIsSubmitting,
    loadOptions,
    createOption,
    updateOption,
    deleteOption,
} = useOption()

const optionPage = ref(1)
const optionPageSize = ref(20)
const optionDialogOpen = ref(false)
const optionEditId = ref<number | null>(null)
const optionFormModel = ref(createEmptyOptionForm())

const optionDialogTitle = computed(() => (optionEditId.value ? 'Sửa option' : 'Thêm option'))
const optionTotalPages = computed(() => Math.max(1, Math.ceil(optionTotal.value / optionPageSize.value)))

// Group handlers
async function fetchGroupData() {
    await loadOptionGroups({ PageNumber: groupPage.value, PageSize: groupPageSize.value })
}

function onGroupPageChange(p: number) {
    groupPage.value = p
    fetchGroupData()
}

function onGroupPageSizeChange(s: number) {
    groupPageSize.value = s
    groupPage.value = 1
    fetchGroupData()
}

function openCreateGroupDialog() {
    groupEditId.value = null
    groupFormModel.value = createEmptyOptionGroupForm()
    groupDialogOpen.value = true
}

function openEditGroupDialog(item: OptionGroupViewModel) {
    groupEditId.value = item.id
    groupFormModel.value = {
        name: item.name,
        uiType: item.uiType,
        description: item.description ?? '',
        displayOrder: item.displayOrder,
        isActive: item.isActive,
    }
    groupDialogOpen.value = true
}

async function onGroupRowAction(key: string, item: OptionGroupViewModel) {
    if (key === OPTION_GROUP_ROW_ACTION.EDIT) {
        openEditGroupDialog(item)
    } else if (key === OPTION_GROUP_ROW_ACTION.DELETE) {
        const ok = await deleteOptionGroup(item.id)
        if (ok) {
            if (selectedGroup.value?.id === item.id) selectedGroup.value = null
            fetchGroupData()
        }
    }
}

async function onGroupRowSelect(item: OptionGroupViewModel) {
    selectedGroup.value = item
    optionPage.value = 1
    await fetchOptionData()
}

async function onGroupFormSubmit(form: typeof groupFormModel.value) {
    if (groupEditId.value) {
        const payload: UpdateOptionGroupRequest = {
            Name: form.name,
            UiType: form.uiType,
            Description: form.description || null,
            DisplayOrder: form.displayOrder,
            IsActive: form.isActive,
        }
        const ok = await updateOptionGroup(groupEditId.value, payload)
        if (ok) { groupDialogOpen.value = false; fetchGroupData() }
    } else {
        const payload: CreateOptionGroupRequest = {
            Name: form.name,
            UiType: form.uiType,
            Description: form.description || null,
            DisplayOrder: form.displayOrder,
            IsActive: form.isActive,
        }
        const result = await createOptionGroup(payload)
        if (result) { groupDialogOpen.value = false; fetchGroupData() }
    }
}

// Option handlers
async function fetchOptionData() {
    if (!selectedGroup.value) return
    await loadOptions({
        PageNumber: optionPage.value,
        PageSize: optionPageSize.value,
        GroupId: selectedGroup.value.id,
    })
}

function onOptionPageChange(p: number) {
    optionPage.value = p
    fetchOptionData()
}

function onOptionPageSizeChange(s: number) {
    optionPageSize.value = s
    optionPage.value = 1
    fetchOptionData()
}

function openCreateOptionDialog() {
    optionEditId.value = null
    optionFormModel.value = createEmptyOptionForm(selectedGroup.value?.id)
    optionDialogOpen.value = true
}

function openEditOptionDialog(item: OptionViewModel) {
    optionEditId.value = item.id
    optionFormModel.value = {
        groupId: item.groupId,
        name: item.name,
        defaultPrice: item.defaultPrice,
        description: item.description ?? '',
        imageUrl: item.imageUrl ?? '',
        displayOrder: item.displayOrder,
        isActive: item.isActive,
    }
    optionDialogOpen.value = true
}

async function onOptionRowAction(key: string, item: OptionViewModel) {
    if (key === OPTION_ROW_ACTION.EDIT) {
        openEditOptionDialog(item)
    } else if (key === OPTION_ROW_ACTION.DELETE) {
        const ok = await deleteOption(item.id)
        if (ok) fetchOptionData()
    }
}

async function onOptionFormSubmit(form: typeof optionFormModel.value) {
    if (optionEditId.value) {
        const payload: UpdateOptionRequest = {
            Name: form.name,
            DefaultPrice: form.defaultPrice,
            Description: form.description || null,
            ImageUrl: form.imageUrl || null,
            DisplayOrder: form.displayOrder,
            IsActive: form.isActive,
        }
        const ok = await updateOption(optionEditId.value, payload)
        if (ok) { optionDialogOpen.value = false; fetchOptionData() }
    } else {
        if (form.groupId === null) return
        const payload: CreateOptionRequest = {
            GroupId: form.groupId,
            Name: form.name,
            DefaultPrice: form.defaultPrice,
            Description: form.description || null,
            ImageUrl: form.imageUrl || null,
            DisplayOrder: form.displayOrder,
            IsActive: form.isActive,
        }
        const result = await createOption(payload)
        if (result) { optionDialogOpen.value = false; fetchOptionData() }
    }
}

onMounted(fetchGroupData)
</script>
