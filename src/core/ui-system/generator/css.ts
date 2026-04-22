export type CSSVar = readonly [property: string, value: string]

export interface CSSSection {
    readonly label: string
    readonly vars: readonly CSSVar[]
}

export function toKebab(str: string): string {
    return str
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')
}

export function sanitizeKey(key: string): string {
    return key.replace(/\./g, '-')
}

export function flatten(obj: Record<string, unknown>, prefix: string): CSSVar[] {
    const result: CSSVar[] = []
    for (const [rawKey, value] of Object.entries(obj)) {
        const key = sanitizeKey(toKebab(rawKey))
        const name = `--${prefix}-${key}`
        if (typeof value === 'string' || typeof value === 'number') {
            result.push([name, String(value)])
        } else if (value !== null && typeof value === 'object') {
            result.push(...flatten(value as Record<string, unknown>, `${prefix}-${key}`))
        }
    }
    return result
}

export function section(label: string, vars: CSSVar[]): CSSSection {
    return { label, vars }
}

export function renderBlock(selector: string, sections: CSSSection[]): string {
    const allVars = sections.flatMap((s) => s.vars)
    if (allVars.length === 0) return ''

    const lines = [`${selector} {`]
    sections.forEach((s, i) => {
        if (s.vars.length === 0) return
        if (i > 0) lines.push('')
        lines.push(`  /* ── ${s.label} ── */`)
        s.vars.forEach(([prop, val]) => lines.push(`  ${prop}: ${val};`))
    })
    lines.push('}')
    return lines.join('\n')
}

export function buildDarkDiff(light: CSSSection[], dark: CSSSection[]): CSSSection[] {
    const lightMap = new Map(light.flatMap((s) => s.vars))
    return dark
        .map((s) => ({ ...s, vars: s.vars.filter(([p, v]) => lightMap.get(p) !== v) }))
        .filter((s) => s.vars.length > 0)
}
