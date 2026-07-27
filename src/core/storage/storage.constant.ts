export const STORAGE_KEYS = {
    AUTH_TOKENS: 'auth.tokens',
    USER: 'auth.user',
    POS_USB_PRINTER_DEVICE: 'pos.usbPrinterDevice',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]