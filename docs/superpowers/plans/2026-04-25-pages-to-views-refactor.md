# Pages → Views Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xóa `src/pages/`, gom nội dung vào `src/views/`, chuyển sub-components vào `src/components/<feature>/`, data vào `src/data/`, composable vào `src/composables/`.

**Architecture:** Không có thay đổi logic — đây là thuần túy di chuyển file và cập nhật import path. Router trỏ thẳng vào `src/views/*.vue`. Sub-components được tổ chức theo feature folder trong `src/components/`.

**Tech Stack:** Vue 3 + TypeScript + Vue Router 4 + Vite (`@` alias → `src/`)

---

## File Structure

### Tạo mới
- `src/data/home.images.ts`
- `src/data/home.constants.ts`
- `src/composables/useHomeScroll.ts`
- `src/components/home/HomeNav.vue`
- `src/components/home/HomeHero.vue`
- `src/components/home/HomeAbout.vue`
- `src/components/home/HomeMenu.vue`
- `src/components/home/HomeFranchise.vue`
- `src/components/home/HomeFaq.vue`
- `src/components/home/HomeContact.vue`
- `src/components/home/HomeFooter.vue`
- `src/components/auth/LoginForm.vue`
- `src/components/auth/RegisterForm.vue`

### Sửa (replace content)
- `src/views/HomeView.vue` — thay wrapper bằng nội dung thực
- `src/views/LoginView.vue` — thay wrapper bằng nội dung thực
- `src/views/RegisterView.vue` — thay wrapper bằng nội dung thực
- `src/views/DashboardView.vue` — thay wrapper bằng nội dung thực
- `src/views/UsersView.vue` — thay wrapper bằng nội dung thực
- `src/views/NotFoundView.vue` — thay wrapper bằng nội dung thực
- `src/router/routes/public.routes.ts`
- `src/router/routes/auth.routes.ts`
- `src/router/routes/admin.routes.ts`

### Xóa
- `src/pages/` (toàn bộ)

---

## Task 1: Tạo `src/data/` với 2 data files

**Files:**
- Create: `src/data/home.images.ts`
- Create: `src/data/home.constants.ts`

- [ ] **Step 1: Tạo `src/data/home.images.ts`**

```typescript
export const IMG: Record<string, string> = {
  olong_hanh_nhan: '',
  phuc_long: '',
  tam_gao: '',
  olong_kem_pho_mai: '',
  olong_rang_kem_pho_mai: '',
  olong_sua: '',
  olong_sua_dua: '',
  olong_nhai_sua: '',
  phindi_hanh_nhan: '',
  sen_long_nhan: '',
  sua_dua_suong_sao: '',
  sua_tuoi_tran_chau: '',
  thanh_tra_phuc_bon_tu: '',
  tra_xoai_machiato: '',
  vai_lai_sen_olong: '',
  olong_hat_phi: '',
}
```

- [ ] **Step 2: Tạo `src/data/home.constants.ts`**

Import từ `./home.images` (cùng thư mục, không đổi).

