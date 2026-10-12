import { FontSizePreset, LabelSize, ReceiptPaperWidth } from '../enums/print-template.enum'
import type {
    LabelFontSizesFormModel,
    LabelTemplateFormModel,
    LabelToggleKey,
    PrintPaddingFormModel,
    ReceiptFontSizesFormModel,
    ReceiptTemplateFormModel,
    ReceiptToggleKey,
} from '../models/form-models/print-template.model'
import type {
    PrintPreviewOrderViewModel,
    PrintPreviewToppingViewModel,
} from '../models/view-models/print-preview.view-model'

/** 203 dpi ≈ 8 dot/mm — mật độ của máy in nhiệt; cỡ chữ, padding đều tính bằng dot. */
export const DOTS_PER_MM = 8

/** Khoảng cách dòng theo cỡ chữ, giống app in; thấp hơn thì dấu tiếng Việt hai dòng liền nhau dễ chạm nhau. */
export const LINE_HEIGHT_RATIO = 1.3

/** App chừa 2 dot vì ảnh chụp làm tròn có thể dư, ảnh cao hơn tem bị từ chối in. */
export const LABEL_HEIGHT_MARGIN_DOTS = 2

/** Bề rộng ảnh in theo khổ giấy (dot), lấy theo vùng in được của đầu in. */
export const RECEIPT_PAPER_DOTS: Record<ReceiptPaperWidth, number> = {
    [ReceiptPaperWidth.Mm58]: 384,
    [ReceiptPaperWidth.Mm80]: 576,
}

/** Kích thước tem (mm). */
export const LABEL_SIZE_MM: Record<LabelSize, { widthMm: number; heightMm: number }> = {
    [LabelSize.Mm40x30]: { widthMm: 40, heightMm: 30 },
    [LabelSize.Mm50x30]: { widthMm: 50, heightMm: 30 },
    [LabelSize.Mm50x40]: { widthMm: 50, heightMm: 40 },
}

/** Hệ số nhân với cỡ chữ mức `Normal`. */
export const FONT_SIZE_PRESET_SCALE: Record<FontSizePreset, number> = {
    [FontSizePreset.Small]: 0.85,
    [FontSizePreset.Normal]: 1,
    [FontSizePreset.Large]: 1.2,
}

export const FONT_SIZE_PRESET_LABELS: Record<FontSizePreset, string> = {
    [FontSizePreset.Small]: 'Nhỏ',
    [FontSizePreset.Normal]: 'Vừa',
    [FontSizePreset.Large]: 'Lớn',
}

/** Cỡ chữ hoá đơn mức `Normal`; nhỏ nhất ở mức `Small` là 14 dot, còn đọc được dấu tiếng Việt trên giấy nhiệt. */
export const NORMAL_RECEIPT_FONT_SIZES: ReceiptFontSizesFormModel = {
    storeName: 27,
    storeInfo: 19,
    title: 22,
    orderInfo: 19,
    itemName: 20,
    itemDetail: 17,
    totals: 19,
    grandTotal: 26,
    payment: 19,
    footer: 19,
}

/** Cỡ chữ tem mức `Normal`, vừa tem 40×30mm với 5 dòng topping. */
export const NORMAL_LABEL_FONT_SIZES: LabelFontSizesFormModel = {
    header: 15,
    itemName: 15,
    attributes: 12,
    toppings: 12,
    note: 12,
    footer: 15,
}

/** Mức cỡ chữ mặc định: hoá đơn dùng Nhỏ để bill ngắn, tem dùng Vừa. */
export const DEFAULT_RECEIPT_FONT_PRESET = FontSizePreset.Small

export const DEFAULT_LABEL_FONT_PRESET = FontSizePreset.Normal

