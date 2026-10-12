import { FontSizePreset, LabelSize } from '../enums/print-template.enum'
import {
    DEFAULT_LABEL_FONT_PRESET,
    DEFAULT_LABEL_TEMPLATE,
    DEFAULT_RECEIPT_FONT_PRESET,
    DEFAULT_RECEIPT_TEMPLATE,
    DOTS_PER_MM,
    FONT_SIZE_PRESET_SCALE,
    LABEL_HEIGHT_MARGIN_DOTS,
    LABEL_SIZE_MM,
    LINE_HEIGHT_RATIO,
    NORMAL_LABEL_FONT_SIZES,
    NORMAL_RECEIPT_FONT_SIZES,
    SAMPLE_ORDER,
    SAMPLE_TOPPING_ITEM_INDEX,
    SAMPLE_TOPPING_POOL,
} from '../constants/print-template.constants'
import type {
    LabelTemplateFormModel,
    ReceiptTemplateFormModel,
} from '../models/form-models/print-template.model'
import type {
    LabelPageViewModel,
    PrintPreviewItemViewModel,
    PrintPreviewOrderViewModel,
    PrintPreviewToppingViewModel,
} from '../models/view-models/print-preview.view-model'

/** Các khoản tiền của hoá đơn xem trước. */
export interface ReceiptTotals {
    totalQuantity: number

    subtotal: number

    /** Chỉ cộng khi bật dòng VAT; đơn mẫu không có VAT thật. */
    vatAmount: number

    grandTotal: number

    changeAmount: number
}

/** Nhân mọi cỡ chữ theo mức, làm tròn vì ảnh in tính theo dot nguyên. */
export const scaleFontSizes = <T extends { [K in keyof T]: number }>(
    normal: T,
    preset: FontSizePreset,
): T => {
    const scale = FONT_SIZE_PRESET_SCALE[preset]
    const entries = Object.entries<number>(normal).map(([key, size]) => [
        key,
        Math.round(size * scale),
    ])
    return Object.fromEntries(entries) as T
}

export const createDefaultReceiptTemplate = (): ReceiptTemplateFormModel => ({
    ...DEFAULT_RECEIPT_TEMPLATE,
    padding: { ...DEFAULT_RECEIPT_TEMPLATE.padding },
    fontSize: scaleFontSizes(NORMAL_RECEIPT_FONT_SIZES, DEFAULT_RECEIPT_FONT_PRESET),
})

export const createDefaultLabelTemplate = (): LabelTemplateFormModel => ({
    ...DEFAULT_LABEL_TEMPLATE,
    padding: { ...DEFAULT_LABEL_TEMPLATE.padding },
    fontSize: scaleFontSizes(NORMAL_LABEL_FONT_SIZES, DEFAULT_LABEL_FONT_PRESET),
})

/** Mức đang khớp với bộ cỡ chữ hiện tại; đã chỉnh tay từng ô thì `null`. */
export const matchFontSizePreset = <T extends { [K in keyof T]: number }>(
    normal: T,
    current: T,
): FontSizePreset | null => {
    const presets = Object.values(FontSizePreset)
    const isSame = (preset: FontSizePreset): boolean =>
        JSON.stringify(scaleFontSizes(normal, preset)) === JSON.stringify(current)
    return presets.find(isSame) ?? null
}

export const lineHeightOf = (fontSize: number): number => Math.round(fontSize * LINE_HEIGHT_RATIO)

export const formatMoney = (amount: number): string =>
    `${Math.round(amount).toLocaleString('vi-VN')}đ`

/** Số lượng chỉ ghi khi từ 2 trở lên, cùng dòng với tên để không tốn thêm dòng. */
export const toppingTextOf = (topping: PrintPreviewToppingViewModel): string =>
    topping.quantity > 1 ? `${topping.name} x${topping.quantity}` : topping.name

const toppingAmountOf = (item: PrintPreviewItemViewModel): number =>
    item.toppings.reduce((sum, topping) => sum + topping.price * topping.quantity, 0)

/** Đơn giá trước topping: dòng "số lượng × giá này" cộng các dòng topping ra đúng thành tiền. */
export const basePriceOf = (item: PrintPreviewItemViewModel): number =>
    item.unitPrice - toppingAmountOf(item)

export const lineTotalOf = (item: PrintPreviewItemViewModel): number =>
    item.unitPrice * item.quantity