```typescript
import { IMG } from './home.images'
import type {
  Benefit,
  FaqItem,
  InvestRow,
  MenuItem,
  MenuTab,
  ProcessStep,
} from '@/models/home.models'

export const VALUES: string[] = [
  'Chất lượng',
  'Sáng tạo',
  'Minh bạch',
  'Đồng hành',
  'Bền vững',
  'Tối giản',
]

export const MENU_TABS: MenuTab[] = [
  { id: 'milk-tea', name: 'Trà Sữa' },
  { id: 'fruit', name: 'Trà Trái Cây' },
  { id: 'matcha', name: 'Matcha' },
  { id: 'fresh', name: 'Fresh & Cà Phê' },
]

export const ALL_MENU: MenuItem[] = [
  { cat: 'milk-tea', imgUrl: IMG.olong_hanh_nhan, name: 'Olong Hạnh Nhân', desc: 'Trà olong, hạnh nhân, sữa', price: '23K' },
  { cat: 'milk-tea', imgUrl: IMG.olong_hat_phi, name: 'Olong Hạt Phỉ', desc: 'Trà olong, hạt phỉ, sữa', price: '23K' },
  { cat: 'milk-tea', imgUrl: IMG.tam_gao, name: 'Tấm Gạo', desc: 'Trà olong tấm gạo, sữa', price: '20K' },
  { cat: 'milk-tea', imgUrl: IMG.phuc_long, name: 'Phúc Long', desc: 'Trà đen nguyên lá, sữa', price: '20K' },
  { cat: 'milk-tea', imgUrl: IMG.olong_sua, name: 'Olong Sữa', desc: 'Trà olong, sữa thơm', price: '23K' },
  { cat: 'milk-tea', imgUrl: IMG.olong_nhai_sua, name: 'Olong Nhài Sữa', desc: 'Trà olong, sữa thơm nhài', price: '25K' },
  { cat: 'milk-tea', imgUrl: IMG.olong_kem_pho_mai, name: 'Olong Kem Phô Mai', desc: 'Olong, thạch aiyu, kem phô mai', price: '23K' },
  { cat: 'milk-tea', imgUrl: IMG.olong_rang_kem_pho_mai, name: 'Olong Rang Kem Phô Mai', desc: 'Olong rang, hạt sen, thạch aiyu, kem phô mai', price: '26K' },
  { cat: 'fruit', imgUrl: IMG.thanh_tra_phuc_bon_tu, name: 'Thanh Trà Phúc Bồn Tử', desc: 'Trà xanh hoa nhài, phúc bồn tử, thạch aiyu', price: '22K' },
  { cat: 'fruit', imgUrl: IMG.sen_long_nhan, name: 'Sen Long Nhãn', desc: 'Trà sen, hạt sen, nhãn quả, thạch aiyu', price: '30K' },
  { cat: 'fruit', imgUrl: IMG.vai_lai_sen_olong, name: 'Vải Lài / Sen / Olong', desc: 'Trà sen hoặc olong kết hợp vải, thạch aiyu', price: '30K' },
  { cat: 'fruit', imgUrl: IMG.tra_xoai_machiato, name: 'Trà Xoài Machiato', desc: 'Lục trà xanh, hạt sen, xoài, thạch aiyu, kem phô mai', price: '27K' },
  { cat: 'matcha', imgUrl: IMG.olong_sua, name: 'Matcha Latte', desc: 'Sữa tươi kết hợp matcha Nhật thượng hạng', price: '29K' },
  { cat: 'matcha', imgUrl: IMG.olong_kem_pho_mai, name: 'Matcha Latte Kem Cheese', desc: 'Sữa tươi kết hợp matcha Nhật cùng lớp kem cheese', price: '33K' },
  { cat: 'fresh', imgUrl: IMG.sua_tuoi_tran_chau, name: 'Sữa Tươi Trân Châu', desc: 'Sữa tươi, trân châu đường đen', price: '25K' },
  { cat: 'fresh', imgUrl: IMG.sua_dua_suong_sao, name: 'Sữa Dừa Sương Sáo', desc: 'Sữa hạnh, cà phê, sương sáo, hạt sen', price: '27K' },
  { cat: 'fresh', imgUrl: IMG.phindi_hanh_nhan, name: 'Phindi Hạnh Nhân', desc: 'Sữa tươi, cà phê, hạnh nhân, thạch cà phê', price: '27K' },
  { cat: 'fresh', imgUrl: IMG.olong_sua_dua, name: 'Olong Sữa Dừa', desc: 'Trà olong kết hợp sữa dừa thơm mát', price: '23K' },
]

export const BENEFITS: Benefit[] = [
  { num: '01', title: 'Mô hình bền vững', desc: 'Lợi nhuận ổn định với quy trình đã chuẩn hóa.' },
  { num: '02', title: 'Vốn thấp - Hoàn vốn nhanh', desc: 'Chỉ từ 150 đến 250 triệu để khởi động.' },
  { num: '03', title: 'Bảo hộ khu vực', desc: 'Không cạnh tranh chéo trong bán kính phù hợp.' },
  { num: '04', title: 'Hỗ trợ trọn gói', desc: 'Đào tạo A-Z, setup và hỗ trợ khai trương.' },
  { num: '05', title: 'Mặt bằng linh hoạt', desc: 'Phù hợp nhiều diện tích và khu vực khác nhau.' },
  { num: '06', title: 'Tỷ lệ thành công cao', desc: 'Rủi ro thấp hơn nhờ vận hành chuẩn hóa.' },
]

export const STEPS: ProcessStep[] = [
  { title: 'Tư vấn ban đầu', desc: 'Trao đổi mô hình kinh doanh và điều khoản.' },
  { title: 'Khảo sát khu vực', desc: 'Kiểm tra vị trí mặt bằng và bán kính khai thác.' },
  { title: 'Hợp đồng chính thức', desc: 'Ký hợp đồng và hoàn tất phí nhượng quyền.' },
  { title: 'Đào tạo và chuyển giao', desc: 'Đào tạo trực tiếp tại cửa hàng.' },
  { title: 'Setup và khai trương', desc: 'Hoàn thiện thiết kế, thi công và chuẩn bị vận hành.' },
  { title: 'Đồng hành bền vững', desc: 'Theo dõi chất lượng và hỗ trợ tối ưu doanh thu.' },
]

export const INVEST_ROWS: InvestRow[] = [
  { name: 'Dụng cụ và máy móc pha chế', amount: '48.000.000 đ' },
  { name: 'Bảng hiệu', amount: '15.000.000 đ' },
  { name: 'Quầy pha chế', amount: '20.000.000 đ' },
  { name: 'Nội thất decor', amount: '15.000.000 đ' },
  { name: 'Điện nước + camera + wifi', amount: '10.000.000 đ' },
  { name: 'Nguyên liệu ban đầu', amount: '20.000.000 đ' },
  { name: 'Phí nhượng quyền', amount: '50.000.000 đ' },
  { name: 'Thuê mặt bằng', amount: '45.000.000 đ' },
]

export const FAQS: FaqItem[] = [
  { q: 'Tôi không có kinh nghiệm F&B, có làm được không?', a: 'Được. Mô hình đã chuẩn hóa và có đào tạo chi tiết.' },
  { q: 'Tôi đang có sẵn mặt bằng thì sao?', a: 'Đội ngũ sẽ khảo sát và tư vấn setup phù hợp với mặt bằng thực tế.' },
  { q: 'Có phải nhập nguyên liệu toàn bộ từ Soli không?', a: 'Chỉ các nhóm nguyên liệu cần đồng nhất chất lượng mới cần theo chuẩn Soli.' },
  { q: 'Bao lâu thì hoàn vốn?', a: 'Thông thường từ 2 đến 4 tháng tùy vị trí và cách vận hành.' },
  { q: 'Chi phí đầu tư ban đầu bao nhiêu?', a: 'Trung bình từ 120 đến 250 triệu đồng.' },
  { q: 'Có hợp đồng cam kết không?', a: 'Có. Điều khoản rõ ràng về quyền lợi và trách nhiệm của hai bên.' },
]
```

