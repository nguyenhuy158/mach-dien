import { useState, useEffect } from 'react'
import { useI18n, Bilingual } from '../i18n'

const COLS = [
  { key: 'cart', cols: [
    ['k-own', 'Đã có', 'Owned'],
    ['k-no', '#', '#'],
    ['k-im', 'Ảnh', 'Img'],
    ['k-name', 'Linh kiện', 'Component'],
    ['k-use', 'Dùng cho mạch', 'Used in'],
    ['k-qty', 'SL', 'Qty'],
    ['k-price', 'Đơn giá', 'Unit'],
    ['k-line', 'Thành tiền', 'Line'],
    ['k-src', 'Nguồn', 'Source'],
  ]},
  { key: 'card', cols: [
    ['p-im', 'Ảnh', 'Img'],
    ['p-name', 'Linh kiện', 'Component'],
    ['p-spec', 'Thông số', 'Spec'],
    ['p-qty', 'SL', 'Qty'],
    ['p-blk', 'Giá banlinhkien', 'banlinhkien price'],
    ['p-caka', 'Giá caka.vn', 'caka.vn price'],
  ]},
]

const CKEY = 'machdien.cols'

function loadCols(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(CKEY) || '{}') } catch { return {} }
}

function saveCols(c: Record<string, boolean>) {
  localStorage.setItem(CKEY, JSON.stringify(c))
}

function applyColCss(disabled: string[]) {
  let el = document.getElementById('colcss')
  if (!el) {
    el = document.createElement('style')
    el.id = 'colcss'
    document.head.appendChild(el)
  }
  el.textContent = disabled.length ? disabled.map(k => '.' + k).join(',') + '{display:none}' : ''
}

export function SettingsMenu({ onClose }: { onClose: () => void }) {
  const [cols, setCols] = useState<Record<string, boolean>>(loadCols())
  const { T, tvn, mode } = useI18n()

  useEffect(() => {
    const all = COLS.flatMap(g => g.cols.map(c => c[0]))
    const off = all.filter(k => cols[k] === false)
    applyColCss(off)
  }, [cols])

  const toggle = (k: string, v: boolean) => {
    const next = { ...cols }
    if (v) delete next[k]
    else next[k] = false
    setCols(next)
    saveCols(next)
  }

  const reset = () => {
    setCols({})
    saveCols({})
  }

  return (
    <div className="fixed inset-0 z-30" onClick={onClose}>
      <div
        className="absolute right-4 top-20 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-4 w-72"
        onClick={e => e.stopPropagation()}
      >
        {COLS.map(g => (
          <div key={g.key} className="mb-4 last:mb-0">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-2">
              <Bilingual
                en={T.settingsGroup[g.key as 'cart' | 'card']}
                vn={tvn.settingsGroup[g.key as 'cart' | 'card']}
              />
            </h4>
            <div className="space-y-1.5">
              {g.cols.map(([k, vnLabel, enLabel]) => (
                <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cols[k] !== false}
                    onChange={e => toggle(k, e.target.checked)}
                    className="rounded"
                  />
                  <span>
                    <Bilingual en={enLabel} vn={vnLabel} />
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button onClick={reset} className="w-full text-sm py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-acc)] transition">
          <Bilingual en={T.settingsReset} vn={tvn.settingsReset} />
        </button>
      </div>
    </div>
  )
}
