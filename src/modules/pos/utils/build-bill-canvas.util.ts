import type { GetOrderDetailDto, GetOrderItemDto } from '../models/dtos/pos-order.dto'
import type { BillStoreInfo } from './build-bill-html.util'
import {
    PAYMENT_METHOD_LABEL,
    SERVICE_TYPE_LABEL,
    formatCurrency,
    formatDateTime,
    isSizeOption,
    groupOptionsByGroupName,
} from './bill-format.util'

const CANVAS_WIDTH = 576
const PADDING_X = 20
const CONTENT_WIDTH = CANVAS_WIDTH - PADDING_X * 2
const FONT_SIZE = 26
const SUB_FONT_SIZE = 22
const LINE_HEIGHT = 34
const SUB_LINE_HEIGHT = 28
const DIVIDER_HEIGHT = 20
const FONT = `${FONT_SIZE}px monospace`
const BOLD_FONT = `bold ${FONT_SIZE}px monospace`
const SUB_FONT = `${SUB_FONT_SIZE}px monospace`
const ITALIC_FONT = `italic ${SUB_FONT_SIZE}px monospace`

type DrawCommand =
    | { kind: 'line'; text: string; align: 'left' | 'center'; font: string; height: number }
    | { kind: 'row'; left: string; right: string; font: string; height: number }
    | { kind: 'divider' }

function createMeasureContext(): CanvasRenderingContext2D {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Không tạo được canvas context.')
    return ctx
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, font: string, maxWidth: number): string[] {
    ctx.font = font
    const words = text.split(' ')
    const lines: string[] = []
    let current = ''
    for (const word of words) {
        const attempt = current ? `${current} ${word}` : word
        if (current && ctx.measureText(attempt).width > maxWidth) {
            lines.push(current)
            current = word
        } else {
            current = attempt
        }
    }
    lines.push(current)
    return lines
}

function renderItemCommands(ctx: CanvasRenderingContext2D, item: GetOrderItemDto, index: number): DrawCommand[] {
    const sizeOption = item.Options.find(isSizeOption)
    const sizeSuffix = sizeOption ? ` (${sizeOption.OptionName})` : ''
    const label = `${index}. ${item.ProductName}${sizeSuffix}`
    const amount = formatCurrency(item.LineNetAmount)

    const commands: DrawCommand[] = []
    ctx.font = FONT
    const wrappedLabel = wrapText(ctx, label, FONT, CONTENT_WIDTH - ctx.measureText(amount).width - 16)
    commands.push({ kind: 'row', left: wrappedLabel[0] ?? '', right: amount, font: FONT, height: LINE_HEIGHT })
    for (const extraLine of wrappedLabel.slice(1)) {
        commands.push({ kind: 'line', text: extraLine, align: 'left', font: FONT, height: LINE_HEIGHT })
    }

    const toppingOptions = item.Options.filter((o) => !isSizeOption(o))
    for (const group of groupOptionsByGroupName(toppingOptions)) {
        const text = `  ${group.groupName ? `${group.groupName}: ` : ''}${group.options.map((o) => o.OptionName).join(', ')}`
        for (const line of wrapText(ctx, text, SUB_FONT, CONTENT_WIDTH)) {
            commands.push({ kind: 'line', text: line, align: 'left', font: SUB_FONT, height: SUB_LINE_HEIGHT })
        }
    }

    return commands
}