- [ ] **Step 3: Verify**

```bash
cd NDTCore.FE && npm run type-check
```

Expected: no errors relating to `src/data/`.

- [ ] **Step 4: Commit**

```bash
git -C NDTCore.FE add src/data/
git -C NDTCore.FE commit -m "refactor: create src/data with home domain data"
```

---

## Task 2: Migrate `useHomeScroll` vào `src/composables/`

**Files:**
- Create: `src/composables/useHomeScroll.ts`

- [ ] **Step 1: Tạo `src/composables/useHomeScroll.ts`**

```typescript
import { ref, onMounted, onUnmounted } from 'vue'

export function useHomeScroll() {
  const scrolled = ref(false)

  const handleScroll = () => {
    scrolled.value = window.scrollY > 60
  }

  onMounted(() => window.addEventListener('scroll', handleScroll))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))

  return { scrolled }
}
```

- [ ] **Step 2: Verify**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git -C NDTCore.FE add src/composables/useHomeScroll.ts
git -C NDTCore.FE commit -m "refactor: move useHomeScroll to src/composables"
```

---

## Task 3: Tạo `src/components/home/` với 8 component

**Files:**
- Create: `src/components/home/HomeHero.vue`
- Create: `src/components/home/HomeFooter.vue`
- Create: `src/components/home/HomeAbout.vue`
- Create: `src/components/home/HomeFaq.vue`
- Create: `src/components/home/HomeMenu.vue`
- Create: `src/components/home/HomeFranchise.vue`
- Create: `src/components/home/HomeNav.vue`
- Create: `src/components/home/HomeContact.vue`

- [ ] **Step 1: Tạo `src/components/home/HomeHero.vue`** (không có import từ pages)

```vue
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
```

- [ ] **Step 2: Tạo `src/components/home/HomeFooter.vue`** (không có import)

```vue
<template>
  <footer class="site-footer bg-surface">
    <v-container class="text-center">
      <div class="text-h6 font-weight-bold text-primary mb-2">Soli Tea</div>
      <p class="text-body-2 text-medium-emphasis mb-2">
        Trà đậm vị nguyên bản — Chill trọn khoảnh khắc
      </p>
      <p class="text-caption text-disabled">
        © 2025 Công ty TNHH Thương Mại Soli. All rights reserved.
      </p>
    </v-container>
  </footer>