/** Mẫu hoá đơn mặc định, trùng với app in; cỡ chữ suy ra từ mức mặc định trong `createDefaultReceiptTemplate`. */
export const DEFAULT_RECEIPT_TEMPLATE: Omit<ReceiptTemplateFormModel, 'fontSize'> = {
    padding: { top: 16, right: 10, bottom: 40, left: 10 },
    sectionGap: 10,
    lineGap: 5,
    showLogo: false,
    showStoreName: true,
    showAddress: true,
    showPhone: false,
    showOrderNumber: true,
    showTime: true,
    showServiceType: true,
    showTable: false,
    showCashier: false,
    showItemOptions: true,
    showItemNote: true,
    showUnitPrice: true,
    showTotalQuantity: true,
    showSubtotal: true,
    showDiscount: true,
    showDeliveryFee: true,
    showVat: false,
    showPaymentMethod: true,
    showCashChange: true,
    showWifi: false,
    showPaymentQr: false,
    showOrderBarcode: false,
    footerText: 'Cảm ơn quý khách! Hẹn gặp lại',
}

/** Mẫu tem mặc định, trùng với app in; cỡ chữ suy ra từ mức mặc định trong `createDefaultLabelTemplate`. */
export const DEFAULT_LABEL_TEMPLATE: Omit<LabelTemplateFormModel, 'fontSize'> = {
    padding: { top: 10, right: 10, bottom: 10, left: 10 },
    lineGap: 4,
    maxToppingsPerLabel: 5,
    showOrderNumber: true,
    showServiceType: false,
    showCupIndex: true,
    showAttributes: true,
    showToppings: true,
    showItemNote: true,
    showPrice: true,
    showStoreName: false,
    showCustomerName: false,
    showTime: false,
}

export const RECEIPT_FONT_SIZE_LABELS: Record<keyof ReceiptFontSizesFormModel, string> = {
    storeName: 'Tên quán',
    storeInfo: 'Địa chỉ, SĐT',
    title: 'Tiêu đề bill',
    orderInfo: 'Thông tin đơn',
    itemName: 'Tên món',
    itemDetail: 'Dòng phụ của món',
    totals: 'Tổng phụ',
    grandTotal: 'Tổng cộng',
    payment: 'Thanh toán',
    footer: 'Chân bill',
}

export const LABEL_FONT_SIZE_LABELS: Record<keyof LabelFontSizesFormModel, string> = {
    header: 'Dòng trên',
    itemName: 'Tên món',
    attributes: 'Size/đường/đá',
    toppings: 'Topping',
    note: 'Ghi chú',
    footer: 'Dòng dưới',
}

export const PADDING_LABELS: Record<keyof PrintPaddingFormModel, string> = {
    top: 'Trên',
    right: 'Phải',
    bottom: 'Dưới',
    left: 'Trái',
}

export const RECEIPT_TOGGLE_LABELS: Record<ReceiptToggleKey, string> = {
    showLogo: 'Logo',
    showStoreName: 'Tên quán',
    showAddress: 'Địa chỉ',
    showPhone: 'Số điện thoại',
    showOrderNumber: 'Mã đơn',
    showTime: 'Thời gian',
    showServiceType: 'Hình thức',
    showTable: 'Số bàn',
    showCashier: 'Thu ngân',
    showItemOptions: 'Tuỳ chọn món',
    showItemNote: 'Ghi chú món',
    showUnitPrice: 'SL × đơn giá',
    showTotalQuantity: 'Tổng số lượng',
    showSubtotal: 'Tạm tính',
    showDiscount: 'Giảm giá',
    showDeliveryFee: 'Phí giao',
    showVat: 'VAT',
    showPaymentMethod: 'Phương thức',
    showCashChange: 'Tiền nhận / thừa',
    showWifi: 'Wi-Fi',
    showPaymentQr: 'QR chuyển khoản',
    showOrderBarcode: 'Mã vạch đơn',
}

export const LABEL_TOGGLE_LABELS: Record<LabelToggleKey, string> = {
    showOrderNumber: 'Mã đơn',
    showServiceType: 'Hình thức',
    showCupIndex: 'Số thứ tự ly',
    showAttributes: 'Size / đường / đá',
    showToppings: 'Topping',
    showItemNote: 'Ghi chú',
    showPrice: 'Giá',
    showStoreName: 'Tên quán',
    showCustomerName: 'Tên khách',
    showTime: 'Giờ',
}

