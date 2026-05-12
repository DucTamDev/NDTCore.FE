export const CURRENCY = {
    VND: 'VND',
    USD: 'USD',
    EUR: 'EUR',
    SGD: 'SGD',
    DEFAULT: 'VND',
} as const

export type CurrencyCode = (typeof CURRENCY)[keyof Omit<typeof CURRENCY, 'DEFAULT'>]

export const CURRENCY_OPTIONS: { value: CurrencyCode; label: string }[] = [
    { value: CURRENCY.VND, label: 'VND — Việt Nam Đồng' },
    { value: CURRENCY.USD, label: 'USD — Đô la Mỹ' },
    { value: CURRENCY.EUR, label: 'EUR — Euro' },
    { value: CURRENCY.SGD, label: 'SGD — Đô la Singapore' },
]

export const DEFAULT_CURRENCY: CurrencyCode = CURRENCY.VND