</template>

<style scoped>
.site-footer {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}
</style>
```

- [ ] **Step 3: Tạo `src/components/home/HomeAbout.vue`** (import `../data/home.constants` → `@/data/home.constants`)

```vue
<template>
  <section id="ve-chung-toi" class="about-section bg-surface">
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
import { VALUES } from '@/data/home.constants'

const ABOUT_CARDS = [
  { icon: '🌿', title: 'Nguyên liệu cao nguyên',  desc: 'Trà thượng hạng từ nguồn nguyên liệu uy tín'    },
  { icon: '🧋', title: 'Topping homemade',         desc: 'Tạo nên dấu ấn riêng biệt không thể trộn lẫn'  },
  { icon: '🤝', title: 'Hệ sinh thái tin cậy',     desc: 'Đồng hành trọn gói từ công thức đến vận hành'  },
  { icon: '📈', title: 'Mô hình bền vững',          desc: 'Lợi nhuận ổn định từ 5–7 năm'                  },
]
</script>

<style scoped>
.about-section {
  padding-top: 5rem;
  padding-bottom: 5rem;
}
</style>
```

- [ ] **Step 4: Tạo `src/components/home/HomeFaq.vue`** (import `@/data/home.constants`)

```vue
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
```

- [ ] **Step 5: Tạo `src/components/home/HomeMenu.vue`** (import `@/data/home.constants`)

```vue
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
```

- [ ] **Step 6: Tạo `src/components/home/HomeFranchise.vue`** (import `@/data/home.constants`)

```vue
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
```

- [ ] **Step 7: Tạo `src/components/home/HomeNav.vue`** (import `@/composables/useHomeScroll`)

```vue
<template>
  <v-app-bar :elevation="scrolled ? 4 : 0" color="surface">
    <v-container class="d-flex align-center ga-4">
      <v-app-bar-title>
        <router-link to="/" class="text-decoration-none">
          <span class="text-h6 font-weight-bold text-primary">Soli Tea</span>
        </router-link>
      </v-app-bar-title>

      <div class="d-none d-sm-flex align-center ga-2">
        <v-btn v-for="link in NAV_LINKS" :key="link.id" variant="text" :href="link.href">
          {{ link.label }}
        </v-btn>
      </div>

      <v-spacer />

      <v-btn
        :to="APP_ROUTES.AUTH.LOGIN.PATH"
        color="primary"
        variant="outlined"
        class="d-none d-sm-flex"
      >
        Login
      </v-btn>

      <v-app-bar-nav-icon icon="mdi-menu" class="d-flex d-sm-none" @click="drawer = !drawer" />
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list>
      <v-list-item
        v-for="link in NAV_LINKS"
        :key="link.id"
        :href="link.href"
        :title="link.label"
        @click="drawer = false"
      />
      <v-list-item>
        <v-btn :to="APP_ROUTES.AUTH.LOGIN.PATH" color="primary" variant="outlined" block>
          Login
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { APP_ROUTES } from '@/constants/routes'
import { useHomeScroll } from '@/composables/useHomeScroll'

const { scrolled } = useHomeScroll()
const drawer = ref(false)

