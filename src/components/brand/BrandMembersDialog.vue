<template>
    <v-dialog
        :model-value="modelValue"
        max-width="760"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <v-card rounded="lg">
            <v-card-title class="d-flex align-center justify-space-between">
                <div>
                    <div class="text-h6">Thành viên thương hiệu</div>
                    <div class="text-body-2 text-medium-emphasis">{{ brandName }}</div>
                </div>
                <v-btn icon="mdi-close" variant="text" @click="emit('update:modelValue', false)" />
            </v-card-title>

            <v-card-text class="d-flex flex-column ga-4">
                <v-alert type="info" variant="tonal" density="comfortable">
                    Nhập danh sách `UserId` cách nhau bằng dấu phẩy để gán nhanh thành viên vào
                    thương hiệu.
                </v-alert>

                <div class="d-flex flex-column ga-3">
                    <v-textarea
                        v-model="userIdsText"
                        label="Danh sách UserId"
                        placeholder="guid-1, guid-2, guid-3"
                        rows="3"
                        variant="outlined"
                        hide-details="auto"
                    />
                    <div class="d-flex justify-end">
                        <v-btn color="primary" :loading="submitting" @click="assignUsers">
                            Gán người dùng
                        </v-btn>
                    </div>
                </div>

                <v-divider />

                <div class="d-flex align-center justify-space-between">
                    <div class="text-subtitle-1 font-weight-medium">Danh sách thành viên</div>
                    <v-chip color="primary" variant="tonal">{{ members.length }} thành viên</v-chip>
                </div>

                <v-skeleton-loader v-if="loading" type="list-item-two-line@4" />

                <v-list v-else-if="members.length" lines="two" class="border rounded-lg">
                    <v-list-item v-for="member in members" :key="member.userId">
                        <template #prepend>
                            <v-avatar color="primary" variant="tonal">
                                <v-icon>mdi-account</v-icon>
                            </v-avatar>
                        </template>

                        <v-list-item-title>{{ member.userId }}</v-list-item-title>
                        <v-list-item-subtitle>Tenant: {{ member.tenantId }}</v-list-item-subtitle>

                        <template #append>
                            <v-btn
                                icon="mdi-delete-outline"
                                color="error"
                                variant="text"
                                @click="emit('remove-user', member.userId)"
                            />
                        </template>
                    </v-list-item>
                </v-list>

                <div
                    v-else
                    class="d-flex flex-column align-center justify-center py-8 text-medium-emphasis"
                >
                    <v-icon size="48" class="mb-3">mdi-account-group-outline</v-icon>
                    <div class="text-subtitle-1">Chưa có thành viên</div>
                    <div class="text-body-2">Thương hiệu này chưa được gán người dùng nào.</div>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BrandMemberModel } from '@/models/brand.model'

interface Props {
    modelValue: boolean
    brandName: string
    members: BrandMemberModel[]
    loading?: boolean
    submitting?: boolean
}

withDefaults(defineProps<Props>(), {
    loading: false,
    submitting: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'assign-users': [userIds: string[]]
    'remove-user': [userId: string]
}>()

const userIdsText = ref('')

function assignUsers() {
    const userIds = userIdsText.value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)

    if (!userIds.length) {
        return
    }

    emit('assign-users', [...new Set(userIds)])
    userIdsText.value = ''
}
</script>
