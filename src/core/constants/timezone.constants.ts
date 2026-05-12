export const TIMEZONE = {
    // Southeast Asia
    HO_CHI_MINH: 'Asia/Ho_Chi_Minh',
    BANGKOK: 'Asia/Bangkok',
    JAKARTA: 'Asia/Jakarta',
    MAKASSAR: 'Asia/Makassar',
    JAYAPURA: 'Asia/Jayapura',
    SINGAPORE: 'Asia/Singapore',
    KUALA_LUMPUR: 'Asia/Kuala_Lumpur',
    MANILA: 'Asia/Manila',
    RANGOON: 'Asia/Rangoon',
    YANGON: 'Asia/Yangon',

    // East Asia
    SHANGHAI: 'Asia/Shanghai',
    TAIPEI: 'Asia/Taipei',
    HONG_KONG: 'Asia/Hong_Kong',
    TOKYO: 'Asia/Tokyo',
    SEOUL: 'Asia/Seoul',

    // South Asia
    KOLKATA: 'Asia/Kolkata',
    DHAKA: 'Asia/Dhaka',
    KARACHI: 'Asia/Karachi',

    // Oceania
    SYDNEY: 'Australia/Sydney',
    MELBOURNE: 'Australia/Melbourne',
    AUCKLAND: 'Pacific/Auckland',

    // Europe
    LONDON: 'Europe/London',
    PARIS: 'Europe/Paris',
    BERLIN: 'Europe/Berlin',

    // Americas
    NEW_YORK: 'America/New_York',
    CHICAGO: 'America/Chicago',
    LOS_ANGELES: 'America/Los_Angeles',

    // UTC
    UTC: 'UTC',

    DEFAULT: 'Asia/Ho_Chi_Minh',
} as const

export type TimezoneId = (typeof TIMEZONE)[keyof Omit<typeof TIMEZONE, 'DEFAULT'>]

export const TIMEZONE_OPTIONS: { value: TimezoneId; label: string; group: string }[] = [
    // Southeast Asia
    { value: TIMEZONE.HO_CHI_MINH, label: 'Asia/Ho_Chi_Minh (UTC+7) — VN', group: 'Đông Nam Á' },
    { value: TIMEZONE.BANGKOK, label: 'Asia/Bangkok (UTC+7) — TH, VN, LA, KH', group: 'Đông Nam Á' },
    { value: TIMEZONE.JAKARTA, label: 'Asia/Jakarta (UTC+7) — ID (WIB)', group: 'Đông Nam Á' },
    { value: TIMEZONE.MAKASSAR, label: 'Asia/Makassar (UTC+8) — ID (WITA)', group: 'Đông Nam Á' },
    { value: TIMEZONE.JAYAPURA, label: 'Asia/Jayapura (UTC+9) — ID (WIT)', group: 'Đông Nam Á' },
    { value: TIMEZONE.SINGAPORE, label: 'Asia/Singapore (UTC+8) — SG, MY', group: 'Đông Nam Á' },
    { value: TIMEZONE.KUALA_LUMPUR, label: 'Asia/Kuala_Lumpur (UTC+8) — MY', group: 'Đông Nam Á' },
    { value: TIMEZONE.MANILA, label: 'Asia/Manila (UTC+8) — PH', group: 'Đông Nam Á' },
    { value: TIMEZONE.RANGOON, label: 'Asia/Rangoon (UTC+6:30) — MM', group: 'Đông Nam Á' },
    { value: TIMEZONE.YANGON, label: 'Asia/Yangon (UTC+6:30) — MM', group: 'Đông Nam Á' },

    // East Asia
    { value: TIMEZONE.SHANGHAI, label: 'Asia/Shanghai (UTC+8) — CN', group: 'Đông Á' },
    { value: TIMEZONE.TAIPEI, label: 'Asia/Taipei (UTC+8) — TW', group: 'Đông Á' },
    { value: TIMEZONE.HONG_KONG, label: 'Asia/Hong_Kong (UTC+8) — HK', group: 'Đông Á' },
    { value: TIMEZONE.TOKYO, label: 'Asia/Tokyo (UTC+9) — JP', group: 'Đông Á' },
    { value: TIMEZONE.SEOUL, label: 'Asia/Seoul (UTC+9) — KR', group: 'Đông Á' },

    // South Asia
    { value: TIMEZONE.KOLKATA, label: 'Asia/Kolkata (UTC+5:30) — IN', group: 'Nam Á' },
    { value: TIMEZONE.DHAKA, label: 'Asia/Dhaka (UTC+6) — BD', group: 'Nam Á' },
    { value: TIMEZONE.KARACHI, label: 'Asia/Karachi (UTC+5) — PK', group: 'Nam Á' },

    // Oceania
    { value: TIMEZONE.SYDNEY, label: 'Australia/Sydney (UTC+10/+11) — AU', group: 'Châu Đại Dương' },
    { value: TIMEZONE.MELBOURNE, label: 'Australia/Melbourne (UTC+10/+11) — AU', group: 'Châu Đại Dương' },
    { value: TIMEZONE.AUCKLAND, label: 'Pacific/Auckland (UTC+12/+13) — NZ', group: 'Châu Đại Dương' },

    // Europe
    { value: TIMEZONE.LONDON, label: 'Europe/London (UTC+0/+1) — GB', group: 'Châu Âu' },
    { value: TIMEZONE.PARIS, label: 'Europe/Paris (UTC+1/+2) — FR', group: 'Châu Âu' },
    { value: TIMEZONE.BERLIN, label: 'Europe/Berlin (UTC+1/+2) — DE', group: 'Châu Âu' },

    // Americas
    { value: TIMEZONE.NEW_YORK, label: 'America/New_York (UTC-5/-4) — US Eastern', group: 'Châu Mỹ' },
    { value: TIMEZONE.CHICAGO, label: 'America/Chicago (UTC-6/-5) — US Central', group: 'Châu Mỹ' },
    { value: TIMEZONE.LOS_ANGELES, label: 'America/Los_Angeles (UTC-8/-7) — US Pacific', group: 'Châu Mỹ' },

    // UTC
    { value: TIMEZONE.UTC, label: 'UTC', group: 'UTC' },
]

export const ALL_TIMEZONES = new Set<string>(TIMEZONE_OPTIONS.map((o) => o.value))

export function isValidTimezone(id: string): id is TimezoneId {
    return ALL_TIMEZONES.has(id)
}
