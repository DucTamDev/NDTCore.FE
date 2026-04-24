import { baseTokens } from '../tokens/index'
import { section, flatten, renderBlock } from './css'
import { write, validate, banner, logResult } from './runner'

export function genSpacing(): void {
    const sections = [
        section(
            'Spacing',
            flatten(baseTokens.spacing as unknown as Record<string, unknown>, 'spacing'),
        ),
    ]

    validate(sections, 'spacing')

    const content = [banner('gen-spacing.ts'), renderBlock(':root', sections), ''].join('\n')

    const filepath = write('spacing.css', content)
    logResult(filepath, sections)
}