const NAV_LINKS = [
  { id: 'about', href: '#ve-chung-toi', label: 'Về chúng tôi' },
  { id: 'menu', href: '#menu', label: 'Menu' },
  { id: 'franchise', href: '#nhuong-quyen', label: 'Nhượng quyền' },
  { id: 'contact', href: '#lien-he', label: 'Liên hệ' },
]
</script>
```

- [ ] **Step 8: Tạo `src/components/home/HomeContact.vue`** (không có import từ pages)

```vue
<template>
  <section id="lien-he" class="contact-section bg-primary">
    <v-container>
      <v-row align="start" class="ga-y-10">
        <v-col cols="12" md="5">
          <v-chip color="on-primary" variant="tonal" class="mb-4">Liên hệ</v-chip>
          <h2 class="text-h4 font-weight-bold text-on-primary mb-6">
            Bắt đầu hành trình<br />
            cùng Soli Tea
          </h2>

          <div class="d-flex flex-column ga-4">
            <div v-for="info in CONTACT_INFO" :key="info.label" class="d-flex align-center ga-3">
              <v-icon :icon="info.icon" color="on-primary" size="24" />
              <div>
                <div class="text-caption text-on-primary opacity-75">{{ info.label }}</div>
                <component
                  :is="info.href ? 'a' : 'span'"
                  :href="info.href ?? undefined"
                  class="text-lime-accent-2 font-weight-medium text-decoration-none"
                >
                  {{ info.value }}
                </component>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="7">
          <v-card rounded="xl" class="pa-6">
            <div class="text-h6 mb-4 text-on-surface font-weight-bold">Đăng ký tư vấn miễn phí</div>

            <v-form ref="formRef" @submit.prevent="handleSubmit">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.name"
                    label="Họ và tên *"
                    :rules="requiredRule"
                    color="primary"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.phone"
                    label="Số điện thoại *"
                    type="tel"
                    :rules="requiredRule"
                    color="primary"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.city"
                    label="Tỉnh / Thành phố"
                    color="primary"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.message"
                    label="Bạn muốn hỏi gì?"
                    color="primary"
                    rows="4"
                  />
                </v-col>
              </v-row>

              <v-btn
                type="submit"
                color="primary"
                variant="flat"
                size="large"
                block
                :loading="isSubmitting"
                :prepend-icon="isSubmitted ? 'mdi-check' : undefined"
              >
                {{ isSubmitted ? 'Đã gửi thành công!' : 'Gửi đăng ký' }}
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ContactForm } from '@/models/home.models'

const formRef = ref<{ validate: () => Promise<{ valid: boolean }>; reset: () => void } | null>(null)
const isSubmitting = ref(false)
const isSubmitted = ref(false)

const form = reactive<ContactForm>({
  name: '',
  phone: '',
  city: '',
  message: '',
})

const requiredRule = [(value: string) => !!value || 'Trường này bắt buộc']

const CONTACT_INFO: { icon: string; label: string; value: string; href: string | null }[] = [
  { icon: 'mdi-phone', label: 'Hotline nhượng quyền', value: '0985 978 456', href: null },
  { icon: 'mdi-web', label: 'Website', value: 'soliteavn.com', href: 'https://soliteavn.com' },
  { icon: 'mdi-email', label: 'Email', value: 'haianhbg01@gmail.com', href: 'mailto:haianhbg01@gmail.com' },
  { icon: 'mdi-map-marker', label: 'Trụ sở', value: '211 Nam Kỳ Khởi Nghĩa, Vũng Tàu, TP.HCM', href: null },
]

async function handleSubmit() {
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 800))
  isSubmitting.value = false
  isSubmitted.value = true

  setTimeout(() => {
    isSubmitted.value = false
    Object.assign(form, { name: '', phone: '', city: '', message: '' })
    formRef.value?.reset()
  }, 3000)
}
</script>

<style scoped>
.contact-section {
  padding-top: 4rem;
  padding-bottom: 4rem;
}
</style>
```

- [ ] **Step 9: Verify**

```bash
npm run type-check
```

Expected: no errors in `src/components/home/`.

- [ ] **Step 10: Commit**

```bash
git -C NDTCore.FE add src/components/home/
git -C NDTCore.FE commit -m "refactor: move home sub-components to src/components/home"
```

---

## Task 4: Tạo `src/components/auth/`

**Files:**
- Create: `src/components/auth/LoginForm.vue`
- Create: `src/components/auth/RegisterForm.vue`

Tất cả import trong 2 file này đã dùng `@/` — không cần thay đổi import nào.

- [ ] **Step 1: Tạo `src/components/auth/LoginForm.vue`**

```vue
<template>
  <v-form ref="formRef" @submit.prevent="handleLogin">
    <v-text-field
      v-model="form.email"
      label="Email"
      type="email"
      autocomplete="email"
      :rules="rules.email"
      color="primary"
      :hide-details="false"
      class="mb-2"
    />

    <v-text-field
      v-model="form.password"
      label="Mat khau"
      :type="showPassword ? 'text' : 'password'"
      autocomplete="current-password"
      :rules="rules.password"
      color="primary"
      :hide-details="false"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showPassword = !showPassword"
    />

    <div class="d-flex justify-end mb-6 mt-2">
      <router-link
        to="/forgot-password"
        class="text-caption text-primary text-decoration-none font-weight-bold"
      >
        Quen mat khau?
      </router-link>
    </div>

    <v-btn
      type="submit"
      color="primary"
      variant="flat"
      size="large"
      block
      :loading="loading"
      class="text-none"
    >
      Dang nhap
    </v-btn>

    <div class="text-center mt-6">
      <span class="text-body-2 text-medium-emphasis">Chua co tai khoan? </span>
      <router-link
        :to="APP_ROUTES.AUTH.REGISTER.PATH"
        class="text-body-2 text-primary text-decoration-none font-weight-bold"
      >
        Dang ky ngay
      </router-link>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { APP_ROUTES } from '@/constants/routes'
