# Prompt: Đề xuất convention chuẩn cho Detail Page

## Prompt

```
Bạn là senior Vue 3 frontend engineer trong project này.

Hãy phân tích toàn bộ các file detail page hiện có trong project, sau đó đề xuất và viết một file convention `.md` chuẩn chung cho tất cả detail page của mọi entity.

Nhiệm vụ KHÔNG phải mô tả lại code hiện tại mà là đề xuất cấu trúc tốt hơn, nhất quán hơn dựa trên những gì đang có.

## Output

File convention `.md` gồm các phần sau:

1. **Nguyên tắc thiết kế** — các quy tắc nền tảng (separation of concerns, presenter pattern, v.v.)
2. **Cấu trúc file** — naming convention, tổ chức folder
3. **Layout** — ASCII diagram cho từng biến thể, quy tắc chọn layout
4. **Các thành phần** — cấu trúc chuẩn của toolbar, card, audit history kèm code mẫu
5. **Props & Emits** — interface chuẩn, phân biệt tab có form vs tab readonly
6. **Quy tắc đặt tên** — bảng pattern nhất quán cho mọi thành phần

## Yêu cầu

- Convention phải áp dụng được cho mọi entity, không gắn với domain cụ thể
- Ưu tiên nhất quán và dễ follow hơn là tối ưu từng trường hợp
- Code mẫu dùng placeholder chung: `XxxViewModel`, `XxxFormModel`, `ROUTE_NAME`, `formatXxxDate`
- Ngôn ngữ: tiếng Việt, code snippet giữ nguyên tiếng Anh
```