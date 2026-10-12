/** Khoảng trống quanh nội dung bản in (dot, 8 dot = 1mm). */
export interface PrintPaddingFormModel {
    top: number

    right: number

    bottom: number

    left: number
}

/** Cỡ chữ từng phần của hoá đơn (dot; 24 ≈ chữ cao 3mm). */
export interface ReceiptFontSizesFormModel {
    storeName: number

    /** Địa chỉ, số điện thoại cửa hàng. */
    storeInfo: number

    /** Dòng "HOÁ ĐƠN BÁN HÀNG". */
    title: number

    /** Mã đơn, thời gian, hình thức, bàn, thu ngân. */
    orderInfo: number

    itemName: number

    /** Dòng phụ của món: số lượng × đơn giá, tuỳ chọn, topping, ghi chú. */
    itemDetail: number

    /** Tổng số lượng, tạm tính, giảm giá, phí giao, VAT. */
    totals: number

    grandTotal: number

    payment: number

    footer: number
}

/** Tuỳ chọn hiển thị của mẫu hoá đơn; khổ giấy và cắt giấy thuộc máy in. */
export interface ReceiptTemplateFormModel {
    fontSize: ReceiptFontSizesFormModel

    padding: PrintPaddingFormModel

    /** Khoảng cách giữa các phần: đầu bill, thông tin đơn, món, tổng, thanh toán (dot). */
    sectionGap: number

    /** Khoảng cách giữa các dòng trong một phần (dot). */
    lineGap: number

    showLogo: boolean

    showStoreName: boolean

    showAddress: boolean

    showPhone: boolean

    showOrderNumber: boolean

    showTime: boolean

    showServiceType: boolean

    showTable: boolean

    showCashier: boolean

    /** Dòng thuộc tính (size, đường, đá) và các dòng topping dưới mỗi món. */
    showItemOptions: boolean

    showItemNote: boolean

    /** Dòng "số lượng × đơn giá"; tắt thì số lượng ghi trước tên món ("2x Cà phê"). */
    showUnitPrice: boolean

    showTotalQuantity: boolean

    showSubtotal: boolean

    /** Chỉ in khi đơn có giảm giá. */
    showDiscount: boolean

    /** Chỉ in khi đơn có phí giao hàng. */
    showDeliveryFee: boolean

    /** Dòng VAT; tiền VAT luôn cộng vào tổng cộng dù dòng này tắt. */
    showVat: boolean

    showPaymentMethod: boolean

    /** Tiền nhận và tiền thừa; chỉ in khi trả tiền mặt. */
    showCashChange: boolean

    showWifi: boolean

    showPaymentQr: boolean

    showOrderBarcode: boolean

    /** Lời cảm ơn cuối bill; chuỗi rỗng thì không in. */
    footerText: string
}

/** Cỡ chữ từng phần của tem (dot). */
export interface LabelFontSizesFormModel {
    /** Dòng trên: mã đơn, hình thức, số thứ tự ly. */
    header: number

    itemName: number

    /** Dòng thuộc tính (size, đường, đá) và giá. */
    attributes: number

    toppings: number

    note: number

    /** Dòng dưới: tên cửa hàng hoặc tên khách, giờ. */
    footer: number
}

/**
 * Tuỳ chọn hiển thị của tem dán ly: mỗi ly ít nhất một tem, cỡ tem không tự tăng; ly nhiều topping hơn
 * `maxToppingsPerLabel` thì tách phần còn lại sang tem kế.
 */
export interface LabelTemplateFormModel {
    fontSize: LabelFontSizesFormModel

    padding: PrintPaddingFormModel

    /** Khoảng cách giữa các dòng (dot). */
    lineGap: number

    /** Số dòng topping tối đa trên một tem, ít nhất 1; topping x2, x3 ghi cùng dòng nên tính theo số loại. */
    maxToppingsPerLabel: number

    showOrderNumber: boolean

    showServiceType: boolean

    /** "Ly n/N" theo thứ tự ly trong cả đơn. */
    showCupIndex: boolean

    /** Dòng thuộc tính, chỉ ở tem đầu của ly. */
    showAttributes: boolean

    /** Tắt thì mỗi ly đúng một tem. */
    showToppings: boolean

    /** Ghi chú món, chỉ ở tem cuối của ly. */
    showItemNote: boolean

    /** Giá một ly, chỉ ở tem đầu của ly. */
    showPrice: boolean

    showStoreName: boolean

    showCustomerName: boolean

    showTime: boolean
}

/** Khoá các tuỳ chọn bật/tắt của hoá đơn. */
export type ReceiptToggleKey = {
    [K in keyof ReceiptTemplateFormModel]: ReceiptTemplateFormModel[K] extends boolean ? K : never
}[keyof ReceiptTemplateFormModel]

/** Khoá các tuỳ chọn bật/tắt của tem. */
export type LabelToggleKey = {
    [K in keyof LabelTemplateFormModel]: LabelTemplateFormModel[K] extends boolean ? K : never
}[keyof LabelTemplateFormModel]
