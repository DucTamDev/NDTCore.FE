/**
 * Mở sẵn một cửa sổ trống — phải gọi đồng bộ ngay trong handler của thao tác người dùng (vd. click),
 * trước bất kỳ `await` nào, nếu không mobile browser (Safari iOS, Chrome Android) sẽ chặn như popup.
 */
export function openPrintWindow(): Window | null {
    return window.open('', '_blank', 'width=400,height=600')
}

/**
 * Ghi nội dung bill vào cửa sổ đã mở và kích hoạt in.
 * Dùng cửa sổ thật (thay vì iframe ẩn) vì trên mobile browser, in từ iframe ẩn/0-size
 * không được layout đúng nội dung iframe mà rơi về chụp lại màn hình đang hiển thị.
 */
export function printHtmlInWindow(printWindow: Window, html: string): void {
    const cleanup = (): void => {
        printWindow.removeEventListener('afterprint', cleanup)
        printWindow.close()
    }

    printWindow.onload = (): void => {
        printWindow.addEventListener('afterprint', cleanup)
        printWindow.focus()
        printWindow.print()
    }

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
}
