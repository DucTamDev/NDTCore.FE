import type {
    LabelTemplateFormModel,
    ReceiptTemplateFormModel,
} from '../models/form-models/print-template.model'
import type {
    LabelPageViewModel,
    LabelPreviewViewModel,
    PreviewLine,
    PreviewRowLine,
    PreviewTextLine,
    PrintPreviewItemViewModel,
    PrintPreviewOrderViewModel,
    ReceiptPreviewSection,
} from '../models/view-models/print-preview.view-model'
import {
    basePriceOf,
    formatMoney,
    lineTotalOf,
    receiptTotalsOf,
    toppingTextOf,
    type ReceiptTotals,
} from './print-template.util'

// Bố cục hoá đơn và tem ở đây phải khớp với mẫu của app in (NDTCore.App), vì đây là bản xem trước của chính mẫu đó.

const STORE_SECTION_KEY = 'store'

const row = (
    key: string,
    label: string,
    value: string | null,
    size: number,
    style: { bold?: boolean; indent?: boolean } = {},
): PreviewRowLine => ({
    kind: 'row',
    key,
    label,
    value,
    size,
    bold: style.bold ?? false,
    indent: style.indent ?? false,
})

const text = (
    key: string,
    content: string,
    size: number,
    style: { bold?: boolean; center?: boolean; indent?: boolean } = {},
): PreviewTextLine => ({
    kind: 'text',
    key,
    text: content,
    size,
    bold: style.bold ?? false,
    center: style.center ?? false,
    indent: style.indent ?? false,
})

const storeLines = (
    order: PrintPreviewOrderViewModel,
    options: ReceiptTemplateFormModel,
): PreviewLine[] => {
    const size = options.fontSize.storeInfo
    const lines: PreviewLine[] = []

    if (options.showLogo) lines.push({ kind: 'logo', key: 'logo' })
    if (options.showStoreName) {
        lines.push(
            text('name', order.storeName, options.fontSize.storeName, { bold: true, center: true }),
        )
    }
    if (options.showAddress) lines.push(text('address', order.storeAddress, size, { center: true }))
    if (options.showPhone)
        lines.push(text('phone', `ĐT: ${order.storePhone}`, size, { center: true }))

    return lines
}

const orderLines = (
    order: PrintPreviewOrderViewModel,
    options: ReceiptTemplateFormModel,
): PreviewLine[] => {
    const size = options.fontSize.orderInfo
    const lines: PreviewLine[] = [
        text('title', 'HOÁ ĐƠN BÁN HÀNG', options.fontSize.title, { bold: true, center: true }),
    ]

    if (options.showOrderNumber) lines.push(row('number', 'Mã đơn', `#${order.orderNumber}`, size))
    if (options.showTime) lines.push(row('time', 'Thời gian', order.time, size))
    if (options.showServiceType) lines.push(row('service', 'Hình thức', order.serviceType, size))
    if (options.showTable) lines.push(row('table', 'Bàn', order.table, size))
    if (options.showCashier) lines.push(row('cashier', 'Thu ngân', order.cashierName, size))

    return lines
}

/** Tắt dòng "số lượng × đơn giá" thì số lượng ghi trước tên món để không mất thông tin. */
const itemNameOf = (item: PrintPreviewItemViewModel, options: ReceiptTemplateFormModel): string =>
    options.showUnitPrice || item.quantity === 1 ? item.name : `${item.quantity}x ${item.name}`

const itemLines = (
    item: PrintPreviewItemViewModel,
    key: string,
    options: ReceiptTemplateFormModel,
): PreviewLine[] => {
    const { itemName, itemDetail } = options.fontSize
    const detail = { indent: true }
    const lines: PreviewLine[] = [
        row(key, itemNameOf(item, options), formatMoney(lineTotalOf(item)), itemName, {
            bold: true,
        }),
    ]

    if (options.showUnitPrice) {
        lines.push(
            text(
                `${key}-unit`,
                `${item.quantity} x ${formatMoney(basePriceOf(item))}`,
                itemDetail,
                detail,
            ),
        )
    }
    if (options.showItemOptions && item.attributes.length > 0) {
        lines.push(text(`${key}-attributes`, item.attributes.join(', '), itemDetail, detail))
    }
    if (options.showItemOptions) {
        item.toppings.forEach((topping, index) => {
            const amount = topping.price * topping.quantity * item.quantity
            const value = amount > 0 ? formatMoney(amount) : null
            lines.push(
                row(
                    `${key}-topping-${index}`,
                    `+ ${toppingTextOf(topping)}`,
                    value,
                    itemDetail,
                    detail,
                ),
            )
        })
    }
    if (options.showItemNote && item.note) {
        lines.push(text(`${key}-note`, `Ghi chú: ${item.note}`, itemDetail, detail))
    }

    return lines
}

