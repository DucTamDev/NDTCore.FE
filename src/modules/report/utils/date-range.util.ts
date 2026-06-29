export function toDateKey(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// new Date(year, month + 1, 0) rolls back to the last day of `month` — avoids an off-by-one.
export function currentMonthDateKeys(): [string, string] {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return [toDateKey(firstDay), toDateKey(lastDay)]
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

// Backend buckets Day/Week/Month boundaries using the offset on the DateTimeOffset query param,
// so From/To must always carry the browser's real UTC offset — never a bare local-time string.
export function toRangeStart(dateKey: string): string {
    return `${dateKey}T00:00:00${localOffsetSuffix()}`
}

export function toRangeEnd(dateKey: string): string {
    return `${dateKey}T23:59:59${localOffsetSuffix()}`
}
