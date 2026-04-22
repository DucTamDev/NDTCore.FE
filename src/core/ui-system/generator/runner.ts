import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import type { CSSSection } from './css'

const OUTPUT_DIR = resolve(process.cwd(), 'src/assets/styles/tokens')

export function write(filename: string, content: string): string {
    mkdirSync(OUTPUT_DIR, { recursive: true })
    const filepath = resolve(OUTPUT_DIR, filename)
    writeFileSync(filepath, content, 'utf-8')
    return filepath
}

export function validate(sections: CSSSection[], context: string): number {
    let warnings = 0
    for (const s of sections) {
        for (const [prop, val] of s.vars) {
            if (val === 'undefined' || val === 'null' || val === '') {
                console.warn(`  ⚠️  [${context}] ${prop}: "${val}" — missing token value`)
                warnings++
            }
        }
    }
    return warnings
}

export function countVars(sections: CSSSection[]): number {
    return sections.reduce((acc, s) => acc + s.vars.length, 0)
}

export function banner(filename: string): string {
    return `/* Auto-generated — do not edit. Source: design-system/tokens/ | ${new Date().toISOString()} */\n`
}

export function logResult(filepath: string, sections: CSSSection[]): void {
    const count = countVars(sections)
    const name = filepath.split(/[\\/]/).pop()
    console.log(`  ✓  ${name}  (${count} vars)`)
}
