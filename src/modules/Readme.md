# [Module Name] Module

Module **[ModuleName]** chịu trách nhiệm quản lý toàn bộ nghiệp vụ liên quan đến [domain] trong hệ thống.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Directory Structure](#directory-structure)
- [Data Flow](#data-flow)
- [Key Layers](#key-layers)
- [State Management](#state-management)
- [Design Principles](#design-principles)
- [Rules](#rules)

---

## Architecture Overview

Module được thiết kế theo **layered architecture**, tách rõ trách nhiệm từng phần:

| Layer          | Thư mục               | Trách nhiệm                                       |
| -------------- | --------------------- | ------------------------------------------------- |
| API            | `api/`                | Gọi HTTP API, không chứa logic                    |
| Components     | `components/`         | UI components (form, list, detail tabs)           |
| Composables    | `composables/`        | Business logic, state theo feature                |
| Constants      | `constants/`          | Hằng số domain (emit keys, row action keys, v.v.) |
| Contracts      | `contracts/`          | Shared interfaces / contracts giữa layers         |
| Enums          | `enums/`              | Enum domain, đồng bộ với backend                  |
| Mappers        | `mappers/`            | Chuyển đổi dữ liệu giữa các layer                 |
| Models › DTOs  | `models/dtos/`        | API contract (backend shape)                      |
| Models › Form  | `models/form-models/` | UI form state (v-model, camelCase)                |
| Models › View  | `models/view-models/` | Dữ liệu đã format để hiển thị                     |
| Routes         | `routes/`             | Routing của module                                |
| Services       | `services/`           | Business service layer (optional abstraction)     |
| Stores         | `stores/`             | Pinia state management                            |
| Utils          | `utils/`              | Helper functions                                  |
| Validators     | `validators/`         | Validation rules / schema, reusable logic         |

---

## Directory Structure

```
modules/[module-name]/
├── api/
│   └── [module].api.ts
├── components/
│   ├── [Module]FormDialog.vue
│   ├── [Module]List.vue
│   └── detail/
│       ├── [Module]OverviewTab.vue
│       └── [Module][Feature]Tab.vue
├── composables/
│   └── use[Module].ts
├── constants/
│   ├── [module]-form-dialog.constants.ts
│   └── [module]-list.constants.ts
├── contracts/
│   └── [module].contracts.ts
├── enums/
│   └── [module].enums.ts
├── mappers/
│   └── [module].mapper.ts
├── models/
│   ├── dtos/
│   │   └── [module].dto.ts
│   ├── form-models/
│   │   └── [module].form-model.ts
│   └── view-models/
│       └── [module].view-model.ts
├── routes/
│   └── [module].routes.ts
├── services/
│   └── [module].service.ts
├── stores/
│   └── [module].store.ts
├── utils/
│   └── [module].utils.ts
├── validators/
│   └── [module].validators.ts
└── views/
    ├── [Module]sView.vue
    └── [Module]DetailView.vue
```

---

## Data Flow

### Read (API → UI)

```
API Response → DTO → Mapper → ViewModel → Component
```

### Write (UI → API)

```
Component → FormModel → Mapper → DTO → API
```

> Mapper là điểm duy nhất được phép chuyển đổi dữ liệu giữa các layer.
> Component không được nhận DTO trực tiếp, không được gọi API trực tiếp.

---

## Key Layers

### API Layer (`api/`)

- Chỉ thực hiện HTTP call đến backend
- Không chứa business logic
- Không thực hiện mapping
- Trả về DTO thô

### Mappers (`mappers/`)

- DTO → ViewModel: format dữ liệu để hiển thị (label, text, color)
- FormModel → DTO: chuẩn bị payload gửi lên API
- Là layer duy nhất được chuyển đổi shape dữ liệu

### Composables (`composables/`)

- Xử lý business logic theo feature
- Quản lý local state (loading, dialog, selected item)
- Orchestrate: gọi API → mapping → cập nhật store/UI
- Không chứa UI code, không import Vue component

### Models

| Loại      | Mục đích                                              | Naming           |
| --------- | ----------------------------------------------------- | ---------------- |
| DTO       | Dữ liệu raw từ backend, không dùng trực tiếp trong UI | PascalCase field |
| FormModel | State cho v-model trong form                          | camelCase        |
| ViewModel | Dữ liệu đã format để render (label, text)             | camelCase        |

### Constants (`constants/`)

- Emit keys của từng component (không hard-code string trong template)
- Row action keys
- Static config (columns, filter fields, status config)

### Validators (`validators/`)

- Validation rules tái sử dụng cho form fields
- Sử dụng VALIDATION_RULES từ core/constants/validation.constants
- Không duplicate logic validate giữa các form

### Stores (`stores/`)

- Cache danh sách, shared state giữa pages
- Sync dữ liệu global (ví dụ: sau khi tạo/xóa cần cập nhật nhiều nơi)
- Không chứa UI logic

---

## State Management

```
Local state (ref/reactive)   → composable của feature
Shared / cached state        → Pinia store
Server state (paged list)    → useListPage composable (từ ui/composables)
```

---

## Rules

| Không làm                                         | Thay bằng                                     |
| ------------------------------------------------- | --------------------------------------------- |
| Gọi API trực tiếp trong component                 | Gọi qua composable                            |
| Dùng DTO trực tiếp trong form / template          | Map sang FormModel trước                      |
| Chứa business logic trong component               | Chuyển vào composable                         |
| Duplicate state giữa store và composable          | Một nguồn duy nhất                            |
| Import service trực tiếp trong component          | Qua composable                                |

---

## Design Principles

- **Feature-based architecture** — mỗi module tự đóng gói, ít coupling với module khác
- **Strict separation of concerns** — UI / Domain / API tách biệt rõ ràng
- **Type-safe** — TypeScript strict, không dùng any
- **Reusable UI** — dùng App* components từ components/ui
- **Scalable** — pattern nhất quán, dễ nhân rộng sang module mới (Product, Store, User...)