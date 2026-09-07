import data from './learn.json'

export type Spec = [string, string]

export interface Component {
  id: string
  name: string
  symbol: string
  category: string
  schematic: string
  image: string
  description: string
  specs: Spec[]
  colorCode?: boolean
  applications: string[]
  notes: string
}

export type Variable = [string, string]

export interface Formula {
  id: string
  name: string
  category: string
  expression: string
  variables: Variable[]
  calculator?: string
  description: string
  notes: string
}

export interface GlossaryTerm {
  term: string
  category: string
  definition: string
}

const raw = data as {
  components: Component[]
  formulas: Formula[]
  glossary: GlossaryTerm[]
}

export const COMPONENTS = raw.components as unknown as Component[]
export const FORMULAS = raw.formulas as unknown as Formula[]
export const GLOSSARY = raw.glossary as unknown as GlossaryTerm[]

export const CATEGORIES = {
  components: Array.from(new Set(COMPONENTS.map(c => c.category))),
  formulas: Array.from(new Set(FORMULAS.map(f => f.category))),
  glossary: Array.from(new Set(GLOSSARY.map(g => g.category))),
}

// Resistor color code (4-band)
export const COLOR_BANDS = [
  { color: 'đen',  hex: '#000000', digit: 0, mult: 1 },
  { color: 'nâu',  hex: '#6f3f0a', digit: 1, mult: 10 },
  { color: 'đỏ',   hex: '#c43838', digit: 2, mult: 100 },
  { color: 'cam',   hex: '#e58a1f', digit: 3, mult: 1_000 },
  { color: 'vàng', hex: '#e7c200', digit: 4, mult: 10_000 },
  { color: 'lục',  hex: '#2c8a3a', digit: 5, mult: 100_000 },
  { color: 'lam',   hex: '#2356c2', digit: 6, mult: 1_000_000 },
  { color: 'tím',   hex: '#7e3aa6', digit: 7, mult: 10_000_000 },
  { color: 'xám',   hex: '#888888', digit: 8, mult: 100_000_000 },
  { color: 'trắng', hex: '#ffffff', digit: 9, mult: 1_000_000_000 },
]

export const TOLERANCE_BANDS: Record<string, { hex: string; pct: number }> = {
  nâu:  { hex: '#6f3f0a', pct: 1 },
  đỏ:   { hex: '#c43838', pct: 2 },
  vàng: { hex: '#e7c200', pct: 5 },
  bạc:  { hex: '#c0c0c0', pct: 10 },
  vàng_nhạt: { hex: '#d4b860', pct: 20 },
}

export interface DecodedResistor {
  value: number
  formatted: string
  tolerance: number
}

export function decodeResistor(b1: string, b2: string, b3: string, mult: string, tol: string): DecodedResistor {
  const d1 = COLOR_BANDS.find(c => c.color === b1)?.digit ?? 0
  const d2 = COLOR_BANDS.find(b => b.color === b2)?.digit ?? 0
  const d3 = COLOR_BANDS.find(c => c.color === b3)?.digit ?? 0
  const m = COLOR_BANDS.find(c => c.color === mult)?.mult ?? 1
  const value = ((d1 * 100 + d2 * 10 + d3) * m) || 0
  const tolerance = TOLERANCE_BANDS[tol]?.pct ?? 5
  return { value, formatted: formatResistance(value), tolerance }
}

export function formatResistance(r: number): string {
  if (r === 0) return '0Ω'
  if (r >= 1_000_000) return `${(r / 1_000_000).toFixed(r % 1_000_000 === 0 ? 0 : 1).replace(/\.0$/, '')}MΩ`
  if (r >= 1_000) return `${(r / 1_000).toFixed(r % 1_000 === 0 ? 0 : 1).replace(/\.0$/, '')}kΩ`
  return `${r}Ω`
}

export interface DecodedSmd {
  value: string
  formatted: string
}

export function decodeSmd3(code: string): DecodedSmd {
  if (code.length < 3) return { value: code, formatted: code }
  if (code[2] === 'R' || code[2] === 'r') {
    const v = parseFloat(code.slice(0, 2))
    return { value: code, formatted: `${v}Ω` }
  }
  const d1 = parseInt(code[0])
  const d2 = parseInt(code[1])
  const mult = Math.pow(10, parseInt(code[2]))
  if (isNaN(d1) || isNaN(d2) || isNaN(mult)) return { value: code, formatted: code }
  const v = (d1 * 10 + d2) * mult
  return { value: code, formatted: formatResistance(v) }
}

export function decodeSmd4(code: string): DecodedSmd {
  if (code.length < 4) return { value: code, formatted: code }
  if (code[3] === 'R' || code[3] === 'r') {
    const v = parseFloat(code.slice(0, 3))
    return { value: code, formatted: `${v}Ω` }
  }
  const mult = Math.pow(10, parseInt(code[3]))
  const v = parseInt(code.slice(0, 3)) * mult
  return { value: code, formatted: formatResistance(v) }
}
