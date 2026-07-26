export function printHtmlViaIframe(html: string): void {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    const cleanup = (): void => {
        iframe.contentWindow?.removeEventListener('afterprint', cleanup)
        document.body.removeChild(iframe)
    }

    iframe.onload = (): void => {
        iframe.contentWindow?.addEventListener('afterprint', cleanup)
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
    }

    const doc = iframe.contentDocument
    if (!doc) {
        cleanup()
        throw new Error('Không thể tạo nội dung in.')
    }
    doc.open()
    doc.write(html)
    doc.close()
}