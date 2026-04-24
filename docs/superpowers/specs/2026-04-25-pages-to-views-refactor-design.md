# Design: Hợp nhất `src/pages` → `src/views`

**Date:** 2026-04-25  
**Status:** Approved

## Vấn đề

`src/pages/` là nguồn thực tế được router import trực tiếp. `src/views/` chỉ chứa 6 wrapper rỗng (mỗi file chỉ bọc component tương ứng từ `pages/`). Hai thư mục trùng lặp mục đích, gây nhầm lẫn về nơi đặt page component.

## Mục tiêu

- Xóa `src/pages/` khỏi codebase.
- `src/views/` là nơi duy nhất chứa page-level components, khớp với kiến trúc trong CLAUDE.md.
- Sub-components của từng page chuyển vào `src/components/<feature>/`.
- Business domain data chuyển vào `src/data/`.
- Composable chuyển vào `src/composables/`.

## Mapping đầy đủ

### Views (replace wrapper content)

| Nguồn `src/pages/` | Đích `src/views/` |
|---|---|
| `home/HomePage.vue` | `HomeView.vue` |
| `auth/LoginPage.vue` | `LoginView.vue` |
| `auth/RegisterPage.vue` | `RegisterView.vue` |
| `dashboard/DashboardPage.vue` | `DashboardView.vue` |
| `users/UsersPage.vue` | `UsersView.vue` |
| `NotFoundPage.vue` | `NotFoundView.vue` |

Mỗi view wrapper hiện tại bị thay bằng nội dung thực từ page tương ứng. Import bên trong các view cập nhật sang alias path mới.

### Components

| Nguồn `src/pages/` | Đích `src/components/` |
|---|---|
| `home/components/HomeNav.vue` | `home/HomeNav.vue` |
| `home/components/HomeHero.vue` | `home/HomeHero.vue` |
| `home/components/HomeAbout.vue` | `home/HomeAbout.vue` |
| `home/components/HomeMenu.vue` | `home/HomeMenu.vue` |
| `home/components/HomeFranchise.vue` | `home/HomeFranchise.vue` |
| `home/components/HomeFaq.vue` | `home/HomeFaq.vue` |
| `home/components/HomeContact.vue` | `home/HomeContact.vue` |
| `home/components/HomeFooter.vue` | `home/HomeFooter.vue` |
| `auth/components/LoginForm.vue` | `auth/LoginForm.vue` |
| `auth/components/RegisterForm.vue` | `auth/RegisterForm.vue` |

### Composables

| Nguồn | Đích |
|---|---|
| `src/pages/home/useHomeScroll.ts` | `src/composables/useHomeScroll.ts` |

### Data

| Nguồn | Đích |
|---|---|
| `src/pages/home/data/home.images.ts` | `src/data/home.images.ts` |
| `src/pages/home/data/home.constants.ts` | `src/data/home.constants.ts` |

`src/data/` là thư mục mới, chứa business domain data (menu items, FAQ, bảng giá, danh sách hình ảnh). Khác với `src/constants/` là app-level config/constants (routes, API endpoints, validation rules).

## Router updates

Ba file route cập nhật import path:

- `src/router/routes/public.routes.ts`: `@/pages/home/HomePage` → `@/views/HomeView`, `@/pages/NotFoundPage` → `@/views/NotFoundView`
- `src/router/routes/auth.routes.ts`: `@/pages/auth/LoginPage` → `@/views/LoginView`, `@/pages/auth/RegisterPage` → `@/views/RegisterView`
- `src/router/routes/admin.routes.ts`: `@/pages/dashboard/DashboardPage` → `@/views/DashboardView`, `@/pages/users/UsersPage` → `@/views/UsersView`

## Cấu trúc cuối

```
src/
├── views/
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── DashboardView.vue
│   ├── UsersView.vue
│   └── NotFoundView.vue
├── components/
│   ├── home/
│   │   ├── HomeNav.vue
│   │   ├── HomeHero.vue
│   │   ├── HomeAbout.vue
│   │   ├── HomeMenu.vue
│   │   ├── HomeFranchise.vue
│   │   ├── HomeFaq.vue
│   │   ├── HomeContact.vue
│   │   └── HomeFooter.vue
│   ├── auth/
│   │   ├── LoginForm.vue
│   │   └── RegisterForm.vue
│   ├── common/     (không thay đổi)
│   ├── form/       (không thay đổi)
│   └── layout/     (không thay đổi)
├── composables/
│   └── useHomeScroll.ts   (+ các file hiện có)
├── data/
│   ├── home.images.ts
│   └── home.constants.ts
└── [pages/ — đã xóa]
```

## Không thay đổi

- Tên component (Home*, LoginForm, RegisterForm) giữ nguyên — chỉ di chuyển.
- Logic bên trong mỗi component không được chỉnh sửa.
- Layout files, stores, services, router structure không bị ảnh hưởng.

## Import cần cập nhật (chi tiết)

| File sau khi di chuyển | Import cũ | Import mới |
|---|---|---|
| `src/data/home.constants.ts` | `./home.images` | `./home.images` *(không đổi, cùng thư mục)* |
| `src/components/home/HomeNav.vue` | `../useHomeScroll` | `@/composables/useHomeScroll` |
| `src/components/home/HomeAbout.vue` | `../data/home.constants` | `@/data/home.constants` |
| `src/components/home/HomeFaq.vue` | `../data/home.constants` | `@/data/home.constants` |
| `src/components/home/HomeMenu.vue` | `../data/home.constants` | `@/data/home.constants` |
| `src/components/home/HomeFranchise.vue` | `../data/home.constants` | `@/data/home.constants` |
| `src/views/HomeView.vue` | `./components/Home*` | `@/components/home/Home*` |
| `src/views/LoginView.vue` | `./components/LoginForm` | `@/components/auth/LoginForm` |
| `src/views/RegisterView.vue` | `./components/RegisterForm` | `@/components/auth/RegisterForm` |

## Thứ tự thực hiện

1. Tạo `src/data/`, copy `home.images.ts` và `home.constants.ts` (import giữa hai file không đổi).
2. Copy `useHomeScroll.ts` vào `src/composables/`.
3. Tạo `src/components/home/`, copy 8 Home* components, cập nhật import theo bảng trên.
4. Tạo `src/components/auth/`, copy `LoginForm.vue` và `RegisterForm.vue`.
5. Thay nội dung 6 `src/views/*.vue` bằng nội dung từ page tương ứng, cập nhật import theo bảng trên.
6. Cập nhật 3 route files (`public.routes.ts`, `auth.routes.ts`, `admin.routes.ts`).
7. Xóa `src/pages/`.
8. Chạy `npm run type-check` và `npm run lint` để xác nhận không còn broken import.