const totalLines = (
    order: PrintPreviewOrderViewModel,
    totals: ReceiptTotals,
    options: ReceiptTemplateFormModel,
): PreviewLine[] => {
    const size = options.fontSize.totals
    const lines: PreviewLine[] = []

    if (options.showTotalQuantity)
        lines.push(row('quantity', 'Tổng số lượng', String(totals.totalQuantity), size))
    if (options.showSubtotal)
        lines.push(row('subtotal', 'Tạm tính', formatMoney(totals.subtotal), size))
    if (options.showDiscount && order.discountAmount > 0) {
        lines.push(row('discount', 'Giảm giá', `-${formatMoney(order.discountAmount)}`, size))
    }
    if (options.showDeliveryFee && order.deliveryFee > 0) {
        lines.push(row('delivery', 'Phí giao hàng', formatMoney(order.deliveryFee), size))
    }
    if (options.showVat) {
        lines.push(row('vat', `VAT ${order.vatRatePercent}%`, formatMoney(totals.vatAmount), size))
    }

    lines.push(
        row('total', 'TỔNG CỘNG', formatMoney(totals.grandTotal), options.fontSize.grandTotal, {
            bold: true,
        }),
    )
    return lines
}

const paymentLines = (
    order: PrintPreviewOrderViewModel,
    totals: ReceiptTotals,
    options: ReceiptTemplateFormModel,
): PreviewLine[] => {
    const size = options.fontSize.payment
    const lines: PreviewLine[] = []

    if (options.showPaymentMethod)
        lines.push(row('method', 'Thanh toán', order.paymentMethod, size))
    if (options.showCashChange) {
        lines.push(row('received', 'Tiền nhận', formatMoney(order.amountReceived), size))
        lines.push(row('change', 'Tiền thừa', formatMoney(totals.changeAmount), size))
    }

    return lines
}

const footerLines = (
    order: PrintPreviewOrderViewModel,
    totals: ReceiptTotals,
    options: ReceiptTemplateFormModel,
): PreviewLine[] => {
    const size = options.fontSize.footer
    const center = { center: true }
    const lines: PreviewLine[] = []

    if (options.showWifi) {
        lines.push(text('wifi', `Wi-Fi: ${order.wifiSsid}`, size, center))
        lines.push(text('wifi-password', `Mật khẩu: ${order.wifiPassword}`, size, center))
    }
    if (options.showPaymentQr) {
        lines.push({ kind: 'qr', key: 'qr' })
        lines.push(
            text(
                'qr-caption',
                `Quét để chuyển khoản ${formatMoney(totals.grandTotal)}`,
                size,
                center,
            ),
        )
    }
    if (options.showOrderBarcode) {
        lines.push({ kind: 'barcode', key: 'barcode' })
        lines.push(text('barcode-text', order.orderNumber, size, center))
    }
    if (options.footerText)
        lines.push(text('footer', options.footerText, size, { bold: true, center: true }))

    return lines
}

/** Các phần của hoá đơn theo thứ tự in; phần trống bỏ luôn cả đường kẻ của nó. */
export const receiptPreviewSectionsOf = (
    order: PrintPreviewOrderViewModel,
    options: ReceiptTemplateFormModel,
): ReceiptPreviewSection[] => {
    const totals = receiptTotalsOf(order, options)
    const sections = [
        { key: STORE_SECTION_KEY, lines: storeLines(order, options) },
        { key: 'order', lines: orderLines(order, options) },
        {
            key: 'items',
            lines: order.items.flatMap((item, index) => itemLines(item, `item-${index}`, options)),
        },
        { key: 'totals', lines: totalLines(order, totals, options) },
        { key: 'payment', lines: paymentLines(order, totals, options) },
        { key: 'footer', lines: footerLines(order, totals, options) },
    ].filter((section) => section.lines.length > 0)

    return sections.map((section, index) => {
        const previous = sections[index - 1]
        const divider = !previous ? null : previous.key === STORE_SECTION_KEY ? 'solid' : 'dashed'
        return { ...section, divider }
    })
}

/** Thuộc tính và giá chỉ ở tem đầu của ly, ghi chú ở tem cuối. */
export const labelPreviewOf = (
    order: PrintPreviewOrderViewModel,
    page: LabelPageViewModel,
    options: LabelTemplateFormModel,
): LabelPreviewViewModel => {
    const { fontSize } = options
    const { item } = page
    const isFirstPart = page.partNumber === 1
    const isLastPart = page.partNumber === page.partCount
    const lines: PreviewTextLine[] = []

    if (isFirstPart && options.showAttributes && item.attributes.length > 0) {
        lines.push(text('attributes', item.attributes.join(' · '), fontSize.attributes))
    }
    page.toppings.forEach((topping, index) => {
        lines.push(text(`topping-${index}`, `+ ${toppingTextOf(topping)}`, fontSize.toppings))
    })
    if (isLastPart && options.showItemNote && item.note)
        lines.push(text('note', `* ${item.note}`, fontSize.note))
    if (isFirstPart && options.showPrice)
        lines.push(text('price', formatMoney(item.unitPrice), fontSize.attributes))

    const headerParts = [
        options.showOrderNumber ? `#${order.orderNumber}` : '',
        options.showServiceType ? order.serviceType : '',
        options.showCupIndex ? `Ly ${page.cupNumber}/${page.cupCount}` : '',
    ].filter(Boolean)
    const footerLeft = [
        options.showStoreName ? order.storeName : '',
        options.showCustomerName ? order.customerName : '',
    ]
        .filter(Boolean)
        .join(' · ')
    const footerRight = options.showTime ? (order.time.split(' ')[1] ?? '') : ''

    return {
        headerParts,
        itemName: item.name,
        partText: page.partCount > 1 ? `tem ${page.partNumber}/${page.partCount}` : null,
        lines,
        footer: footerLeft || footerRight ? { left: footerLeft, right: footerRight } : null,
    }
}