/** Nhóm tuỳ chọn hoá đơn theo phần của bill, đúng thứ tự in. */
export const RECEIPT_TOGGLE_GROUPS: { title: string; keys: ReceiptToggleKey[] }[] = [
    { title: 'Đầu bill', keys: ['showLogo', 'showStoreName', 'showAddress', 'showPhone'] },
    {
        title: 'Thông tin đơn',
        keys: ['showOrderNumber', 'showTime', 'showServiceType', 'showTable', 'showCashier'],
    },
    { title: 'Món', keys: ['showItemOptions', 'showItemNote', 'showUnitPrice'] },
    {
        title: 'Tổng tiền & thanh toán',
        keys: [
            'showTotalQuantity',
            'showSubtotal',
            'showDiscount',
            'showDeliveryFee',
            'showVat',
            'showPaymentMethod',
            'showCashChange',
        ],
    },
    { title: 'Chân bill', keys: ['showWifi', 'showPaymentQr', 'showOrderBarcode'] },
]

/** Nhóm tuỳ chọn tem theo dòng của tem. */
export const LABEL_TOGGLE_GROUPS: { title: string; keys: LabelToggleKey[] }[] = [
    { title: 'Dòng trên', keys: ['showOrderNumber', 'showServiceType', 'showCupIndex'] },
    {
        title: 'Nội dung món',
        keys: ['showAttributes', 'showToppings', 'showItemNote', 'showPrice'],
    },
    { title: 'Dòng dưới', keys: ['showStoreName', 'showCustomerName', 'showTime'] },
]

/** Giới hạn ô nhập số của trang chỉnh mẫu (dot). */
export const FONT_SIZE_RANGE = { min: 8, max: 64 }

export const SPACING_RANGE = { min: 0, max: 80 }

export const MAX_TOPPINGS_RANGE = { min: 1, max: 12 }

/** Số topping của ly trà sữa mẫu, chỉnh được để thử tách tem. */
export const SAMPLE_TOPPING_RANGE = { min: 0, max: 8 }

export const DEFAULT_SAMPLE_TOPPING_COUNT = 7

export const SAMPLE_TOPPING_POOL: PrintPreviewToppingViewModel[] = [
    { name: 'Trân châu đen', quantity: 2, price: 8000 },
    { name: 'Thạch dừa', quantity: 1, price: 8000 },
    { name: 'Pudding trứng', quantity: 3, price: 8000 },
    { name: 'Kem cheese', quantity: 1, price: 8000 },
    { name: 'Trân châu trắng', quantity: 1, price: 8000 },
    { name: 'Thạch cà phê', quantity: 2, price: 8000 },
    { name: 'Hạt sen', quantity: 1, price: 8000 },
    { name: 'Nha đam', quantity: 1, price: 8000 },
]

/** Đơn mẫu; món trà sữa nhận topping theo số đang chọn (xem `buildPreviewOrder`). */
export const SAMPLE_ORDER: PrintPreviewOrderViewModel = {
    storeName: 'NDTCore Coffee',
    storeAddress: '123 Nguyễn Huệ, Q.1, TP.HCM',
    storePhone: '028 3822 1234',
    orderNumber: 'A1024',
    time: '12/10/2026 10:42',
    serviceType: 'Mang đi',
    table: 'B05',
    cashierName: 'Lan',
    customerName: 'Anh Minh',
    items: [
        {
            name: 'Cà phê sữa đá',
            quantity: 2,
            unitPrice: 29000,
            attributes: ['Size L', 'Ít đá'],
            toppings: [],
            note: null,
        },
        {
            name: 'Trà sữa trân châu',
            quantity: 1,
            unitPrice: 45000,
            attributes: ['Size M', '50% đường', 'Ít đá'],
            toppings: [],
            note: 'Không lấy ống hút',
        },
        {
            name: 'Bánh mì thịt nướng',
            quantity: 1,
            unitPrice: 35000,
            attributes: [],
            toppings: [],
            note: null,
        },
    ],
    discountAmount: 10000,
    deliveryFee: 15000,
    vatRatePercent: 8,
    paymentMethod: 'Tiền mặt',
    amountReceived: 300000,
    wifiSsid: 'NDTCore_Guest',
    wifiPassword: 'caphengon',
}

/** Vị trí món nhận topping mẫu trong `SAMPLE_ORDER.items`. */
export const SAMPLE_TOPPING_ITEM_INDEX = 1
