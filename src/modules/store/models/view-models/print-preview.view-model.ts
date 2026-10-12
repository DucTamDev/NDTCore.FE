/** Một loại topping của món trong đơn xem trước. */
export interface PrintPreviewToppingViewModel {
    name: string

    /** Số phần topping trong một món, ít nhất 1. */
    quantity: number

    /** Giá một phần topping. */
    price: number
}

/** Một món trong đơn xem trước. */
export interface PrintPreviewItemViewModel {
    name: string

    quantity: number

    /** Đơn giá một món, đã gồm mọi tuỳ chọn và topping. */
    unitPrice: number

    /** Tuỳ chọn chọn-một như size, đường, đá. */
    attributes: string[]

    toppings: PrintPreviewToppingViewModel[]

    note: string | null
}

/** Đơn mẫu dùng để xem trước hoá đơn và tem. */
export interface PrintPreviewOrderViewModel {
    storeName: string

    storeAddress: string

    storePhone: string

    orderNumber: string

    time: string

    serviceType: string

    table: string

    cashierName: string

    customerName: string

    items: PrintPreviewItemViewModel[]

    discountAmount: number

    deliveryFee: number

    /** Thuế suất VAT (%), chỉ tính khi bật dòng VAT trong xem trước. */
    vatRatePercent: number

    paymentMethod: string

    amountReceived: number

    wifiSsid: string

    wifiPassword: string
}

/** Dòng "nhãn ... giá trị"; nhãn dài xuống dòng, giá trị giữ một dòng. */
export interface PreviewRowLine {
    kind: 'row'

    key: string

    label: string

    /** Bỏ trống thì chỉ có nhãn. */
    value: string | null

    /** Cỡ chữ (dot). */
    size: number

    bold: boolean

    /** Thụt vào như dòng phụ của món. */
    indent: boolean
}

/** Một dòng chữ. */
export interface PreviewTextLine {
    kind: 'text'

    key: string

    text: string

    /** Cỡ chữ (dot). */
    size: number

    bold: boolean

    center: boolean

    indent: boolean
}

/** Khối hình: logo, mã QR, mã vạch (xem trước chỉ minh hoạ vị trí và cỡ). */
export interface PreviewGraphicLine {
    kind: 'logo' | 'qr' | 'barcode'

    key: string
}

export type PreviewLine = PreviewRowLine | PreviewTextLine | PreviewGraphicLine

/** Một phần của hoá đơn, giữa hai đường kẻ. */
export interface ReceiptPreviewSection {
    key: string

    lines: PreviewLine[]

    /** Đường kẻ phía trên phần này: liền sau đầu bill, đứt ở các phần khác; phần đầu tiên không có. */
    divider: 'solid' | 'dashed' | null
}

/** Nội dung một con tem đã dựng sẵn để hiển thị. */
export interface LabelPreviewViewModel {
    /** Dòng trên theo thứ tự mã đơn → hình thức → số thứ tự ly. */
    headerParts: string[]

    itemName: string

    /** "tem p/P" bên phải tên món khi ly tách nhiều tem. */
    partText: string | null

    /** Các dòng giữa tên món và dòng dưới. */
    lines: PreviewTextLine[]

    /** Bên trái tên cửa hàng · tên khách, bên phải giờ; `null` khi không có dòng dưới. */
    footer: { left: string; right: string } | null
}

/** Một con tem: một ly, hoặc một phần topping của ly khi ly có nhiều topping hơn mức tối đa. */
export interface LabelPageViewModel {
    item: PrintPreviewItemViewModel

    /** Thứ tự ly trong cả đơn, từ 1. */
    cupNumber: number

    cupCount: number

    /** Thứ tự tem trong ly, từ 1. */
    partNumber: number

    partCount: number

    toppings: PrintPreviewToppingViewModel[]
}
