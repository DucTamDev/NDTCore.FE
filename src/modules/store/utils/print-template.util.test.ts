import { describe, expect, it } from 'vitest'
import { FontSizePreset, LabelSize } from '../enums/print-template.enum'
import { NORMAL_RECEIPT_FONT_SIZES } from '../constants/print-template.constants'
import {
    basePriceOf,
    buildPreviewOrder,
    createDefaultLabelTemplate,
    createDefaultReceiptTemplate,
    labelPagesOf,
    labelToppingCapacityOf,
    matchFontSizePreset,
    receiptTotalsOf,
    scaleFontSizes,
    toppingTextOf,
} from './print-template.util'
import type { PrintPreviewItemViewModel } from '../models/view-models/print-preview.view-model'

const topping = (name: string, quantity = 1) => ({ name, quantity, price: 8000 })

const item = (overrides: Partial<PrintPreviewItemViewModel> = {}): PrintPreviewItemViewModel => ({
    name: 'Trà sữa',
    quantity: 1,
    unitPrice: 45000,
    attributes: [],
    toppings: [],
    note: null,
    ...overrides,
})

const sevenToppings = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((name) => topping(name))

describe('mẫu mặc định', () => {
    it('hoá đơn dùng mức Nhỏ, khớp với app in', () => {
        const receipt = createDefaultReceiptTemplate()
        expect(receipt.fontSize).toEqual({
            storeName: 23,
            storeInfo: 16,
            title: 19,
            orderInfo: 16,
            itemName: 17,
            itemDetail: 14,
            totals: 16,
            grandTotal: 22,
            payment: 16,
            footer: 16,
        })
        expect(receipt.padding).toEqual({ top: 16, right: 10, bottom: 40, left: 10 })
    })

    it('các tuỳ chọn chưa có dữ liệu ở app mặc định tắt', () => {
        const receipt = createDefaultReceiptTemplate()
        const offKeys = [
            'showLogo',
            'showPhone',
            'showTable',
            'showCashier',
            'showVat',
            'showWifi',
            'showPaymentQr',
            'showOrderBarcode',
        ] as const
        expect(offKeys.map((key) => receipt[key])).toEqual(offKeys.map(() => false))
        expect(createDefaultLabelTemplate().showCustomerName).toBe(false)
    })

    it('mỗi lần tạo là một bản riêng, sửa bản này không ảnh hưởng bản khác', () => {
        const first = createDefaultReceiptTemplate()
        first.padding.top = 99
        expect(createDefaultReceiptTemplate().padding.top).toBe(16)
    })
})

describe('cỡ chữ theo mức', () => {
    it('nhân theo mức rồi làm tròn về dot nguyên', () => {
        const normal = { title: 22, body: 17 }
        expect(scaleFontSizes(normal, FontSizePreset.Small)).toEqual({ title: 19, body: 14 })
        expect(scaleFontSizes(normal, FontSizePreset.Large)).toEqual({ title: 26, body: 20 })
    })

    it('nhận ra mức đang dùng; chỉnh tay một ô thì không khớp mức nào', () => {
        const small = scaleFontSizes(NORMAL_RECEIPT_FONT_SIZES, FontSizePreset.Small)
        expect(matchFontSizePreset(NORMAL_RECEIPT_FONT_SIZES, small)).toBe(FontSizePreset.Small)
        expect(matchFontSizePreset(NORMAL_RECEIPT_FONT_SIZES, { ...small, title: 30 })).toBeNull()
    })
})

describe('giá và tổng', () => {
    it('đơn giá trước topping cộng tiền topping bằng đơn giá; chỉ ghi x2 khi từ 2 phần', () => {
        const milkTea = item({
            unitPrice: 69000,
            toppings: [topping('Trân châu', 2), topping('Thạch')],
        })
        expect(basePriceOf(milkTea)).toBe(45000)
        expect(milkTea.toppings.map(toppingTextOf)).toEqual(['Trân châu x2', 'Thạch'])
    })

    it('ly trà sữa mẫu cộng tiền topping vào đơn giá', () => {
        const order = buildPreviewOrder(2)
        expect(order.items[1]?.toppings).toHaveLength(2)
        expect(order.items[1]?.unitPrice).toBe(45000 + 2 * 8000 + 8000)
    })

    it('VAT chỉ tính khi bật dòng VAT', () => {
        const order = buildPreviewOrder(0)
        const options = createDefaultReceiptTemplate()
        const withoutVat = receiptTotalsOf(order, options)
        const withVat = receiptTotalsOf(order, { ...options, showVat: true })
        expect(withoutVat.vatAmount).toBe(0)
        expect(withVat.grandTotal).toBe(withoutVat.grandTotal + withVat.vatAmount)
        expect(withVat.vatAmount).toBe(Math.round(withoutVat.grandTotal * 0.08))
    })
})

describe('labelPagesOf', () => {
    const options = createDefaultLabelTemplate()

    it('mỗi phần món một ly, đánh số ly trên cả đơn', () => {
        const pages = labelPagesOf([item({ quantity: 2 }), item({ name: 'Cà phê' })], options)
        expect(pages.map((page) => [page.item.name, page.cupNumber, page.cupCount])).toEqual([
            ['Trà sữa', 1, 3],
            ['Trà sữa', 2, 3],
            ['Cà phê', 3, 3],
        ])
    })

    it('ly nhiều topping hơn mức tối đa thì tách tem liền nhau', () => {
        const pages = labelPagesOf([item({ quantity: 2, toppings: sevenToppings })], options)
        expect(
            pages.map((page) => [
                page.cupNumber,
                page.partNumber,
                page.partCount,
                page.toppings.length,
            ]),
        ).toEqual([
            [1, 1, 2, 5],
            [1, 2, 2, 2],
            [2, 1, 2, 5],
            [2, 2, 2, 2],
        ])
    })

    it('tắt topping thì mỗi ly một tem', () => {
        const pages = labelPagesOf([item({ toppings: sevenToppings })], {
            ...options,
            showToppings: false,
        })
        expect(pages).toHaveLength(1)
        expect(pages[0]?.toppings).toEqual([])
    })
})

describe('labelToppingCapacityOf', () => {
    const options = createDefaultLabelTemplate()

    it('tem 40×30 với mẫu mặc định vừa đúng 5 dòng topping', () => {
        expect(labelToppingCapacityOf(options, LabelSize.Mm40x30)).toBe(5)
    })

    it('tem cao hơn chứa được nhiều hơn', () => {
        expect(labelToppingCapacityOf(options, LabelSize.Mm50x40)).toBeGreaterThan(5)
    })

    it('chữ to và padding lớn thì không còn chỗ cho topping', () => {
        const crowded = {
            ...options,
            padding: { top: 60, right: 10, bottom: 60, left: 10 },
            fontSize: scaleFontSizes(options.fontSize, FontSizePreset.Large),
        }
        expect(labelToppingCapacityOf(crowded, LabelSize.Mm40x30)).toBeLessThan(1)
    })
})
