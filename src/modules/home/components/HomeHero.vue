<template>
  <section id="hero" class="tw:min-h-screen tw:flex tw:items-center tw:py-24 bg-background">
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6" class="text-center text-md-left">
          <v-chip color="primary" variant="tonal" class="mb-4">Trà đậm vị nguyên bản</v-chip>

          <h1 class="text-h3 text-md-h2 font-weight-bold mb-4 text-on-background">
            Từng ngụm<br />
            <span class="text-primary d-block my-4">đậm chất</span>
            Việt Nam
          </h1>

          <p class="text-body-1 text-medium-emphasis mb-8">
            Kết hợp trà thượng hạng từ cao nguyên, sữa tươi nguyên chất và topping homemade — tạo
            nên trải nghiệm trà sữa ít ngọt, đậm chất riêng.
          </p>

          <div class="d-flex flex-wrap ga-4 justify-center justify-md-start mb-8">
            <v-btn
              color="primary"
              size="large"
              href="#nhuong-quyen"
              variant="flat"
              :append-icon="mdiArrowRight"
            >
              Nhượng quyền ngay
            </v-btn>
            <v-btn color="primary" size="large" href="#menu" variant="outlined">Xem menu</v-btn>
          </div>

          <v-divider class="mb-6" />

          <div class="d-flex ga-8 justify-center justify-md-start">
            <div v-for="stat in STATS" :key="stat.label" class="text-center text-md-left">
              <div class="text-h5 font-weight-bold text-primary">{{ stat.num }}</div>
              <div class="text-caption text-medium-emphasis">{{ stat.label }}</div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="d-flex justify-center">
          <div class="tw:relative tw:w-72 tw:h-72 md:tw:w-80 md:tw:h-80">
            <v-avatar size="288" color="primary" variant="tonal" class="tw:w-full tw:h-full">
              <v-icon :icon="mdiTea" size="96" color="primary" />
            </v-avatar>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { mdiArrowRight, mdiTea } from '@mdi/js'

const STATS = [
  { num: '85+',  label: 'Chi nhánh'         },
  { num: '80%',  label: 'Tỉ lệ thành công'  },
  { num: '500+', label: 'Mục tiêu 2030'     },
]
</script>
