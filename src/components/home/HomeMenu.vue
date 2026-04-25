<template>
  <section id="menu" class="menu-section bg-background">
    <v-container>
      <div class="text-center mb-8">
        <v-chip color="primary" variant="tonal" class="mb-4">Thực đơn</v-chip>
        <h2 class="text-h4 font-weight-bold text-on-background">Menu đặc trưng</h2>
        <p class="text-body-1 text-medium-emphasis mt-2">
          Mỗi ly là một hành trình hương vị từ cao nguyên Việt Nam
        </p>
      </div>

      <v-tabs v-model="activeTab" color="primary" class="mb-8" align-tabs="center">
        <v-tab v-for="tab in MENU_TABS" :key="tab.id" :value="tab.id">
          {{ tab.name }}
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item v-for="tab in MENU_TABS" :key="tab.id" :value="tab.id">
          <v-row>
            <v-col v-for="item in filteredMenu" :key="item.name" cols="12" sm="6" md="4" lg="3">
              <v-card rounded="lg" class="h-100" variant="outlined" color="primary">
                <v-img
                  :src="item.imgUrl"
                  :alt="item.name"
                  height="180"
                  cover
                  class="bg-surface-variant"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon icon="mdi-tea" size="48" color="primary" :opacity="0.3" />
                    </div>
                  </template>
                </v-img>
                <v-card-item>
                  <v-card-title class="text-on-surface text-body-1 font-weight-bold">
                    {{ item.name }}
                  </v-card-title>
                  <v-card-subtitle class="text-medium-emphasis text-body-2">
                    {{ item.desc }}
                  </v-card-subtitle>
                </v-card-item>
                <v-card-actions>
                  <v-chip color="primary" variant="flat" size="small">{{ item.price }}</v-chip>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MENU_TABS, ALL_MENU } from '@/data/home.constants'

const activeTab = ref('milk-tea')
const filteredMenu = computed(() => ALL_MENU.filter((i) => i.cat === activeTab.value))
</script>

<style scoped>
.menu-section {
  padding-top: 5rem;
  padding-bottom: 5rem;
}
</style>