import { VALIDATION_RULES } from '@/constants/validation.constants'

const router = useRouter()
const { login } = useAuth()
const { error: notifyError } = useToast()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)

const rules = {
  email: [VALIDATION_RULES.required('Email'), VALIDATION_RULES.email],
  password: [VALIDATION_RULES.required('Mat khau'), VALIDATION_RULES.minLength(6)],
}

async function handleLogin() {
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  loading.value = true

  try {
    await login({
      email: form.email,
      password: form.password,
    })
    await router.push(APP_ROUTES.DASHBOARD.HOME.PATH)
  } catch (error) {
    notifyError(error instanceof Error ? error.message : 'Dang nhap that bai.')
  } finally {
    loading.value = false
  }
}
</script>
```

- [ ] **Step 2: Tạo `src/components/auth/RegisterForm.vue`**

```vue
<template>
  <v-form ref="formRef" @submit.prevent="handleRegister">
    <v-text-field
      v-model="form.fullName"
      label="Ho va ten"
      autocomplete="name"
      :rules="rules.fullName"
      color="primary"
      :hide-details="false"
      class="mb-2"
    />

    <v-text-field
      v-model="form.email"
      label="Email"
      type="email"
      autocomplete="email"
      :rules="rules.email"
      color="primary"
      :hide-details="false"
      class="mb-2"
    />

    <v-text-field
      v-model="form.password"
      label="Mat khau"
      :type="showPassword ? 'text' : 'password'"
      autocomplete="new-password"
      :rules="rules.password"
      color="primary"
      :hide-details="false"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showPassword = !showPassword"
      class="mb-2"
    />

    <v-text-field
      v-model="form.confirmPassword"
      label="Xac nhan mat khau"
      :type="showConfirm ? 'text' : 'password'"
      autocomplete="new-password"
      :rules="rules.confirmPassword"
      color="primary"
      :hide-details="false"
      :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showConfirm = !showConfirm"
    />

    <v-btn
      type="submit"
      color="primary"
      variant="flat"
      size="large"
      block
      :loading="loading"
      class="text-none mt-4"
    >
      Dang ky
    </v-btn>

    <div class="text-center mt-6">
      <span class="text-body-2 text-medium-emphasis">Da co tai khoan? </span>
      <router-link
        :to="APP_ROUTES.AUTH.LOGIN.PATH"
        class="text-body-2 text-primary text-decoration-none font-weight-bold"
      >
        Dang nhap
      </router-link>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { APP_ROUTES } from '@/constants/routes'
import { VALIDATION_RULES } from '@/constants/validation.constants'

const router = useRouter()
const { register } = useAuth()
const { error: notifyError, success } = useToast()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)

const rules = {
  fullName: [VALIDATION_RULES.required('Ho va ten')],
  email: [VALIDATION_RULES.required('Email'), VALIDATION_RULES.email],
  password: [VALIDATION_RULES.required('Mat khau'), VALIDATION_RULES.minLength(6)],
  confirmPassword: [
    VALIDATION_RULES.required('Xac nhan mat khau'),
    (value: string) => value === form.password || 'Mat khau khong khop',
  ],
}

