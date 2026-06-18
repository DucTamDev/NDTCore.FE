import type { GetOrderDetailDto, GetOrderItemDto } from '../models/dtos/pos-order.dto'

export interface BillStoreInfo {
    name: string
    logoUrl: string | null
    address: string
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
    Cash: 'Tiền mặt',
    Card: 'Thẻ',
    Transfer: 'Chuyển khoản',
    EWallet: 'Ví điện tử',
}

const PAYMENT_STATUS_LABEL: Record<string, string> = {
    Unpaid: 'Chưa thanh toán',
    Paid: 'Đã thanh toán',
    Refunded: 'Đã hoàn tiền',
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

function renderItemRow(item: GetOrderItemDto): string {
    const optionsText = item.Options.map((o) => o.OptionName).join(', ')
    return `
        <tr>
            <td>
                ${item.ProductName}
                ${optionsText ? `<div class="bill-item-options">${optionsText}</div>` : ''}
            </td>
            <td class="bill-text-center">${item.Quantity}</td>
            <td class="bill-text-right">${formatCurrency(item.SalePrice)}</td>
            <td class="bill-text-right">${formatCurrency(item.LineNetAmount)}</td>
        </tr>
    `
}

export function buildBillHtml(order: GetOrderDetailDto, store: BillStoreInfo): string {
    const itemRows = order.Items.map(renderItemRow).join('')
    const customerLine = order.CustomerName || order.CustomerPhone
        ? `<div class="bill-row"><span>Khách hàng</span><span>${[order.CustomerName, order.CustomerPhone].filter(Boolean).join(' - ')}</span></div>`
        : ''
    const paymentMethodLabel = order.PaymentMethod ? PAYMENT_METHOD_LABEL[order.PaymentMethod] ?? order.PaymentMethod : ''
    const paymentStatusLabel = order.PaymentStatus ? PAYMENT_STATUS_LABEL[order.PaymentStatus] ?? order.PaymentStatus : ''
    const createdByLine = order.CreatedBy
        ? `<div class="bill-row"><span>Người tạo</span><span>${order.CreatedBy}</span></div>`
        : ''

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<title>Bill ${order.OrderNumber}</title>
<style>
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #000; margin: 0; padding: 16px; }
    .bill-header { text-align: center; margin-bottom: 12px; }
    .bill-logo { max-width: 80px; max-height: 80px; margin-bottom: 8px; }
    .bill-store-name { font-size: 16px; font-weight: bold; }
    .bill-store-address { font-size: 12px; color: #444; }
    .bill-divider { border-top: 1px dashed #000; margin: 8px 0; }
    .bill-row { display: flex; justify-content: space-between; font-size: 12px; margin: 2px 0; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; }
    th, td { padding: 4px 2px; font-size: 12px; text-align: left; }
    th { border-bottom: 1px solid #000; }
    .bill-text-center { text-align: center; }
    .bill-text-right { text-align: right; }
    .bill-item-options { font-size: 11px; color: #666; }
    .bill-totals .bill-row { font-size: 13px; }
    .bill-totals .bill-row.bill-total { font-weight: bold; font-size: 14px; }
</style>
</head>
<body>
    <div class="bill-header">
        ${store.logoUrl ? `<img class="bill-logo" src="${store.logoUrl}" />` : ''}
        <div class="bill-store-name">${store.name}</div>
        ${store.address ? `<div class="bill-store-address">${store.address}</div>` : ''}
    </div>

    <div class="bill-divider"></div>

    <div class="bill-row"><span>Số đơn</span><span>#${order.OrderNumber}</span></div>
    <div class="bill-row"><span>Thời gian</span><span>${formatDateTime(order.CreatedAt)}</span></div>
    ${customerLine}

    <div class="bill-divider"></div>

    <table>
        <thead>
            <tr>
                <th>Sản phẩm</th>
                <th class="bill-text-center">SL</th>
                <th class="bill-text-right">Đơn giá</th>
                <th class="bill-text-right">Thành tiền</th>
            </tr>
        </thead>
        <tbody>
            ${itemRows}
        </tbody>
    </table>

    <div class="bill-divider"></div>

    <div class="bill-totals">
        <div class="bill-row"><span>Tạm tính</span><span>${formatCurrency(order.Subtotal)}</span></div>
        <div class="bill-row"><span>Giảm giá</span><span>-${formatCurrency(order.DiscountAmount)}</span></div>
        <div class="bill-row"><span>Thuế</span><span>${formatCurrency(order.TaxAmount)}</span></div>
        <div class="bill-row bill-total"><span>Tổng cộng</span><span>${formatCurrency(order.TotalAmount)}</span></div>
    </div>

    <div class="bill-divider"></div>

    <div class="bill-row"><span>Thanh toán</span><span>${paymentMethodLabel}</span></div>
    <div class="bill-row"><span>Trạng thái</span><span>${paymentStatusLabel}</span></div>
    ${createdByLine}
</body>
</html>
    `
}