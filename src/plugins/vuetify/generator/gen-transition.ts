import { baseTokens } from '../tokens/index'
import { section, flatten, renderBlock } from './css'
import { write, validate, banner, logResult } from './runner'

export function genTransition(): void {
    const sections = [
        section(
            'Durations',
            flatten(
                baseTokens.transition.duration as unknown as Record<string, unknown>,
                'transition-duration',
            ),
        ),
        section(
            'Easing',
            flatten(
                baseTokens.transition.easing as unknown as Record<string, unknown>,
                'transition-easing',
            ),
        ),
    ]

    validate(sections, 'transition')

    const content = [banner('gen-transition.ts'), renderBlock(':root', sections), ''].join('\n')

    const filepath = write('transition.css', content)
    logResult(filepath, sections)
}
