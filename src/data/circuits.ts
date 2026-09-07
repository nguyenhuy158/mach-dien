import data from './circuits.json'

export interface Level {
  n: number
  cls: string
  t: string
  g: string
  proj: string
}

export type Part = [string, string, string, string]

export interface Circuit {
  l: number
  n: number
  name: string
  goal: string
  parts: Part[]
  fm?: string
  warn?: string
  note?: string
  dia?: string
}

export interface ShopEntry {
  t: string
  u: string
  p: string
}

// Some products have `s: true` (not buyable); some have `s: number` (count, e.g. "ESP32" used 1 time).
// Some `s` may be 0 or other numeric values. Accept boolean | number | undefined to mirror source.
export interface ShopProduct {
  b?: ShopEntry
  c?: ShopEntry
  s?: boolean | number | string
}

export type ShopMap = Record<string, ShopProduct>

export type Extra = [string, number, string, number, string]

// JSON tuples are typed as arrays; structural types here are sufficient.
export const LEVELS: Level[] = data.LEVELS as Level[]
export const CIRCUITS: Circuit[] = data.C as unknown as Circuit[]
export const SHOP: ShopMap = data.SHOP as unknown as ShopMap
export const SIM: Record<string, string> = data.SIM as Record<string, string>
export const IMG: Record<string, string> = data.IMG as Record<string, string>
export const EXTRA: Extra[] = data.EXTRA as unknown as Extra[]

export const isNaPart = (name: string): boolean => {
  const s = SHOP[name]
  return !s || (!s.b && !s.c && !s.s)
}

export const formatVND = (n: number): string => n.toLocaleString('vi-VN') + 'đ'

export const isPack = (t: string): boolean =>
  /\(\s*\d+\s*(c|chi|chiếc)|\d+\s*chiếc|\d+\s*c\)/i.test(t || '')

export const parseQty = (s: string): number => parseInt(String(s).replace(/\D/g, '')) || 1

export const parsePrice = (s: string): number => parseInt(String(s).replace(/\D/g, '')) || 0

// Vietnamese-aware diacritic strip
export const nrm = (s: string | unknown): string =>
  String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase()
