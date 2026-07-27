import type { GetOrderItemOptionDto } from '../models/dtos/pos-order.dto'

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
    Cash: 'Tiền mặt',
    Card: 'Thẻ',
    Transfer: 'Chuyển khoản',
    EWallet: 'Ví điện tử',
}

export const SERVICE_TYPE_LABEL: Record<string, string> = {
    TakeAway: 'Mang đi',
    DineIn: 'Ngồi lại',
    Delivery: 'Giao hàng',
}

export function formatCurrency(value: number): string {
    return `${value.toLocaleString('vi-VN')}₫`
}

export function formatDateTime(iso: string | null): string {
    if (!iso) return ''
    return new Date(iso).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function isSizeOption(o: GetOrderItemOptionDto): boolean {
    return (o.GroupName ?? '').toLowerCase() === 'size'
}

export function groupOptionsByGroupName(options: GetOrderItemOptionDto[]): { groupName: string; options: GetOrderItemOptionDto[] }[] {
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