async function handleRegister() {
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  loading.value = true

  try {
    await register({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
    })
    success('Dang ky thanh cong. Ban co the dang nhap ngay.')
    await router.push(APP_ROUTES.AUTH.LOGIN.PATH)
  } catch (error) {
    notifyError(error instanceof Error ? error.message : 'Dang ky that bai.')
  } finally {
    loading.value = false
  }
}
</script>
```

- [ ] **Step 3: Verify**

```bash
npm run type-check
```

Expected: no errors in `src/components/auth/`.

- [ ] **Step 4: Commit**

```bash
git -C NDTCore.FE add src/components/auth/
git -C NDTCore.FE commit -m "refactor: move auth form components to src/components/auth"
```

---

## Task 5: Replace `src/views/` wrappers bằng nội dung thực

**Files:**
- Modify: `src/views/HomeView.vue`
- Modify: `src/views/LoginView.vue`
- Modify: `src/views/RegisterView.vue`
- Modify: `src/views/DashboardView.vue`
- Modify: `src/views/UsersView.vue`
- Modify: `src/views/NotFoundView.vue`

- [ ] **Step 1: Thay `src/views/HomeView.vue`**

```vue
<template>
  <v-layout>
    <HomeNav />
    <v-main>
      <HomeHero />
      <HomeAbout />
      <HomeMenu />
      <HomeFranchise />
      <HomeFaq />
      <HomeContact />
      <HomeFooter />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import HomeAbout from '@/components/home/HomeAbout.vue'
import HomeContact from '@/components/home/HomeContact.vue'
import HomeFaq from '@/components/home/HomeFaq.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import HomeFranchise from '@/components/home/HomeFranchise.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeMenu from '@/components/home/HomeMenu.vue'
import HomeNav from '@/components/home/HomeNav.vue'
</script>
```

- [ ] **Step 2: Thay `src/views/LoginView.vue`**

```vue
<template>
  <LoginForm />
</template>

<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue'
</script>
```

- [ ] **Step 3: Thay `src/views/RegisterView.vue`**

```vue
<template>
  <RegisterForm />
</template>

<script setup lang="ts">
import RegisterForm from '@/components/auth/RegisterForm.vue'
</script>
```

- [ ] **Step 4: Thay `src/views/DashboardView.vue`**

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">Dashboard</h1>
    <v-row>
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Welcome back!</div>
            <div class="text-body-2">{{ user?.name || 'Guest' }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
```

- [ ] **Step 5: Thay `src/views/UsersView.vue`**

```vue
<template>
  <div class="d-flex flex-column ga-4">
    <div>
      <h1 class="text-h4">Users</h1>
      <p class="text-body-2 text-medium-emphasis">
        Danh sách tài khoản đang hoạt động trong hệ thống.
      </p>
    </div>

    <DataTable
      :headers="headers"
      :items="items"
      :loading="loading"
      :show-pagination="false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import DataTable from '@/components/common/DataTable.vue'
import type { DataTableHeader } from '@/components/common/types'
import { useUser } from '@/composables/useUser'

const headers: DataTableHeader[] = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { key: 'role', title: 'Role' },
]

const { users: items, isLoading: loading, fetchUsers } = useUser()

onMounted(() => {
  void fetchUsers()
})
</script>
```

- [ ] **Step 6: Thay `src/views/NotFoundView.vue`**

```vue
<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-card max-width="600" elevation="0" color="transparent">
      <v-card-text class="pa-8 text-center">
        <div class="mb-6">
          <v-icon
            icon="mdi-rocket-launch-outline"
            size="120"
            color="primary"
            class="mb-4 rotate-animation"
          />
        </div>

        <div class="text-h1 font-weight-black text-primary mb-2">404</div>
        <h1 class="text-h4 font-weight-bold mb-3">Chúng tôi có một vấn đề!</h1>
        <p class="text-h6 text-medium-emphasis mb-8">
          Trang bạn đang tìm kiếm đã trôi dạt vào không gian vũ trụ.
        </p>

        <div class="d-flex flex-column flex-sm-row justify-center ga-4 mb-10">
          <v-btn
            color="primary"
            size="x-large"
            prepend-icon="mdi-home"
            @click="handleGoHome"
            rounded="lg"
          >
            Quay về Trái Đất
          </v-btn>

          <v-btn
            variant="outlined"
            color="primary"
            size="x-large"
            prepend-icon="mdi-arrow-left"
            @click="handleGoBack"
            rounded="lg"
          >
            Quay lại
          </v-btn>
        </div>

        <v-divider class="mb-6" />

        <div class="text-body-2 text-medium-emphasis">
          <p class="mb-4">Liên kết nhanh:</p>
          <div class="d-flex flex-wrap justify-center ga-6">
            <router-link to="/help" class="text-primary text-decoration-none font-weight-bold">
              Trung tâm trợ giúp
            </router-link>
            <router-link to="/contact" class="text-primary text-decoration-none font-weight-bold">
              Liên hệ hỗ trợ
            </router-link>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

const handleGoHome = () => {
  router.push('/')
}
</script>

<style scoped>
.rotate-animation {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}
</style>
```

