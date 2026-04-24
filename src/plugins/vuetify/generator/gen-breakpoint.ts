import { baseTokens } from '../tokens/index'
import { section, flatten, renderBlock } from './css'
import { write, validate, banner, logResult } from './runner'

export function genBreakpoint(): void {
    const sections = [
        section(
            'Breakpoints',
            flatten(baseTokens.breakpoint as unknown as Record<string, unknown>, 'breakpoint'),
        ),
    ]

    validate(sections, 'breakpoint')

    const content = [banner('gen-breakpoint.ts'), renderBlock(':root', sections), ''].join('\n')

    const filepath = write('breakpoint.css', content)
    logResult(filepath, sections)
}
