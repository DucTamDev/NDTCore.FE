import type { BillHtml } from './build-bill-html.util'
import { POS_PRINT_ROOT_ID } from '../constants/print-bill.constants'

const POS_PRINT_STYLE_ID = 'pos-print-bill-style'

function ensurePrintRoot(): HTMLElement {
    let root = document.getElementById(POS_PRINT_ROOT_ID)
    if (root) return root

    root = document.createElement('div')
    root.id = POS_PRINT_ROOT_ID
    document.body.appendChild(root)

    const layoutStyle = document.createElement('style')
    layoutStyle.textContent = `
        #${POS_PRINT_ROOT_ID} { display: none; }
        @media print {
            #${POS_PRINT_ROOT_ID} { display: block !important; }
            body > *:not(#${POS_PRINT_ROOT_ID}) { display: none !important; }
        }
    `
    document.head.appendChild(layoutStyle)

    return root
}

function ensureBillStyleElement(): HTMLStyleElement {
    let style = document.getElementById(POS_PRINT_STYLE_ID) as HTMLStyleElement | null
    if (style) return style

    style = document.createElement('style')
    style.id = POS_PRINT_STYLE_ID
    document.head.appendChild(style)
    return style
}

const RENDER_SETTLE_DELAY_MS = 200

function waitForRenderSettle(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, RENDER_SETTLE_DELAY_MS)))
    })
}

/**
 * In HTML ngay trên trang hiện tại (không mở tab/window mới): CSS đưa vào một thẻ <style> riêng
 * trong <head> (không lồng trong phần tử ẩn), nội dung ghi vào container ẩn, chỉ hiện khi in.
 * Đợi render ổn định trước khi gọi print(): xác nhận qua thiết bị Android thật rằng 2 khung hình
 * animation frame không đủ — trình duyệt cần thêm thời gian thực (setTimeout) mới áp dụng xong
 * CSS/DOM vừa cập nhật, nếu không bản in ra trắng.
 */
export async function printHtmlInline(bill: BillHtml): Promise<void> {
    const root = ensurePrintRoot()
    const styleEl = ensureBillStyleElement()

    styleEl.textContent = `@media print { ${bill.styleCss} }`
    root.innerHTML = bill.bodyHtml

    await waitForRenderSettle()

    window.print()
}
