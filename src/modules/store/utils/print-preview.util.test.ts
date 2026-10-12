import { describe, expect, it } from 'vitest'
import { labelPreviewOf, receiptPreviewSectionsOf } from './print-preview.util'
import {
    buildPreviewOrder,
    createDefaultLabelTemplate,
    createDefaultReceiptTemplate,
    labelPagesOf,
} from './print-template.util'
import type {
    PreviewLine,
    ReceiptPreviewSection,
} from '../models/view-models/print-preview.view-model'

/** Chữ của một dòng: nhãn (và giá trị) hoặc nội dung; khối hình theo loại. */
const textOf = (line: PreviewLine): string => {
    if (line.kind === 'row') return line.value ? `${line.label} | ${line.value}` : line.label
    if (line.kind === 'text') return line.text
    return `[${line.kind}]`
}

const linesOf = (sections: ReceiptPreviewSection[]): string[] =>
    sections.flatMap((section) => section.lines.map(textOf))

const order = buildPreviewOrder(2)

describe('receiptPreviewSectionsOf', () => {
    it('mẫu mặc định: đầu bill, thông tin đơn, món, tổng, thanh toán, chân bill; kẻ liền sau đầu bill', () => {
        const sections = receiptPreviewSectionsOf(order, createDefaultReceiptTemplate())
        expect(sections.map((section) => [section.key, section.divider])).toEqual([
            ['store', null],
            ['order', 'solid'],
            ['items', 'dashed'],
            ['totals', 'dashed'],
            ['payment', 'dashed'],
            ['footer', 'dashed'],
        ])
    })

    it('mặc định không có SĐT, bàn, thu ngân, VAT, Wi-Fi, QR, mã vạch, logo', () => {
        const lines = linesOf(receiptPreviewSectionsOf(order, createDefaultReceiptTemplate()))
        expect(
            lines.some((line) => /ĐT:|Bàn|Thu ngân|VAT|Wi-Fi|\[qr]|\[barcode]|\[logo]/.test(line)),
        ).toBe(false)
    })

    it('món có thành tiền, dòng số lượng × giá trước topping, thuộc tính, topping x2 và ghi chú', () => {
        const lines = linesOf(receiptPreviewSectionsOf(order, createDefaultReceiptTemplate()))
        const start = lines.indexOf('Trà sữa trân châu | 69.000đ')
        expect(lines.slice(start, start + 6)).toEqual([
            'Trà sữa trân châu | 69.000đ',
            '1 x 45.000đ',
            'Size M, 50% đường, Ít đá',
            '+ Trân châu đen x2 | 16.000đ',
            '+ Thạch dừa | 8.000đ',
            'Ghi chú: Không lấy ống hút',
        ])
    })

    it('bật hết tuỳ chọn thì có đủ các dòng và khối hình', () => {
        const allOn = {
            ...createDefaultReceiptTemplate(),
            showLogo: true,
            showPhone: true,
            showTable: true,
            showCashier: true,
            showVat: true,
            showWifi: true,
            showPaymentQr: true,
            showOrderBarcode: true,
        }
        const lines = linesOf(receiptPreviewSectionsOf(order, allOn))
        expect(lines).toEqual(
            expect.arrayContaining([
                '[logo]',
                'ĐT: 028 3822 1234',
                'Bàn | B05',
                'Thu ngân | Lan',
                '[qr]',
                '[barcode]',
                'Wi-Fi: NDTCore_Guest',
            ]),
        )
        expect(lines.findIndex((line) => line.startsWith('VAT 8%'))).toBeLessThan(
            lines.findIndex((line) => line.startsWith('TỔNG CỘNG')),
        )
    })

    it('tắt đầu bill thì phần đầu tiên là thông tin đơn, không có kẻ liền', () => {
        const options = {
            ...createDefaultReceiptTemplate(),
            showStoreName: false,
            showAddress: false,
        }
        const sections = receiptPreviewSectionsOf(order, options)
        expect(sections[0]).toMatchObject({ key: 'order', divider: null })
        expect(sections.some((section) => section.divider === 'solid')).toBe(false)
    })
})

describe('labelPreviewOf', () => {
    const options = { ...createDefaultLabelTemplate(), showServiceType: true }
    const sevenToppingOrder = buildPreviewOrder(7)
    const pages = labelPagesOf(sevenToppingOrder.items, options)
    const milkTeaPages = pages.filter((page) => page.item.name === 'Trà sữa trân châu')

    it('dòng trên theo thứ tự mã đơn → hình thức → số thứ tự ly', () => {
        expect(labelPreviewOf(sevenToppingOrder, pages[0]!, options).headerParts).toEqual([
            '#A1024',
            'Mang đi',
            'Ly 1/4',
        ])
    })

    it('tem đầu có "tem 1/2", thuộc tính, 5 topping, giá; tem sau có topping còn lại và ghi chú', () => {
        const [first, second] = milkTeaPages.map((page) =>
            labelPreviewOf(sevenToppingOrder, page, options),
        )
        expect(first?.partText).toBe('tem 1/2')
        expect(first?.lines.map((line) => line.text)).toEqual([
            'Size M · 50% đường · Ít đá',
            '+ Trân châu đen x2',
            '+ Thạch dừa',
            '+ Pudding trứng x3',
            '+ Kem cheese',
            '+ Trân châu trắng',
            '133.000đ',
        ])
        expect(second?.lines.map((line) => line.text)).toEqual([
            '+ Thạch cà phê x2',
            '+ Hạt sen',
            '* Không lấy ống hút',
        ])
    })

    it('dòng dưới mặc định tắt; bật thì tên quán · tên khách và giờ', () => {
        expect(labelPreviewOf(order, pages[0]!, options).footer).toBeNull()
        const footerOn = { ...options, showStoreName: true, showCustomerName: true, showTime: true }
        expect(labelPreviewOf(order, pages[0]!, footerOn).footer).toEqual({
            left: 'NDTCore Coffee · Anh Minh',
            right: '10:42',
        })
    })
})
