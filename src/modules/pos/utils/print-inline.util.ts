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

function nextAnimationFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

/**
 * Đợi trình duyệt vẽ xong khung hình chứa template vừa ghi: qua 2 lần requestAnimationFrame
 * để đảm bảo đã có ít nhất một lần paint sau khi layout được tính lại — không dùng setTimeout đoán thời gian.
 */
async function waitForTemplateRendered(): Promise<void> {
    await nextAnimationFrame()
    await nextAnimationFrame()
}

/**
 * In HTML ngay trên trang hiện tại (không mở tab/window mới): CSS đưa vào một thẻ <style> riêng
 * trong <head> (không lồng trong phần tử ẩn), nội dung ghi vào container ẩn, chỉ hiện khi in.
 */
export async function printHtmlInline(bill: BillHtml): Promise<void> {
    const root = ensurePrintRoot()
    const styleEl = ensureBillStyleElement()

    styleEl.textContent = `@media print { ${bill.styleCss} }`
    root.innerHTML = bill.bodyHtml

    void root.offsetHeight // ép trình duyệt tính layout đồng bộ cho template vừa ghi

    await waitForTemplateRendered()

    window.print()
}
