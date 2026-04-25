<template>
  <section class="faq-section bg-background">
    <v-container>
      <div class="text-center mb-10">
        <v-chip color="primary" variant="tonal" class="mb-4">Câu hỏi thường gặp</v-chip>
        <h2 class="text-h4 font-weight-bold text-on-background">Bạn có thắc mắc?</h2>
      </div>

      <div class="faq-panels">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="(faq, i) in FAQS" :key="i" rounded="lg">
            <v-expansion-panel-title>{{ faq.q }}</v-expansion-panel-title>
            <v-expansion-panel-text>{{ faq.a }}</v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { FAQS } from '@/data/home.constants'
</script>

<style scoped>
.faq-section {
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.faq-panels {
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
}
</style>
