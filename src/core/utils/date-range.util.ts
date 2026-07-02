export function toDateKey(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// getTimezoneOffset() returns minutes BEHIND UTC (positive = west of UTC), so it must be negated
// to get the actual UTC offset (positive = east of UTC, e.g. +07:00 for vi-VN).
function localOffsetSuffix(): string {
    const offsetMinutes = -new Date().getTimezoneOffset()
    const sign = offsetMinutes >= 0 ? '+' : '-'
    const abs = Math.abs(offsetMinutes)
    const hours = String(Math.floor(abs / 60)).padStart(2, '0')
    const minutes = String(abs % 60).padStart(2, '0')
    return `${sign}${hours}:${minutes}`
}

// Backend compares this against a DateTimeOffset column, so From/To must always carry the
// browser's real UTC offset — never a bare local-time string (server may run in a different timezone).
export function toRangeStart(dateKey: string): string {
    return `${dateKey}T00:00:00${localOffsetSuffix()}`
}

export function toRangeEnd(dateKey: string): string {
    return `${dateKey}T23:59:59${localOffsetSuffix()}`
}