export function buildBillCanvas(order: GetOrderDetailDto, store: BillStoreInfo): HTMLCanvasElement {
    const measureCtx = createMeasureContext()
    const commands: DrawCommand[] = []

    commands.push({ kind: 'line', text: store.name, align: 'center', font: BOLD_FONT, height: LINE_HEIGHT })
    if (store.address) {
        for (const line of wrapText(measureCtx, store.address, SUB_FONT, CONTENT_WIDTH)) {
            commands.push({ kind: 'line', text: line, align: 'center', font: SUB_FONT, height: SUB_LINE_HEIGHT })
        }
    }
    if (store.hotline) {
        commands.push({ kind: 'line', text: `ĐT: ${store.hotline}`, align: 'center', font: SUB_FONT, height: SUB_LINE_HEIGHT })
    }
    commands.push({ kind: 'divider' })

    commands.push({ kind: 'row', left: 'Mã đơn', right: `#${order.OrderNumber}`, font: FONT, height: LINE_HEIGHT })
    commands.push({ kind: 'row', left: 'Thời gian', right: formatDateTime(order.CreatedAt), font: FONT, height: LINE_HEIGHT })
    commands.push({
        kind: 'row',
        left: 'Hình thức',
        right: SERVICE_TYPE_LABEL[order.ServiceType] ?? order.ServiceType,
        font: FONT,
        height: LINE_HEIGHT,
    })
    commands.push({ kind: 'divider' })

    commands.push({ kind: 'line', text: 'SẢN PHẨM', align: 'left', font: BOLD_FONT, height: LINE_HEIGHT })
    const totalQuantity = order.Items.reduce((sum, item) => sum + item.Quantity, 0)
    order.Items.forEach((item, idx) => {
        commands.push(...renderItemCommands(measureCtx, item, idx + 1))
    })
    commands.push({ kind: 'divider' })

    commands.push({ kind: 'row', left: 'Tổng số lượng', right: String(totalQuantity), font: FONT, height: LINE_HEIGHT })
    commands.push({ kind: 'row', left: 'Thành tiền', right: formatCurrency(order.Subtotal), font: FONT, height: LINE_HEIGHT })
    if (order.DiscountAmount > 0) {
        commands.push({ kind: 'row', left: 'Giảm giá', right: `-${formatCurrency(order.DiscountAmount)}`, font: FONT, height: LINE_HEIGHT })
    }
    if (order.DeliveryFee > 0) {
        commands.push({ kind: 'row', left: 'Phí giao hàng', right: formatCurrency(order.DeliveryFee), font: FONT, height: LINE_HEIGHT })
    }
    commands.push({ kind: 'divider' })
    commands.push({
        kind: 'row',
        left: 'TỔNG THANH TOÁN',
        right: formatCurrency(order.TotalAmount),
        font: BOLD_FONT,
        height: LINE_HEIGHT,
    })
    commands.push({ kind: 'divider' })

    const paymentMethodLabel = order.PaymentMethod ? PAYMENT_METHOD_LABEL[order.PaymentMethod] ?? order.PaymentMethod : ''
    commands.push({ kind: 'row', left: 'Phương thức', right: paymentMethodLabel, font: FONT, height: LINE_HEIGHT })
    if (order.PaymentMethod === 'Cash' && order.AmountReceived !== null && order.ChangeAmount !== null) {
        commands.push({ kind: 'row', left: 'Số tiền nhận', right: formatCurrency(order.AmountReceived), font: FONT, height: LINE_HEIGHT })
        commands.push({ kind: 'row', left: 'Tiền thừa', right: formatCurrency(order.ChangeAmount), font: FONT, height: LINE_HEIGHT })
    }
    commands.push({ kind: 'divider' })
    commands.push({
        kind: 'line',
        text: 'Cảm ơn quý khách! Hẹn gặp lại lần sau',
        align: 'center',
        font: ITALIC_FONT,
        height: LINE_HEIGHT,
    })

    const contentHeight = commands.reduce((sum, cmd) => sum + (cmd.kind === 'divider' ? DIVIDER_HEIGHT : cmd.height), 0)
    const rawHeight = PADDING_X + contentHeight + PADDING_X
    const canvasHeight = Math.ceil(rawHeight / 8) * 8

    const canvas = document.createElement('canvas')
    canvas.width = CANVAS_WIDTH
    canvas.height = canvasHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Không tạo được canvas context.')

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, CANVAS_WIDTH, canvasHeight)
    ctx.fillStyle = '#000'
    ctx.textBaseline = 'middle'

    let y = PADDING_X
    for (const cmd of commands) {
        if (cmd.kind === 'divider') {
            ctx.strokeStyle = '#000'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(PADDING_X, y + DIVIDER_HEIGHT / 2)
            ctx.lineTo(CANVAS_WIDTH - PADDING_X, y + DIVIDER_HEIGHT / 2)
            ctx.stroke()
            y += DIVIDER_HEIGHT
            continue
        }

        ctx.font = cmd.font
        if (cmd.kind === 'line') {
            ctx.textAlign = cmd.align
            const x = cmd.align === 'center' ? CANVAS_WIDTH / 2 : PADDING_X
            ctx.fillText(cmd.text, x, y + cmd.height / 2)
        } else {
            ctx.textAlign = 'left'
            ctx.fillText(cmd.left, PADDING_X, y + cmd.height / 2)
            ctx.textAlign = 'right'
            ctx.fillText(cmd.right, CANVAS_WIDTH - PADDING_X, y + cmd.height / 2)
        }
        y += cmd.height
    }

    return canvas
}
