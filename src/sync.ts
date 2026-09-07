// Sync helpers — export/import user data to/from JSON for backup or
// transfer between devices. Data is stored in localStorage; this module
// reads it, packs into a portable JSON blob, and re-imports on demand.

import { CIRCUITS } from './data/circuits'

const BKEY_LEARN = 'machdien.learn.bookmarks'
const BKEY_OWNED = 'machdien.owned'
const BKEY_LANG = 'machdien.lang'
const BKEY_THEME = 'machdien.theme'
const BKEY_CALC = 'machdien.calc.open'
const BKEY_COLS = 'machdien.cols'

export interface ExportBundle {
  version: 1
  exportedAt: string
  data: {
    learnBookmarks: { components: string[]; formulas: string[]; glossary: string[] }
    cartOwned: Record<string, true>
    lang: string | null
    theme: string | null
    calcOpen: string | null
    cols: Record<string, boolean> | null
  }
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try { return JSON.parse(raw) as T } catch { return fallback }
}

export function exportAll(): ExportBundle {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      learnBookmarks: safeParse(localStorage.getItem(BKEY_LEARN), { components: [], formulas: [], glossary: [] }),
      cartOwned: safeParse(localStorage.getItem(BKEY_OWNED), {}),
      lang: localStorage.getItem(BKEY_LANG),
      theme: localStorage.getItem(BKEY_THEME),
      calcOpen: localStorage.getItem(BKEY_CALC),
      cols: safeParse(localStorage.getItem(BKEY_COLS), null),
    },
  }
}

export function importAll(b: unknown): { ok: boolean; message: string } {
  if (!b || typeof b !== 'object') return { ok: false, message: 'Invalid JSON' }
  const bundle = b as Partial<ExportBundle>
  if (bundle.version !== 1) return { ok: false, message: 'Unsupported version (expected 1)' }
  if (!bundle.data) return { ok: false, message: 'Missing data' }

  const d = bundle.data

  // Validate before writing
  const lb = d.learnBookmarks
  if (lb && (typeof lb !== 'object' || !Array.isArray(lb.components))) {
    return { ok: false, message: 'Invalid learnBookmarks' }
  }
  // Drop stale ids (no longer in dataset)
  const validCmpLearn = new Set([
    'resistor','capacitor','inductor','diode','zener','led','bjt','mosfet','ne555','opamp',
    'lm393','ldo','relay','ldr','ntc','esp32','atmega328','oled','buck','tp4056','hc-sr04',
    'dht22','i2c','spi','nrf24','mpu6050','bme280','sim800','usbc',
  ])
  const validFml = new Set([
    'ohm','power','divider','led-r','rc-tau','rc-fc','bjt-rb','opamp-noninvert','opamp-invert',
    '555-astable','555-mono','buck-d','ldo-heat','r-parallel','r-series','c-parallel','c-series',
    'battery-time','three-phase',
  ])

  if (lb) {
    lb.components = (lb.components || []).filter((id: string) => validCmpLearn.has(id))
    lb.formulas = (lb.formulas || []).filter((id: string) => validFml.has(id))
  }

  // Write
  if (lb) localStorage.setItem(BKEY_LEARN, JSON.stringify(lb))
  if (d.cartOwned && typeof d.cartOwned === 'object') localStorage.setItem(BKEY_OWNED, JSON.stringify(d.cartOwned))
  if (d.lang) localStorage.setItem(BKEY_LANG, d.lang)
  if (d.theme) localStorage.setItem(BKEY_THEME, d.theme)
  if (d.calcOpen) localStorage.setItem(BKEY_CALC, d.calcOpen)
  if (d.cols) localStorage.setItem(BKEY_COLS, JSON.stringify(d.cols))

  return { ok: true, message: 'Imported — reload to see changes' }
}

export function downloadJSON(filename: string, obj: unknown) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function pickJSON(): Promise<unknown | null> {
  return new Promise<unknown | null>((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) { resolve(null); return }
      const reader = new FileReader()
      reader.onload = () => {
        try { resolve(JSON.parse(String(reader.result))) }
        catch { resolve(null) }
      }
      reader.readAsText(file)
    }
    input.click()
  })
}
