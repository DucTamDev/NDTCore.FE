import { parse, formatHex, formatHex8 } from 'culori'

type CSSColorString = string
type HexColor = `#${string}`

export function toHex(color: CSSColorString): HexColor {
    if (/^#[0-9a-f]{6}$/i.test(color)) return color.toLowerCase() as HexColor

    if (/^#[0-9a-f]{3}$/i.test(color)) {
        const [, r, g, b] = color
        return `#${r}${r}${g}${g}${b}${b}` as HexColor
    }

    if (color === 'transparent') return '#00000000' as HexColor
    if (color === 'white' || color === '#fff' || color === '#ffffff') return '#ffffff' as HexColor
    if (color === 'black' || color === '#000' || color === '#000000') return '#000000' as HexColor

    const parsed = parse(color)
    if (!parsed) {
        console.warn(`[Design System] toHex(): cannot parse "${color}", fallback #000000`)
        return '#000000' as HexColor
    }

    const hex = formatHex(parsed)
    if (!hex) {
        console.warn(`[Design System] toHex(): formatHex failed for "${color}", fallback #000000`)
        return '#000000' as HexColor
    }

    return hex as HexColor
}

export function toHex8(color: CSSColorString): HexColor {
    if (color === 'transparent') return '#00000000' as HexColor
    const parsed = parse(color)
    if (!parsed) return '#000000' as HexColor
    return (formatHex8(parsed) ?? '#000000') as HexColor
}

export function convertColorsToHex<T extends Record<string, CSSColorString>>(
    colors: T,
): { [K in keyof T]: HexColor } {
    return Object.fromEntries(
        Object.entries(colors).map(([key, value]) => [key, toHex(value)]),
    ) as { [K in keyof T]: HexColor }
}
