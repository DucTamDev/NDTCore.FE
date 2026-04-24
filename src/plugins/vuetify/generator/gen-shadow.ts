import { baseTokens } from '../tokens/index'
import { section, flatten, renderBlock } from './css'
import { write, validate, banner, logResult } from './runner'

export function genShadow(): void {
    const sections = [
        section('Shadows', flatten(baseTokens.shadow as unknown as Record<string, unknown>, 'shadow')),
    ]

    validate(sections, 'shadow')

    const content = [banner('gen-shadow.ts'), renderBlock(':root', sections), ''].join('\n')

    const filepath = write('shadow.css', content)
    logResult(filepath, sections)
}
