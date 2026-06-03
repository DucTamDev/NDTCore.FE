<template>
    <div class="pa-4 d-flex flex-column ga-4">
        <div class="d-flex align-center justify-space-between">
            <span class="text-subtitle-2 text-medium-emphasis">Nhóm option đã gán</span>
            <v-btn size="small" color="primary" prepend-icon="mdi-plus" @click="openAssignDialog">
                Gán nhóm
            </v-btn>
        </div>

        <v-progress-linear :indeterminate="isLoading" color="primary" :style="{ opacity: isLoading ? 1 : 0, transition: 'opacity 0.15s ease' }" />

        <v-table v-if="optionGroups.length" density="compact">
            <thead>
                <tr>
                    <th>Nhóm</th>
                    <th class="text-center">Bắt buộc</th>
                    <th class="text-center">Min</th>
                    <th class="text-center">Max</th>
                    <th class="text-center">Thứ tự</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="og in optionGroups" :key="og.GroupId">
                    <td>{{ og.GroupName }}</td>
                    <td class="text-center">
                        <v-icon
                            :color="og.IsRequired ? 'success' : 'grey'"
                            :icon="og.IsRequired ? 'mdi-check' : 'mdi-minus'"
                        />
                    </td>
                    <td class="text-center">{{ og.MinSelect }}</td>
                    <td class="text-center">{{ og.MaxSelect }}</td>
                    <td class="text-center">{{ og.DisplayOrder }}</td>
                    <td class="text-end">
                        <v-btn
                            size="x-small"
                            icon="mdi-pencil-outline"
                            variant="text"
                            color="primary"
                            @click="openEditDialog(og)"
                        />
                        <v-btn
                            size="x-small"
                            icon="mdi-delete-outline"
                            variant="text"
                            color="error"
                            @click="() => { confirmGroupId = og.GroupId; confirmGroupOpen = true }"
                        />
                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-alert v-else-if="!isLoading" type="info" variant="tonal" density="compact">
            Chưa có nhóm option nào được gán.
        </v-alert>

        <!-- Assign dialog -->
        <AppDialog v-model="showAssign" title="Gán nhóm option" :hide-actions="true" max-width="500px">
            <div class="pa-2 d-flex flex-column ga-3">
                <v-autocomplete
                    v-model="assignForm.GroupId"
                    :items="allGroups"
                    item-value="id"
                    item-title="name"
                    label="Nhóm option *"
                />
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model.number="assignForm.MinSelect" label="Min select" type="number" min="0" />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model.number="assignForm.MaxSelect" label="Max select" type="number" min="0" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model.number="assignForm.DisplayOrder" label="Thứ tự" type="number" min="0" />
                    </v-col>
                    <v-col cols="6" class="d-flex align-center">
                        <v-switch v-model="assignForm.IsRequired" label="Bắt buộc" color="primary" base-color="grey" />
                    </v-col>
                </v-row>
                <div class="d-flex justify-end ga-2">
                    <v-btn variant="text" @click="showAssign = false">Hủy</v-btn>
                    <v-btn color="primary" :loading="isSubmitting" @click="onAssign">Gán</v-btn>
                </div>
            </div>
        </AppDialog>

        <AppConfirmDialog
            v-model="confirmGroupOpen"
            title="Gỡ nhóm option"
            message="Bạn có chắc muốn gỡ nhóm option này khỏi sản phẩm?"
            confirm-label="Xác nhận gỡ"
            confirm-variant="danger"
            @confirm="onConfirmRemove"
        />

        <!-- Edit dialog -->
        <AppDialog v-model="showEdit" title="Cập nhật nhóm option" :hide-actions="true" max-width="500px">
            <div class="pa-2 d-flex flex-column ga-3">
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model.number="editForm.MinSelect" label="Min select" type="number" min="0" />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model.number="editForm.MaxSelect" label="Max select" type="number" min="0" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model.number="editForm.DisplayOrder" label="Thứ tự" type="number" min="0" />
                    </v-col>
                    <v-col cols="6" class="d-flex align-center">
                        <v-switch v-model="editForm.IsRequired" label="Bắt buộc" color="primary" base-color="grey" />
                    </v-col>
                </v-row>
                <div class="d-flex justify-end ga-2">
                    <v-btn variant="text" @click="showEdit = false">Hủy</v-btn>
                    <v-btn color="primary" :loading="isSubmitting" @click="onUpdate">Cập nhật</v-btn>
                </div>
            </div>
        </AppDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { AppDialog, AppConfirmDialog } from '@/components/ui'
