<template>
  <section id="nhuong-quyen" class="franchise-section bg-surface">
    <v-container>
      <div class="text-center mb-10">
        <v-chip color="primary" variant="tonal" class="mb-4">Cơ hội kinh doanh</v-chip>
        <h2 class="text-h4 font-weight-bold text-on-surface">
          Nhượng quyền <em class="text-primary">Soli Tea</em>
        </h2>
      </div>

      <v-card color="primary" variant="flat" rounded="xl" class="mb-10 text-center pa-8">
        <div class="text-caption text-on-primary mb-1">Phí nhượng quyền</div>
        <div class="text-h3 font-weight-bold text-on-primary mb-2">50 triệu đồng</div>
        <div class="text-body-2 text-on-primary opacity-85">
          Đóng 1 lần duy nhất • Không thu phí hàng năm
        </div>
      </v-card>

      <v-row class="mb-12">
        <v-col v-for="b in BENEFITS" :key="b.num" cols="12" sm="6" md="4">
          <v-card color="primary" variant="outlined" rounded="lg" class="pa-4 h-100">
            <div class="text-h6 font-weight-bold text-primary mb-2">{{ b.num }}</div>
            <div class="text-body-1 font-weight-bold text-on-surface mb-2">{{ b.title }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ b.desc }}</div>
          </v-card>
        </v-col>
      </v-row>

      <h3 class="text-h5 font-weight-bold text-on-surface mb-6">Quy trình nhượng quyền</h3>
      <v-timeline side="end" class="mb-12">
        <v-timeline-item
          v-for="(step, i) in STEPS"
          :key="step.title"
          :dot-color="i % 2 === 0 ? 'primary' : 'secondary'"
          size="small"
        >
          <v-card color="primary" variant="outlined" rounded="lg" class="pa-4">
            <div class="text-body-1 font-weight-bold text-on-surface mb-1">{{ step.title }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ step.desc }}</div>
          </v-card>
        </v-timeline-item>
      </v-timeline>

      <h3 class="text-h5 font-weight-bold text-on-surface mb-4">Chi phí dự kiến đầu tư</h3>
      <v-card color="primary" variant="outlined" rounded="lg" class="mb-10">
        <v-table>
          <tbody>
            <tr v-for="row in INVEST_ROWS" :key="row.name">
              <td class="text-on-surface">{{ row.name }}</td>
              <td class="text-right font-weight-bold text-on-surface">{{ row.amount }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold bg-primary text-on-primary">Tổng cộng</td>
              <td class="text-right font-weight-bold bg-primary text-on-primary">223.000.000 đ</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <v-row>
        <v-col cols="12" md="7">
          <h3 class="text-h5 font-weight-bold text-on-surface mb-4">Lợi nhuận dự kiến</h3>
          <div class="d-flex flex-column ga-4">
            <div v-for="profit in PROFITS" :key="profit.amount" class="d-flex align-start ga-3">
              <v-icon icon="mdi-circle" :color="profit.color" size="small" class="mt-1" />
              <div>
                <div class="font-weight-bold text-on-surface">{{ profit.amount }}</div>
                <div class="text-caption text-medium-emphasis">{{ profit.note }}</div>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="5">
          <v-row>
            <v-col v-for="s in PROFIT_STATS" :key="s.label" cols="6">
              <v-card color="primary" variant="tonal" rounded="lg" class="pa-4 text-center">
                <div class="text-h4 font-weight-bold text-primary">{{ s.num }}</div>
                <div class="text-caption text-medium-emphasis">{{ s.label }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { BENEFITS, STEPS, INVEST_ROWS } from '@/data/home.constants'

const PROFITS = [
  { amount: '30–40 triệu/tháng', note: 'sau 2–3 tháng vận hành', color: 'primary' },
  { amount: '100–150 triệu/tháng', note: 'tiềm năng cao sau 2–4 tháng', color: 'secondary' },
  { amount: 'Hoàn vốn nhanh', note: 'đặc biệt ở khu vực đông dân', color: 'success' },
]

const PROFIT_STATS = [
  { num: '80%', label: 'Tỉ lệ thành công đã chứng minh' },
  { num: '2–4', label: 'Tháng hoàn vốn trung bình' },
]
</script>

<style scoped>
.franchise-section {
  padding-top: 5rem;
  padding-bottom: 5rem;
}

:deep(.v-timeline-item__body) {
  width: 100%;
}
</style>
