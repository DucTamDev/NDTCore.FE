<template>
  <div class="pa-5 d-flex flex-column ga-5">
    <v-card elevation="0" rounded="lg" class="info-card">
      <v-list-item class="bg-surface-variant py-3">
        <template #prepend>
          <v-sheet rounded="md" width="32" height="32" class="d-flex align-center justify-center mr-1">
            <v-icon icon="mdi-shield-account-outline" size="16" color="primary" />
          </v-sheet>
        </template>
        <v-list-item-title class="font-weight-semibold">Roles hiện tại</v-list-item-title>
      </v-list-item>
      <v-divider />
      <div class="pa-4">
        <div v-if="props.roles.length === 0" class="text-body-2 text-medium-emphasis">
          Người dùng chưa có role nào.
        </div>
        <div v-else class="d-flex flex-wrap ga-2">
          <v-chip v-for="role in props.roles" :key="role" color="primary" variant="tonal">
            {{ role }}
          </v-chip>
        </div>
      </div>
    </v-card>

    <v-card elevation="0" rounded="lg" class="info-card">
      <v-list-item class="bg-surface-variant py-3">
        <template #prepend>
          <v-sheet rounded="md" width="32" height="32" class="d-flex align-center justify-center mr-1">
            <v-icon icon="mdi-shield-plus-outline" size="16" color="primary" />
          </v-sheet>
        </template>
        <v-list-item-title class="font-weight-semibold">Gán thêm role</v-list-item-title>
      </v-list-item>
      <v-divider />
      <div class="pa-4 d-flex flex-column ga-4">
        <v-select
          v-model="selectedRoles"
          :items="availableRoles"
          label="Chọn role muốn gán"
          variant="solo-filled"
          flat
          multiple
          chips
          closable-chips
          hint="Chỉ thêm role mới, không xóa role hiện tại"
          persistent-hint
        />
        <div>
          <v-btn
            color="primary"
            variant="flat"
            rounded="lg"
            prepend-icon="mdi-shield-plus-outline"
            :loading="props.submitting"
            :disabled="selectedRoles.length === 0"
            @click="handleAssign"
          >
            Gán role
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { SYSTEM_ROLES } from '@/core/constants/app.constants'

type SystemRoleValue = typeof SYSTEM_ROLES[keyof typeof SYSTEM_ROLES]

const props = defineProps<{
  roles: string[]
  submitting: boolean
}>()

const emit = defineEmits<{
  assign: [roles: string[]]
}>()

const selectedRoles = ref<SystemRoleValue[]>([])

const availableRoles = computed(() =>
  Object.values(SYSTEM_ROLES).filter(
    (role) => role !== SYSTEM_ROLES.SUPER_ADMIN && !props.roles.includes(role),
  ),
)

watch(
  () => props.submitting,
  (submitting, wasSubmitting) => {
    if (wasSubmitting && !submitting) selectedRoles.value = []
  },
)

function handleAssign() {
  emit('assign', [...selectedRoles.value])
}
</script>

<style scoped>
.info-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
