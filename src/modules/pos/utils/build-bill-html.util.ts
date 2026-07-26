import { POS_PRINT_ROOT_ID } from '../constants/print-bill.constants'
import type { GetOrderDetailDto, GetOrderItemDto, GetOrderItemOptionDto } from '../models/dtos/pos-order.dto'

export interface BillStoreInfo {
    name: string
    address: string
    hotline: string | null
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
    Cash: 'Tiền mặt',
    Card: 'Thẻ',
    Transfer: 'Chuyển khoản',
    EWallet: 'Ví điện tử',
}

const SERVICE_TYPE_LABEL: Record<string, string> = {
    TakeAway: 'Mang đi',
    DineIn: 'Ngồi lại',
    Delivery: 'Giao hàng',
}

function formatCurrency(value: number): string {
    return `${value.toLocaleString('vi-VN')}₫`
}

function formatDateTime(iso: string | null): string {
    if (!iso) return ''
    return new Date(iso).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function isSizeOption(o: GetOrderItemOptionDto): boolean {
    return (o.GroupName ?? '').toLowerCase() === 'size'
}

function groupOptionsByGroupName(options: GetOrderItemOptionDto[]): { groupName: string; options: GetOrderItemOptionDto[] }[] {
    const map = new Map<string, { groupName: string; options: GetOrderItemOptionDto[] }>()
    for (const opt of options) {
        const key = opt.GroupName ?? ''
        if (!map.has(key)) {
            map.set(key, { groupName: opt.GroupName ?? '', options: [] })
        }
        map.get(key)!.options.push(opt)
    }
    return Array.from(map.values())
}

function renderItemBlock(item: GetOrderItemDto, index: number): string {
    const sizeOption = item.Options.find(isSizeOption)
    const sizeSuffix = sizeOption ? ` (${sizeOption.OptionName})` : ''
    const toppingOptions = item.Options.filter((o) => !isSizeOption(o))
    const groupedOptions = groupOptionsByGroupName(toppingOptions)

    const toppingLines = groupedOptions
        .map((group) => `<div class="bill-item-sub">${group.groupName ? `${group.groupName}: ` : ''}${group.options.map((o) => o.OptionName).join(', ')}</div>`)
        .join('')

    return `
        <div class="bill-item">
            <div class="bill-row">
                <span>${index}. ${item.ProductName}${sizeSuffix}</span>
                <span class="bill-item-amount">${formatCurrency(item.LineNetAmount)}</span>
            </div>
            ${toppingLines}
        </div>
    `
}

export function buildBillHtml(order: GetOrderDetailDto, store: BillStoreInfo): string {
    const itemBlocks = order.Items.map((item, idx) => renderItemBlock(item, idx + 1)).join('')
    const totalQuantity = order.Items.reduce((sum, item) => sum + item.Quantity, 0)

    const addressLine = store.address
        ? `<div class="bill-store-address">${store.address}</div>`
        : ''
    const hotlineLine = store.hotline
        ? `<div class="bill-store-hotline">ĐT: ${store.hotline}</div>`
        : ''

    const serviceTypeLabel = SERVICE_TYPE_LABEL[order.ServiceType] ?? order.ServiceType

    const discountLine = order.DiscountAmount > 0
        ? `<div class="bill-row"><span>Giảm giá</span><span>-${formatCurrency(order.DiscountAmount)}</span></div>`
        : ''
    const deliveryFeeLine = order.DeliveryFee > 0
        ? `<div class="bill-row"><span>Phí giao hàng</span><span>${formatCurrency(order.DeliveryFee)}</span></div>`
        : ''

    const paymentMethodLabel = order.PaymentMethod
        ? PAYMENT_METHOD_LABEL[order.PaymentMethod] ?? order.PaymentMethod
        : ''
    const cashPaymentLines = order.PaymentMethod === 'Cash' && order.AmountReceived !== null && order.ChangeAmount !== null
        ? `
        <div class="bill-row"><span>Số tiền nhận</span><span>${formatCurrency(order.AmountReceived)}</span></div>
        <div class="bill-row"><span>Tiền thừa</span><span>${formatCurrency(order.ChangeAmount)}</span></div>`
        : ''

    const root = `#${POS_PRINT_ROOT_ID}`

    return `
<style>
@media print {
    @page { size: 58mm auto; margin: 0; }
    ${root}, ${root} * { box-sizing: border-box; }
    ${root} {
        font-family: 'Courier New', monospace;
        font-size: 11px;
        line-height: 1.35;
        color: #000;
        width: 58mm;
        padding: 4mm 2mm;
    }
    ${root} .bill-header { text-align: center; margin-bottom: 6px; }
    ${root} .bill-store-name { font-size: 13px; font-weight: bold; letter-spacing: 0.3px; word-break: break-word; }
    ${root} .bill-store-address, ${root} .bill-store-hotline { font-size: 10px; color: #000; word-break: break-word; }
    ${root} .bill-divider { border-top: 1px dashed #000; margin: 5px 0; }
    ${root} .bill-row { display: flex; justify-content: space-between; gap: 4px; font-size: 11px; margin: 2px 0; }
    ${root} .bill-row span:first-child { flex: 1 1 auto; min-width: 0; word-break: break-word; }
    ${root} .bill-row span:last-child { flex: 0 0 auto; text-align: right; white-space: nowrap; }
    ${root} .bill-products-label { font-size: 11px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 3px; letter-spacing: 0.5px; }
    ${root} .bill-item { margin: 7px 0; }
    ${root} .bill-item-amount { font-weight: bold; }
    ${root} .bill-item-sub { font-size: 10px; color: #000; padding-left: 8px; margin: 1px 0; }
    ${root} .bill-total { display: flex; justify-content: space-between; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 5px 0; font-size: 13px; font-weight: bold; margin: 5px 0; }
    ${root} .bill-footer { text-align: center; font-style: italic; font-size: 10px; margin-top: 10px; margin-bottom: 4px; }
}
</style>
<div class="bill-header">
    <div class="bill-store-name">${store.name}</div>
    ${addressLine}
    ${hotlineLine}
</div>

<div class="bill-divider"></div>

<div class="bill-row"><span>Mã đơn</span><span>#${order.OrderNumber}</span></div>
<div class="bill-row"><span>Thời gian</span><span>${formatDateTime(order.CreatedAt)}</span></div>
<div class="bill-row"><span>Hình thức</span><span>${serviceTypeLabel}</span></div>

<div class="bill-divider"></div>

<div class="bill-products">
    <div class="bill-products-label">SẢN PHẨM</div>
    ${itemBlocks}
</div>

<div class="bill-divider"></div>

<div class="bill-summary">
    <div class="bill-row"><span>Tổng số lượng</span><span>${totalQuantity}</span></div>
    <div class="bill-row"><span>Tạm tính</span><span>${formatCurrency(order.Subtotal)}</span></div>
    ${discountLine}
    ${deliveryFeeLine}
    <div class="bill-total"><span>TỔNG THANH TOÁN</span><span>${formatCurrency(order.TotalAmount)}</span></div>
</div>

<div class="bill-payment">
    <div class="bill-row"><span>Phương thức</span><span>${paymentMethodLabel}</span></div>
    ${cashPaymentLines}
</div>

<div class="bill-divider"></div>

<div class="bill-footer">Cảm ơn quý khách! Hẹn gặp lại lần sau</div>
    `
}