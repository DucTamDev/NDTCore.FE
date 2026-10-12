/** Mức cỡ chữ đặt nhanh cho cả mẫu in. */
export enum FontSizePreset {
    Small = 'Small',
    Normal = 'Normal',
    Large = 'Large',
}

/** Khổ giấy cuộn dùng để xem trước hoá đơn (mm). */
export enum ReceiptPaperWidth {
    Mm58 = 58,
    Mm80 = 80,
}

/** Cỡ tem dùng để xem trước (rộng × cao, mm). */
export enum LabelSize {
    Mm40x30 = '40x30',
    Mm50x30 = '50x30',
    Mm50x40 = '50x40',
}

/** Loại mẫu đang chỉnh. */
export enum PrintTemplateKind {
    Receipt = 'receipt',
    Label = 'label',
}
