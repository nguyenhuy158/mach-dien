import { useState, useEffect } from 'react'

const COLS = [
  { label: 'Bảng giỏ hàng', cols: [
    ['k-own', 'Đã có'], ['k-no', '#'], ['k-im', 'Ảnh'], ['k-name', 'Linh kiện'],
    ['k-use', 'Dùng cho mạch'], ['k-qty', 'SL'], ['k-price', 'Đơn giá'], ['k-line', 'Thành tiền'], ['k-src', 'Nguồn'],
  ]},
  { label: 'Bảng linh kiện trong mạch', cols: [
    ['p-im', 'Ảnh'], ['p-name', 'Linh kiện'], ['p-spec', 'Thông số'],
    ['p-qty', 'SL'], ['p-blk', 'Giá banlinhkien'], ['p-caka', 'Giá caka.vn'],
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

  useEffect(() => {
    const all = COLS.flatMap(g => g.cols.map(c => c[0]))
    const off = all.filter(k => cols[k] === false)
    applyColCss(off)
  }, [cols])

  const toggle = (k: string, v: boolean) => {
    const next = { ...cols, [k]: v }
    if (!v) next[k] = false
    else delete next[k]
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
          <div key={g.label} className="mb-4 last:mb-0">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-2">{g.label}</h4>
            <div className="space-y-1.5">
              {g.cols.map(([k, label]) => (
                <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cols[k] !== false}
                    onChange={e => toggle(k, e.target.checked)}
                    className="rounded"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button onClick={reset} className="w-full text-sm py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-acc)] transition">
          Hiện lại tất cả
        </button>
      </div>
    </div>
  )
}