import { useProductRelations } from '../../composables/useProductRelations'
import { useOptionGroupStore } from '../../stores/option-group.store'
import { useToastNotification } from '@/composables/useToastNotification'
import type { ProductOptionGroupDto } from '../../models/dtos/product-relations.dto'

const props = defineProps<{ productId: number }>()

const {
    isLoading,
    isSubmitting,
    optionGroups,
    loadOptionGroups,
    assignOptionGroup,
    updateOptionGroup,
    removeOptionGroup,
} = useProductRelations(props.productId)

const groupStore = useOptionGroupStore()
const toast = useToastNotification()
const allGroups = ref<{ id: number; name: string }[]>([])

const showAssign = ref(false)
const assignForm = reactive({ GroupId: 0, IsRequired: false, MinSelect: 0, MaxSelect: 1, DisplayOrder: 0 })

const showEdit = ref(false)
const editGroupId = ref(0)
const editForm = reactive({ IsRequired: false, MinSelect: 0, MaxSelect: 1, DisplayOrder: 0 })
const confirmGroupOpen = ref(false)
const confirmGroupId = ref<number | null>(null)

function openAssignDialog() {
    Object.assign(assignForm, { GroupId: 0, IsRequired: false, MinSelect: 0, MaxSelect: 1, DisplayOrder: 0 })
    showAssign.value = true
}

function openEditDialog(og: ProductOptionGroupDto) {
    editGroupId.value = og.GroupId
    Object.assign(editForm, {
        IsRequired: og.IsRequired,
        MinSelect: og.MinSelect,
        MaxSelect: og.MaxSelect,
        DisplayOrder: og.DisplayOrder,
    })
    showEdit.value = true
}

function validateConstraints(min: number, max: number): string | null {
    if (max < min) return `Số chọn tối đa (${max}) phải ≥ số chọn tối thiểu (${min})`
    return null
}

async function onAssign() {
    const err = validateConstraints(assignForm.MinSelect, assignForm.MaxSelect)
    if (err) { toast.warning(err); return }
    const ok = await assignOptionGroup({ ...assignForm })
    if (ok) {
        showAssign.value = false
        await loadOptionGroups()
        const assignedIds = new Set(optionGroups.value.map((og) => og.GroupId))
        allGroups.value = groupStore.items
            .filter((g) => !assignedIds.has(g.id))
            .map((g) => ({ id: g.id, name: g.name }))
    }
}

async function onUpdate() {
    const err = validateConstraints(editForm.MinSelect, editForm.MaxSelect)
    if (err) { toast.warning(err); return }
    const ok = await updateOptionGroup(editGroupId.value, { ...editForm })
    if (ok) { showEdit.value = false; await loadOptionGroups() }
}

async function onConfirmRemove() {
    if (confirmGroupId.value == null) return
    const ok = await removeOptionGroup(confirmGroupId.value)
    if (ok) await loadOptionGroups()
    confirmGroupId.value = null
}

onMounted(async () => {
    await groupStore.fetchPaged({ PageNumber: 1, PageSize: 200 })
    await loadOptionGroups()
    const assignedIds = new Set(optionGroups.value.map((og) => og.GroupId))
    allGroups.value = groupStore.items
        .filter((g) => !assignedIds.has(g.id))
        .map((g) => ({ id: g.id, name: g.name }))
})
</script>