/** Đơn mẫu với `toppingCount` loại topping cho ly trà sữa; đơn giá cộng thêm tiền topping. */
export const buildPreviewOrder = (toppingCount: number): PrintPreviewOrderViewModel => {
    const toppings = SAMPLE_TOPPING_POOL.slice(0, toppingCount)
    const items = SAMPLE_ORDER.items.map((item, index) => {
        if (index !== SAMPLE_TOPPING_ITEM_INDEX) return item
        const withToppings = { ...item, toppings }
        return { ...withToppings, unitPrice: item.unitPrice + toppingAmountOf(withToppings) }
    })
    return { ...SAMPLE_ORDER, items }
}

export const receiptTotalsOf = (
    order: PrintPreviewOrderViewModel,
    options: ReceiptTemplateFormModel,
): ReceiptTotals => {
    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = order.items.reduce((sum, item) => sum + lineTotalOf(item), 0)
    const beforeVat = subtotal - order.discountAmount + order.deliveryFee
    const vatAmount = options.showVat ? Math.round((beforeVat * order.vatRatePercent) / 100) : 0
    const grandTotal = beforeVat + vatAmount
    return {
        totalQuantity,
        subtotal,
        vatAmount,
        grandTotal,
        changeAmount: order.amountReceived - grandTotal,
    }
}

/** Mỗi phần món một ly; ly nhiều loại topping hơn mức tối đa thì tách tem, các tem của một ly đứng liền nhau. */
export const labelPagesOf = (
    items: PrintPreviewItemViewModel[],
    options: LabelTemplateFormModel,
): LabelPageViewModel[] => {
    const cups = items.flatMap((item) => Array.from({ length: item.quantity }, () => item))
    const maxToppings = Math.max(1, options.maxToppingsPerLabel)

    return cups.flatMap((item, cupIndex) => {
        const toppings = options.showToppings ? item.toppings : []
        const partCount = Math.max(1, Math.ceil(toppings.length / maxToppings))

        return Array.from({ length: partCount }, (_, partIndex) => ({
            item,
            cupNumber: cupIndex + 1,
            cupCount: cups.length,
            partNumber: partIndex + 1,
            partCount,
            toppings: toppings.slice(partIndex * maxToppings, (partIndex + 1) * maxToppings),
        }))
    })
}

/** Chiều cao nội dung tem in được (dot), đúng như app: trừ phần chừa làm tròn. */
export const labelHeightDotsOf = (size: LabelSize): number =>
    LABEL_SIZE_MM[size].heightMm * DOTS_PER_MM - LABEL_HEIGHT_MARGIN_DOTS

export const labelWidthDotsOf = (size: LabelSize): number =>
    LABEL_SIZE_MM[size].widthMm * DOTS_PER_MM

/** Cỡ chữ các dòng không phải topping đang bật, tính trường hợp nặng nhất: tem duy nhất của ly có đủ mọi dòng. */
const fixedLabelRowSizesOf = (options: LabelTemplateFormModel): number[] => {
    const { fontSize } = options
    const hasHeader = options.showOrderNumber || options.showServiceType || options.showCupIndex
    const hasFooter = options.showStoreName || options.showCustomerName || options.showTime
    const rows = [
        hasHeader ? fontSize.header : null,
        fontSize.itemName,
        options.showAttributes ? fontSize.attributes : null,
        options.showItemNote ? fontSize.note : null,
        options.showPrice ? fontSize.attributes : null,
        hasFooter ? fontSize.footer : null,
    ]
    return rows.filter((size): size is number => size !== null)
}

/**
 * Số dòng topping tối đa vừa một tem, coi mỗi dòng khác chỉ một dòng chữ; tên món dài xuống dòng sẽ làm sức chứa thật
 * thấp hơn. Âm nghĩa là tem không còn chỗ cả khi không có topping.
 */
export const labelToppingCapacityOf = (
    options: LabelTemplateFormModel,
    size: LabelSize,
): number => {
    const rowSizes = fixedLabelRowSizesOf(options)
    const { padding, lineGap, fontSize } = options
    const available = labelHeightDotsOf(size) - padding.top - padding.bottom
    const fixedHeight = rowSizes.reduce((sum, rowSize) => sum + lineHeightOf(rowSize), 0)
    const fixedGaps = lineGap * (rowSizes.length - 1)
    const toppingRowHeight = lineHeightOf(fontSize.toppings) + lineGap
    return Math.floor((available - fixedHeight - fixedGaps) / toppingRowHeight)
}
