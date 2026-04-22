# UI System — NDTCore

Hệ thống UI dùng chung cho toàn bộ ứng dụng, bao gồm design tokens, theme engine, và CSS generation pipeline.

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Design Tokens](#3-design-tokens)
4. [CSS Generator](#4-css-generator)
5. [Theme Engine](#5-theme-engine)
6. [Cài đặt & Khởi động](#6-cài-đặt--khởi-động)
7. [Cách dùng trong component](#7-cách-dùng-trong-component)
8. [Thêm token mới](#8-thêm-token-mới)
9. [Quy tắc & Conventions](#9-quy-tắc--conventions)

---

## 1. Tổng quan

```
Token definitions (TypeScript)
        ↓
CSS Generator (build-time)
        ↓
CSS Custom Properties (:root)
        ↓
Tailwind v4 utilities + CSS variables
        ↓
ThemeProvider (runtime)
        ↓
Dark mode sync (DOM + Vuetify + localStorage)
```

**Công nghệ:**
- Tailwind CSS v4 — utility classes tự động từ CSS variables
- Vuetify 3 — component library, sync theme qua `useVuetifyThemeSync`
- Vue 3 Composition API — theme state và composables
- `culori` — convert oklch → hex cho Vuetify compatibility

---

## 2. Cấu trúc thư mục

```
src/
├── core/
│   ├── ui-system/
│   │   ├── types.ts                  # Tất cả interfaces & types
│   │   ├── palette.ts                # Tailwind color primitives
│   │   ├── tokens/
│   │   │   ├── color.ts              # Semantic color roles (light + dark)
│   │   │   ├── spacing.ts
│   │   │   ├── typography.ts
│   │   │   ├── radius.ts
│   │   │   ├── shadow.ts
│   │   │   ├── z-index.ts
│   │   │   ├── breakpoint.ts
│   │   │   ├── transition.ts
│   │   │   └── index.ts              # Export: tokens, darkTokens
│   │   ├── generator/
│   │   │   ├── index.ts              # Entry point: chạy tất cả generators
│   │   │   ├── css.ts                # Shared utilities: flatten, renderBlock
│   │   │   ├── runner.ts             # I/O: write, validate, log
│   │   │   ├── gen-colors.ts
│   │   │   ├── gen-spacing.ts
│   │   │   ├── gen-typography.ts
│   │   │   ├── gen-radius.ts
│   │   │   ├── gen-shadow.ts
│   │   │   ├── gen-z-index.ts
│   │   │   ├── gen-breakpoint.ts
│   │   │   └── gen-transition.ts
│   │   └── utils/
│   │       └── color-convert.ts      # oklch → hex (dùng cho Vuetify)
│   └── theme/
│       ├── types.ts                  # ThemeMode, ThemeContext, THEME_KEY
│       ├── useThemeState.ts
│       ├── useThemeStorage.ts
│       ├── useThemeDOM.ts
│       ├── useSystemTheme.ts
│       ├── useVuetifyThemeSync.ts
│       ├── useTheme.ts               # Public API cho consumers
│       └── index.ts
├── app/
│   └── providers/
│       └── ThemeProvider.vue
└── assets/
    └── styles/
        ├── main.scss                 # Entry point styles
        ├── tokens.css                # @import tất cả token files
        └── tokens/                   # Auto-generated — không edit thủ công
            ├── colors.css
            ├── spacing.css
            ├── typography.css
            ├── radius.css
            ├── shadow.css
            ├── z-index.css
            ├── breakpoint.css
            └── transition.css
```

---

## 3. Design Tokens

### 3.1 Nguyên tắc phân layer

```
palette.ts          → Primitive colors (tailwindcss/colors — oklch values)
    ↓
tokens/color.ts     → Semantic roles (primary, error, surface, textPrimary...)
    ↓
CSS variables       → --color-primary, --color-error...
    ↓
Components          → Chỉ dùng CSS variables hoặc Tailwind utilities
```

**Quy tắc nghiêm ngặt:** Components không được import từ `palette.ts` hay `tokens/` trực tiếp.

### 3.2 Color tokens

Mỗi theme (light/dark) định nghĩa đầy đủ các semantic roles:

| Nhóm | Roles |
|---|---|
| Brand | `primary`, `primaryHover`, `primaryActive`, `primarySubtle`, `onPrimary` |
| Secondary | `secondary`, `secondaryHover`, `secondaryActive`, `secondarySubtle`, `onSecondary` |
| Accent | `accent`, `accentHover`, `accentActive`, `accentSubtle`, `onAccent` |
| States | `success`, `warning`, `error`, `info` + `*Subtle`, `on*` |
| Surfaces | `background`, `surface`, `surfaceElevated`, `surfaceOverlay` |
| Borders | `border`, `borderSubtle`, `borderStrong`, `borderFocus` |
| Text | `textPrimary`, `textSecondary`, `textTertiary`, `textDisabled`, `textInverse`, `textLink`, `textLinkHover` |

### 3.3 Các token categories

| File | CSS prefix | Ví dụ |
|---|---|---|
| `color.ts` | `--color-*` | `--color-primary` |
| `spacing.ts` | `--spacing-*` | `--spacing-4` |
| `typography.ts` | `--font-family-*`, `--font-size-*`, `--font-weight-*`, `--line-height-*`, `--letter-spacing-*` | `--font-size-xl` |
| `radius.ts` | `--radius-*` | `--radius-md` |
| `shadow.ts` | `--shadow-*` | `--shadow-lg` |
| `z-index.ts` | `--z-*` | `--z-modal` |
| `breakpoint.ts` | `--breakpoint-*` | `--breakpoint-lg` |
| `transition.ts` | `--transition-duration-*`, `--transition-easing-*` | `--transition-duration-base` |

### 3.4 `types.ts` — nguồn sự thật

Mọi token shape đều được khai báo tại `types.ts`. Thêm token mới phải khai báo interface ở đây trước.

```ts
// types.ts
export interface SemanticColorRole {
  readonly primary: string;
  // ... thêm role mới ở đây
}
```

---

## 4. CSS Generator

### 4.1 Chạy generator

```bash
pnpm generate:tokens
```

Output vào `src/assets/styles/tokens/` — **không edit thủ công**.

### 4.2 Cấu trúc generator

| File | Nhiệm vụ |
|---|---|
| `generator/index.ts` | Entry point, gọi tất cả gen-* theo thứ tự |
| `generator/css.ts` | Pure utilities: `flatten`, `renderBlock`, `buildDarkDiff`, `section` |
| `generator/runner.ts` | I/O: `write()`, `validate()`, `banner()`, `logResult()` |
| `generator/gen-colors.ts` | Gen `colors.css` — semantic + dark diff + palette |
| `generator/gen-*.ts` | Mỗi file gen đúng 1 CSS file |

### 4.3 Output mẫu — `colors.css`

```css
/* Auto-generated — do not edit. */

:root {
  /* ── Semantic roles ── */
  --color-primary: oklch(0.511 0.262 276.966);
  --color-primary-hover: oklch(0.444 0.234 277.117);
  --color-background: oklch(0.985 0.002 247.839);
  /* ... */
}

.dark, [data-theme="dark"] {
  --color-primary: oklch(0.673 0.182 276.935);
  --color-background: oklch(0.145 0.005 285.823);
  /* ... chỉ các vars khác với light */
}

:root {
  /* Palette primitives — do NOT use in components */
  --color-palette-indigo-600: oklch(...);
}
```

### 4.4 Dark diff

Generator tự tính diff giữa light và dark — chỉ emit các vars có giá trị thay đổi. Giảm kích thước CSS output đáng kể.

---

## 5. Theme Engine

### 5.1 Composables

| Composable | Nhiệm vụ duy nhất |
|---|---|
| `useThemeState` | Giữ `theme` ref, `isDark` computed, `setTheme`, `toggleTheme` |
| `useThemeStorage` | Đọc/ghi/xóa `localStorage` key `ds:theme` |
| `useThemeDOM` | Apply `class="dark"` và `data-theme` lên `<html>` |
| `useSystemTheme` | Đọc `prefers-color-scheme`, trả về `unwatch` function |
| `useVuetifyThemeSync` | Sync `vuetifyTheme.global.name.value` |
| `useTheme` | Public API — `inject` context từ `ThemeProvider` |

### 5.2 ThemeProvider

`ThemeProvider.vue` là renderless component orchestrate toàn bộ composables:

```
onMounted:
  1. getPersistedTheme() ?? getSystemTheme() → setTheme(initial)

watchEffect (mỗi khi theme thay đổi):
  2. sync(theme)        → Vuetify global theme
  3. applyTheme(theme)  → <html class="dark" data-theme="dark">
  4. persistTheme(theme) → localStorage

watchSystemTheme:
  5. Nếu user chưa set manual → auto-follow OS preference

onUnmounted:
  6. unwatch() → cleanup OS listener
```

**Priority khi khởi động:** `localStorage` > OS preference > `'light'` (default)

### 5.3 Theme state — module-level singleton

`useThemeState` dùng module-level `ref` — đảm bảo mọi consumer nhìn thấy cùng state mà không cần provide/inject riêng cho `theme` ref.

---

## 6. Cài đặt & Khởi động

### 6.1 Setup styles

**`assets/styles/main.scss`**
```scss
@use 'tailwindcss';
@import './tokens.css';
```

**`assets/styles/tokens.css`**
```css
@import './tokens/colors.css';
@import './tokens/spacing.css';
@import './tokens/typography.css';
@import './tokens/radius.css';
@import './tokens/shadow.css';
@import './tokens/z-index.css';
@import './tokens/breakpoint.css';
@import './tokens/transition.css';
```

**`main.ts`**
```ts
import '@/assets/styles/main.scss'
```

### 6.2 Setup ThemeProvider

**`App.vue`**
```vue
<script setup lang="ts">
import ThemeProvider from '@/app/providers/ThemeProvider.vue'
</script>

<template>
  <ThemeProvider>
    <v-app>
      <RouterView />
    </v-app>
  </ThemeProvider>
</template>
```

### 6.3 Generate tokens lần đầu

```bash
pnpm generate:tokens
```

Chạy lại mỗi khi thay đổi bất kỳ file nào trong `tokens/`.

---

## 7. Cách dùng trong component

### 7.1 Theme state

```vue
<script setup lang="ts">
import { useTheme } from '@/core/theme'

const { isDark, toggleTheme, setTheme, resetToSystemTheme } = useTheme()
</script>

<template>
  <button @click="toggleTheme">
    {{ isDark ? 'Light mode' : 'Dark mode' }}
  </button>
</template>
```

### 7.2 CSS variables — inline style

```vue
<style scoped>
.card {
  background:    var(--color-surface);
  border:        1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding:       var(--spacing-6);
  box-shadow:    var(--shadow-md);
  transition:    background var(--transition-duration-base) var(--transition-easing-ease-in-out);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}
</style>
```

### 7.3 Tailwind utilities

Tailwind v4 tự sinh utility classes từ CSS variables — không cần config:

```html
<!-- Colors -->
<button class="bg-primary text-on-primary hover:bg-primary-hover px-4 py-2 rounded-md">
  Submit
</button>

<!-- Text -->
<p class="text-text-secondary text-sm font-medium">
  Helper text
</p>

<!-- Surfaces -->
<div class="bg-surface border border-border rounded-lg shadow-md p-6">
  Card content
</div>

<!-- Dark mode — tự động, không cần prefix dark: -->
<div class="bg-background text-text-primary">
  Tự đổi màu khi ThemeProvider toggle dark
</div>

<!-- Z-index -->
<div class="z-modal fixed inset-0">Modal</div>
```

### 7.4 Transition tokens — chỉ dùng qua var()

Transition tokens không có Tailwind utility class, dùng trực tiếp qua CSS variable:

```css
.btn {
  transition: all var(--transition-duration-base) var(--transition-easing-ease-in-out);
}
```

---

## 8. Thêm token mới

### 8.1 Thêm color role mới

**Bước 1** — Khai báo trong `types.ts`:
```ts
export interface SemanticColorRole {
  // ... existing
  readonly brandNew: string;        // thêm vào đây
  readonly brandNewHover: string;
}
```

**Bước 2** — Gán giá trị trong `tokens/color.ts`:
```ts
export const lightColorTokens = {
  semantic: {
    // ... existing
    brandNew:      teal[500],
    brandNewHover: teal[600],
  },
} as const satisfies ColorTokens;

export const darkColorTokens = {
  semantic: {
    // ... existing
    brandNew:      teal[400],
    brandNewHover: teal[300],
  },
} as const satisfies ColorTokens;
```

**Bước 3** — Chạy generator:
```bash
pnpm generate:tokens
```

**Bước 4** — Dùng ngay:
```html
<div class="bg-brand-new hover:bg-brand-new-hover">...</div>
<!-- hoặc -->
<div style="background: var(--color-brand-new)">...</div>
```

### 8.2 Thêm token category mới (ví dụ: `blur`)

**Bước 1** — Thêm interface vào `types.ts`:
```ts
export interface BlurTokens {
  readonly none: string;
  readonly sm:   string;
  readonly md:   string;
  readonly lg:   string;
}

export interface DesignSystemTokens {
  // ... existing
  readonly blur: BlurTokens;  // thêm vào root contract
}
```

**Bước 2** — Tạo `tokens/blur.ts`:
```ts
import type { BlurTokens } from '../types';

export const blurTokens = {
  none: '0',
  sm:   '4px',
  md:   '8px',
  lg:   '16px',
} as const satisfies BlurTokens;
```

**Bước 3** — Thêm vào `tokens/index.ts`:
```ts
import { blurTokens } from './blur';

const base = {
  // ... existing
  blur: blurTokens,
} as const;
```

**Bước 4** — Tạo `generator/gen-blur.ts`:
```ts
import { tokens }                         from '../tokens/index';
import { section, flatten, renderBlock }  from './css';
import { write, validate, banner, logResult } from './runner';

export function genBlur(): void {
  const sections = [
    section('Blur', flatten(tokens.blur as unknown as Record<string, unknown>, 'blur')),
  ];
  validate(sections, 'blur');
  const content = [banner('gen-blur.ts'), renderBlock(':root', sections), ''].join('\n');
  const filepath = write('blur.css', content);
  logResult(filepath, sections);
}
```

**Bước 5** — Đăng ký trong `generator/index.ts`:
```ts
import { genBlur } from './gen-blur';
// ...
genBlur();
```

**Bước 6** — Import trong `tokens.css`:
```css
@import './tokens/blur.css';
```

---

## 9. Quy tắc & Conventions

### Naming

| Loại | Convention | Ví dụ |
|---|---|---|
| CSS variable | `--{category}-{role}` kebab-case | `--color-primary-hover` |
| Token object | camelCase | `primaryHover` |
| Composable | `use` prefix | `useThemeState` |
| Generator | `gen-` prefix | `gen-colors.ts` |

### Quy tắc import

```
✅ Component → useTheme()
✅ Component → CSS variables (var(--color-*))
✅ Component → Tailwind utilities (bg-primary)
✅ tokens/color.ts → palette.ts
✅ generator/* → tokens/index.ts

❌ Component → palette.ts
❌ Component → tokens/*.ts trực tiếp
❌ Component → --color-palette-* (chỉ dùng --color-*)
```

### SSR Safety

Mọi browser API (`window`, `document`, `localStorage`) đều được guard:

```ts
if (typeof window === 'undefined') return null;
if (typeof document === 'undefined') return;
```

### Không edit thủ công

Toàn bộ `assets/styles/tokens/` là auto-generated. Mọi thay đổi token phải thực hiện trong `core/ui-system/tokens/` rồi chạy `pnpm generate:tokens`.
