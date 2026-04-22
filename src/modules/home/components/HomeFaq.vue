<template>
  <section class="tw:py-20 bg-background">
    <v-container>
      <div class="text-center mb-10">
        <v-chip color="primary" variant="tonal" class="mb-4">Câu hỏi thường gặp</v-chip>
        <h2 class="text-h4 font-weight-bold text-on-background">Bạn có thắc mắc?</h2>
      </div>

      <v-expansion-panels variant="accordion" class="tw:max-w-3xl tw:mx-auto">
        <v-expansion-panel v-for="(faq, i) in FAQS" :key="i" rounded="lg">
          <v-expansion-panel-title>{{ faq.q }}</v-expansion-panel-title>
          <v-expansion-panel-text>{{ faq.a }}</v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { FAQS } from '../data/home.constants'
</script>
