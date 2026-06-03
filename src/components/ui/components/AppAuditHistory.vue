<template>
  <v-card elevation="0" rounded="lg" class="info-card">
    <v-list-item class="bg-surface-variant py-3">
      <template #prepend>
        <v-sheet rounded="md" width="32" height="32" class="d-flex align-center justify-center mr-1">
          <v-icon icon="mdi-history" size="16" color="primary" />
        </v-sheet>
      </template>
      <v-list-item-title class="font-weight-semibold">Lịch sử</v-list-item-title>
    </v-list-item>

    <v-divider />

    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <v-list lines="two" density="comfortable">
          <v-list-item :min-height="MIN_HEIGHT">
            <template #prepend>
              <v-icon icon="mdi-clock-plus-outline" size="18" class="mr-1 opacity-40" />
            </template>
            <v-list-item-title class="mb-1">Tạo lúc</v-list-item-title>
            <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
              {{ formatDate(createdAt) }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>

      <v-divider vertical />

      <v-col cols="12" sm="6">
        <v-list lines="two" density="comfortable">
          <v-list-item :min-height="MIN_HEIGHT">
            <template #prepend>
              <v-icon icon="mdi-account-plus-outline" size="18" class="mr-1 opacity-40" />
            </template>
            <v-list-item-title class="mb-1">Tạo bởi</v-list-item-title>
            <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
              {{ createdBy || FALLBACK }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>

      <v-divider />

      <v-col cols="12" sm="6">
        <v-list lines="two" density="comfortable">
          <v-list-item :min-height="MIN_HEIGHT">
            <template #prepend>
              <v-icon icon="mdi-clock-edit-outline" size="18" class="mr-1 opacity-40" />
            </template>
            <v-list-item-title class="mb-1">Cập nhật lúc</v-list-item-title>
            <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
              {{ formatDate(updatedAt) }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>

      <v-divider vertical />

      <v-col cols="12" sm="6">
        <v-list lines="two" density="comfortable">
          <v-list-item :min-height="MIN_HEIGHT">
            <template #prepend>
              <v-icon icon="mdi-account-edit-outline" size="18" class="mr-1 opacity-40" />
            </template>
            <v-list-item-title class="mb-1">Cập nhật bởi</v-list-item-title>
            <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
              {{ updatedBy || FALLBACK }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>

      <template v-if="deletedAt || deletedBy">
        <v-divider />

        <v-col cols="12" sm="6">
          <v-list lines="two" density="comfortable">
            <v-list-item :min-height="MIN_HEIGHT">
              <template #prepend>
                <v-icon icon="mdi-clock-remove-outline" size="18" class="mr-1 opacity-40" />
              </template>
              <v-list-item-title class="mb-1">Xoá lúc</v-list-item-title>
              <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
                {{ formatDate(deletedAt) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>

        <v-divider vertical />

        <v-col cols="12" sm="6">
          <v-list lines="two" density="comfortable">
            <v-list-item :min-height="MIN_HEIGHT">
              <template #prepend>
                <v-icon icon="mdi-account-remove-outline" size="18" class="mr-1 opacity-40" />
              </template>
              <v-list-item-title class="mb-1">Xoá bởi</v-list-item-title>
              <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
                {{ deletedBy || FALLBACK }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>
      </template>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
const MIN_HEIGHT = 60
const FALLBACK = '---'

defineProps<{
  createdAt: string | null | undefined
  createdBy: string | null | undefined
  updatedAt: string | null | undefined
  updatedBy: string | null | undefined
  deletedAt?: string | null | undefined
  deletedBy?: string | null | undefined
  formatDate: (value: string | null | undefined) => string
}>()
</script>

<style scoped>
.info-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>