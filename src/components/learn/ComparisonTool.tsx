import { useState, useMemo } from 'react'
import { GitCompare, X } from 'lucide-react'
import { COMPONENTS } from '../../data/learn'
import type { Component } from '../../data/learn'
import { SchematicGlyph } from './SchematicGlyph'
import { useI18n, Bilingual } from '../../i18n'
import { haptic } from '../../utils/ux'

const STORAGE_KEY = 'machdien.compare.slots'

function loadSlots(): [string | null, string | null] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [null, null]
    const s = JSON.parse(raw)
    return Array.isArray(s) && s.length === 2
      ? [s[0] ?? null, s[1] ?? null]
      : [null, null]
  } catch { return [null, null] }
}
function saveSlots(slots: [string | null, string | null]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slots))
}

export function ComparisonTool() {
  const { T, tvn } = useI18n()
  const [open, setOpen] = useState(false)
  const [slots, setSlots] = useState<[string | null, string | null]>(loadSlots)

  const [a, b] = slots
  const ca = useMemo(() => COMPONENTS.find(c => c.id === a), [a])
  const cb = useMemo(() => COMPONENTS.find(c => c.id === b), [b])

  const setSlot = (idx: 0 | 1, id: string | null) => {
    const next: [string | null, string | null] = [...slots]
    next[idx] = id
    setSlots(next)
    saveSlots(next)
  }

  return (
    <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <button
        onClick={() => { haptic(8); setOpen(o => !o) }}
        className="w-full flex items-center justify-between"
      >
        <span className="flex items-center gap-2 font-semibold">
          <GitCompare className="size-4 text-[var(--color-acc)]" />
          <Bilingual en="Compare components" vn="So sánh linh kiện" />
        </span>
        <span className="text-xs text-[var(--color-muted)]">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-[var(--color-muted)]">
            <Bilingual en="Pick 2 components to compare spec side-by-side." vn="Chọn 2 linh kiện để so sánh thông số." />
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map(i => (
              <div key={i} className="space-y-2">
                <select
                  value={slots[i] ?? ''}
                  onChange={e => setSlot(i as 0 | 1, e.target.value || null)}
                  className="w-full rounded-md px-2 py-1.5 text-sm border border-[var(--color-border)] bg-[var(--color-bg)]"
                >
                  <option value="">—</option>
                  {COMPONENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <SlotCard c={(i === 0 ? ca : cb) || null} onClear={() => setSlot(i as 0 | 1, null)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SlotCard({ c, onClear }: { c: Component | null; onClear: () => void }) {
  if (!c) return <div className="rounded-lg border border-dashed border-[var(--color-border)] p-3 text-center text-xs text-[var(--color-muted)]">—</div>
  return (
    <div className="rounded-lg border border-[var(--color-border)] p-2.5 bg-[var(--color-bg)]">
      <div className="flex items-start gap-2">
        <div className="size-10 rounded bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
          <SchematicGlyph kind={c.schematic} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-tight">{c.name}</div>
          <div className="text-[10px] text-[var(--color-muted)] uppercase">{c.category}</div>
        </div>
        <button onClick={onClear} className="size-5 rounded-full hover:bg-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]" aria-label="Clear">
          <X className="size-3" />
        </button>
      </div>
      <p className="text-xs text-[var(--color-muted)] mt-2 leading-snug">{c.description}</p>
      <table className="w-full text-xs mt-2">
        <tbody>
          {c.specs.map(([k, v], i) => (
            <tr key={i} className="border-t border-[var(--color-border)]">
              <td className="py-1 text-[var(--color-muted)]">{k}</td>
              <td className="py-1">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
