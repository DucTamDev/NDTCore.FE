import { baseTokens } from '../tokens/index'
import { section, flatten, renderBlock } from './css'
import { write, validate, banner, logResult } from './runner'

export function genRadius(): void {
    const sections = [
        section(
            'Border radius',
            flatten(baseTokens.radius as unknown as Record<string, unknown>, 'radius'),
        ),
    ]

    validate(sections, 'radius')

    const content = [banner('gen-radius.ts'), renderBlock(':root', sections), ''].join('\n')

    const filepath = write('radius.css', content)
    logResult(filepath, sections)
}
