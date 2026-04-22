import { lightTokens, darkTokens } from '../tokens/index'
import { palette } from '../palette'
import { section, flatten, renderBlock, buildDarkDiff } from './css'
import { write, validate, banner, logResult } from './runner'

export function genColors(): void {
    const toVars = (color: typeof lightTokens.color) => [
        section(
            'Semantic roles',
            flatten(color.semantic as unknown as Record<string, unknown>, 'color'),
        ),
    ]

    const lightSections = toVars(lightTokens.color)
    const darkSections = toVars(darkTokens.color)
    const darkDiff = buildDarkDiff(lightSections, darkSections)
    const paletteSection = [
        section(
            'Palette primitives (reference only)',
            flatten(palette as unknown as Record<string, unknown>, 'color-palette'),
        ),
    ]

    validate(lightSections, 'colors/light')
    validate(darkDiff, 'colors/dark')

    const content = [
        banner('gen-colors.ts'),
        renderBlock(':root', lightSections),
        '',
        renderBlock('.dark, [data-theme="dark"]', darkDiff),
        '',
        '/* Palette primitives — do NOT use in components, use --color-* semantic vars */',
        renderBlock(':root', paletteSection),
        '',
    ].join('\n')

    const filepath = write('colors.css', content)
    logResult(filepath, [...lightSections, ...paletteSection])
}
