---
name: fe-check
description: Chạy TypeScript type check cho NDTCore frontend và báo cáo lỗi — dùng khi cần verify types trước khi build
---

Chạy TypeScript type check cho NDTCore frontend và báo cáo lỗi.

```bash
cd C:/NDTCORE/NDTCore/NDTCore.FE && npx vue-tsc --build
```

Sau khi check xong, báo cáo:
- Số lỗi type (nếu có)
- Nếu có lỗi, liệt kê theo file: đường dẫn, dòng, mô tả lỗi
- Nếu clean, xác nhận không có lỗi
