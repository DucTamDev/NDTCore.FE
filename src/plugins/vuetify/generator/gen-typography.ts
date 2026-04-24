import { baseTokens } from '../tokens/index'
import { section, flatten, renderBlock, sanitizeKey, toKebab } from './css'
import { write, validate, banner, logResult } from './runner'
import type { CSSVar } from './css'

function buildFontSizeVars(): CSSVar[] {
    return Object.entries(baseTokens.typography.fontSize).flatMap(([step, v]) => {
        const s = sanitizeKey(toKebab(step))
        const { size, lineHeight, letterSpacing } = v as {
            size: string
            lineHeight: string
            letterSpacing: string
        }
        return [
            [`--font-size-${s}`, size],
            [`--font-size-${s}-line-height`, lineHeight],
            [`--font-size-${s}-letter-spacing`, letterSpacing],
        ] as CSSVar[]
    })
}

export function genTypography(): void {
    const sections = [
        section(
            'Font families',
            flatten(
                baseTokens.typography.fontFamily as unknown as Record<string, unknown>,
                'font-family',
            ),
        ),
        section('Font sizes', buildFontSizeVars()),
        section(
            'Font weights',
            flatten(
                baseTokens.typography.fontWeight as unknown as Record<string, unknown>,
                'font-weight',
            ),
        ),
        section(
            'Line heights',
            flatten(
                baseTokens.typography.lineHeight as unknown as Record<string, unknown>,
                'line-height',
            ),
        ),
        section(
            'Letter spacing',
            flatten(
                baseTokens.typography.letterSpacing as unknown as Record<string, unknown>,
                'letter-spacing',
            ),
        ),
    ]

    validate(sections, 'typography')

    const content = [banner('gen-typography.ts'), renderBlock(':root', sections), ''].join('\n')

    const filepath = write('typography.css', content)
    logResult(filepath, sections)
}