- [ ] **Step 7: Verify**

```bash
npm run type-check
```

Expected: no errors in `src/views/`.

- [ ] **Step 8: Commit**

```bash
git -C NDTCore.FE add src/views/
git -C NDTCore.FE commit -m "refactor: replace view wrappers with actual page content"
```

---

## Task 6: Cập nhật 3 router files

**Files:**
- Modify: `src/router/routes/public.routes.ts`
- Modify: `src/router/routes/auth.routes.ts`
- Modify: `src/router/routes/admin.routes.ts`

- [ ] **Step 1: Cập nhật `src/router/routes/public.routes.ts`**

```typescript
import type { RouteRecordRaw } from 'vue-router'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { APP_ROUTES } from '@/constants/routes'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.HOME.PATH,
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: APP_ROUTES.HOME.NAME,
        component: () => import('@/views/HomeView.vue'),
        meta: {
          title: 'Home',
          requiresAuth: false,
        },
      },
    ],
  },
  {
    path: APP_ROUTES.NOT_FOUND.PATH,
    component: BlankLayout,
    children: [
      {
        path: '',
        name: APP_ROUTES.NOT_FOUND.NAME,
        component: () => import('@/views/NotFoundView.vue'),
        meta: {
          title: '404 Not Found',
          requiresAuth: false,
        },
      },
    ],
  },
]
```

- [ ] **Step 2: Cập nhật `src/router/routes/auth.routes.ts`**

```typescript
import type { RouteRecordRaw } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { APP_ROUTES } from '@/constants/routes'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: APP_ROUTES.AUTH.LOGIN.NAME,
        component: () => import('@/views/LoginView.vue'),
        meta: {
          title: 'Đăng nhập',
          requiresAuth: false,
        },
      },
      {
        path: 'register',
        name: APP_ROUTES.AUTH.REGISTER.NAME,
        component: () => import('@/views/RegisterView.vue'),
        meta: {
          title: 'Đăng ký',
          requiresAuth: false,
        },
      },
    ],
  },
]
```

- [ ] **Step 3: Cập nhật `src/router/routes/admin.routes.ts`**

```typescript
import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { APP_ROUTES } from '@/constants/routes'
import { authGuard } from '@/router/guards'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: authGuard,
    children: [
      {
        path: '',
        name: APP_ROUTES.DASHBOARD.HOME.NAME,
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Dashboard',
          breadcrumbs: [{ title: 'Dashboard', disabled: true }],
        },
      },
      {
        path: 'users',
        name: APP_ROUTES.USERS.LIST.NAME,
        component: () => import('@/views/UsersView.vue'),
        meta: {
          title: 'Users',
          permissions: [{ resource: 'users', action: 'read' }],
          breadcrumbs: [
            { title: 'Dashboard', to: APP_ROUTES.DASHBOARD.HOME.PATH },
            { title: 'Users', disabled: true },
          ],
        },
      },
    ],
  },
]
```

- [ ] **Step 4: Verify**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git -C NDTCore.FE add src/router/routes/
git -C NDTCore.FE commit -m "refactor: update router imports from pages to views"
```

---

## Task 7: Xóa `src/pages/` và verify final

**Files:**
- Delete: `src/pages/` (toàn bộ)

- [ ] **Step 1: Xóa thư mục `src/pages/`**

```bash
rm -rf NDTCore.FE/src/pages
```

- [ ] **Step 2: Chạy type-check**

```bash
npm run type-check
```

Expected: zero errors. Nếu có lỗi `Cannot find module '@/pages/...'`, có nghĩa là còn sót import — tìm và fix trước khi tiếp tục.

- [ ] **Step 3: Chạy lint**

```bash
npm run lint
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git -C NDTCore.FE add -A
git -C NDTCore.FE commit -m "refactor: remove src/pages — consolidated into views and components"
```
