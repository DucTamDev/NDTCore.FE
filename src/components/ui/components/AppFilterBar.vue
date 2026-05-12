<template>
  <v-card class="pa-4" variant="outlined">
    <div class="d-flex flex-wrap align-start ga-3">
      <slot />
    </div>
    <div v-if="$slots.actions" class="d-flex ga-2 mt-4 justify-end flex-wrap">
      <slot name="actions" />
    </div>
  </v-card>
</template>
