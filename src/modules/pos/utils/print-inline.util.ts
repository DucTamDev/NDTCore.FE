import { POS_PRINT_ROOT_ID } from '../constants/print-bill.constants'

function ensurePrintRoot(): HTMLElement {
    let root = document.getElementById(POS_PRINT_ROOT_ID)
    if (root) return root

    root = document.createElement('div')
    root.id = POS_PRINT_ROOT_ID
    document.body.appendChild(root)

    const printLayoutStyle = document.createElement('style')
    printLayoutStyle.textContent = `
        #${POS_PRINT_ROOT_ID} { display: none; }
        @media print {
            #${POS_PRINT_ROOT_ID} { display: block !important; }
            body > *:not(#${POS_PRINT_ROOT_ID}) { display: none !important; }
        }
    `
    document.head.appendChild(printLayoutStyle)

    return root
}

/**
 * In HTML ngay trên trang hiện tại (không mở tab/window mới): nội dung được ghi vào một container ẩn,
 * CSS `@media print` ẩn toàn bộ phần còn lại của trang và chỉ hiện container này khi in.
 */
export function printHtmlInline(html: string): void {
    const root = ensurePrintRoot()
    root.innerHTML = html

    const cleanup = (): void => {
        window.removeEventListener('afterprint', cleanup)
        root.innerHTML = ''
    }
    window.addEventListener('afterprint', cleanup)

    window.print()
}
