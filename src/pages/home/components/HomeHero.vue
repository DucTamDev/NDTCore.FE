<template>
  <section id="hero" class="hero-section bg-background">
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
              append-icon="mdi-arrow-right"
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
          <div class="hero-avatar-wrap">
            <v-avatar class="hero-avatar" color="primary" variant="tonal">
              <v-icon icon="mdi-tea" size="96" color="primary" />
            </v-avatar>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
const STATS = [
  { num: '85+', label: 'Chi nhánh' },
  { num: '80%', label: 'Tỉ lệ thành công' },
  { num: '500+', label: 'Mục tiêu 2030' },
]
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 6rem;
  padding-bottom: 6rem;
}

.hero-avatar-wrap {
  position: relative;
  width: 18rem;
  height: 18rem;
}

.hero-avatar {
  width: 100% !important;
  height: 100% !important;
}

@media (min-width: 960px) {
  .hero-avatar-wrap {
    width: 20rem;
    height: 20rem;
  }
}
</style>
