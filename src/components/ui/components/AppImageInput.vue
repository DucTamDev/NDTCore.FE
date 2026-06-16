<template>
    <div
        class="image-preview rounded-lg overflow-hidden d-flex align-center justify-center bg-surface-variant"
        :class="{ 'image-preview--filled': !!modelValue }"
    >
        <v-img v-if="modelValue" :src="modelValue" cover height="160" />
        <div v-else class="d-flex flex-column align-center justify-center ga-1 text-medium-emphasis">
            <v-icon size="36">mdi-image-outline</v-icon>
            <span class="text-caption">Chưa có hình ảnh</span>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    modelValue: string | null
}

defineProps<Props>()
</script>

<style scoped>
.image-preview {
    height: 160px;
    border: 2px dashed rgba(var(--v-border-color), var(--v-border-opacity));
    transition: border-color 0.2s;
}
.image-preview--filled {
    border-style: solid;
    border-color: transparent;
}
</style>
