<template>
  <section id="ve-chung-toi" class="tw:py-20 bg-surface">
    <v-container>
      <v-row align="start" class="ga-y-8">
        <v-col cols="12" md="5">
          <v-chip color="primary" variant="tonal" class="mb-4">Câu chuyện của chúng tôi</v-chip>

          <h2 class="text-h4 font-weight-bold mb-6 text-on-surface">
            Thương hiệu trà Việt dẫn đầu
          </h2>

          <p class="text-body-1 text-medium-emphasis mb-4">
            Ra đời từ niềm yêu thích hương vị trà đậm đà và không gian quán gần gũi, Tiệm Trà Soli
            mang đến trải nghiệm trà sữa thuần vị — ít ngọt — đậm chất riêng.
          </p>

          <p class="text-body-1 text-medium-emphasis mb-6">
            Với hơn 80 chi nhánh trải dài khắp Việt Nam cùng hàng ngàn khách hàng trung thành, Soli
            đang từng bước khẳng định vị thế trong lòng những người yêu trà sữa.
          </p>

          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="value in VALUES"
              :key="value"
              color="primary"
              variant="outlined"
              size="small"
            >
              {{ value }}
            </v-chip>
          </div>
        </v-col>

        <v-col cols="12" md="7">
          <v-row>
            <v-col v-for="card in ABOUT_CARDS" :key="card.title" cols="12" sm="6">
              <v-card color="surface-variant" variant="flat" rounded="lg" class="pa-4 h-100">
                <div class="text-h5 mb-2">{{ card.icon }}</div>
                <v-card-title class="pa-0 mb-2 text-on-surface text-body-1 font-weight-bold">
                  {{ card.title }}
                </v-card-title>
                <v-card-text class="pa-0 text-medium-emphasis text-body-2">
                  {{ card.desc }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { VALUES } from '../data/home.constants'

const ABOUT_CARDS = [
  { icon: '🌿', title: 'Nguyên liệu cao nguyên',  desc: 'Trà thượng hạng từ nguồn nguyên liệu uy tín'          },
  { icon: '🧋', title: 'Topping homemade',         desc: 'Tạo nên dấu ấn riêng biệt không thể trộn lẫn'        },
  { icon: '🤝', title: 'Hệ sinh thái tin cậy',     desc: 'Đồng hành trọn gói từ công thức đến vận hành'        },
  { icon: '📈', title: 'Mô hình bền vững',          desc: 'Lợi nhuận ổn định từ 5–7 năm'                        },
]
</script>
