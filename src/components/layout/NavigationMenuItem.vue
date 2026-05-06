<template>
    <v-list-item
        v-if="!item.children"
        :to="item.to ? { name: item.to } : undefined"
        :prepend-icon="item.icon"
        :title="item.title"
        color="primary"
    >
        <template v-if="item.badge" #append>
            <v-chip size="x-small" :color="item.badge.color">{{ item.badge.text }}</v-chip>
        </template>
    </v-list-item>

    <v-list-group v-else :value="item.title">
        <template #activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title" />
        </template>

        <v-list-item
            v-for="child in item.children.filter(hasAccess)"
            :key="child.title"
            :to="child.to ? { name: child.to } : undefined"
            :title="child.title"
            color="primary"
        />
    </v-list-group>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/core/types'
import { useMenuAccess } from '@/composables/useMenuAccess'

defineProps<{ item: MenuItem }>()

const { hasAccess } = useMenuAccess()
</script>
