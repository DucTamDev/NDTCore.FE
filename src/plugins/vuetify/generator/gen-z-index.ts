import { baseTokens } from '../tokens/index'
import { section, flatten, renderBlock } from './css'
import { write, validate, banner, logResult } from './runner'

export function genZIndex(): void {
    const sections = [
        section('Z-index', flatten(baseTokens.zIndex as unknown as Record<string, unknown>, 'z')),
    ]

    validate(sections, 'z-index')

    const content = [banner('gen-z-index.ts'), renderBlock(':root', sections), ''].join('\n')

    const filepath = write('z-index.css', content)
    logResult(filepath, sections)
}
