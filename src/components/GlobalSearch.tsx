import { useState, useMemo, useEffect, useRef } from 'react'
import { CIRCUITS, SHOP, SIM, IMG, EXTRA, nrm } from '../data/circuits'
import { COMPONENTS, FORMULAS, GLOSSARY } from '../data/learn'

interface Hit {
  g: string
  ic: string
  img?: string
  t: string
  s?: string
  r?: string
  go: () => void
}

interface Props {
  onClose: () => void
  onJump: (id: string) => void
}

export function GlobalSearch({ onClose, onJump }: Props) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.select()
    inputRef.current?.focus()
  }, [])

  const idx = useMemo(() => {
    const out: Hit[] = []
    const seen = new Set<string>()
    CIRCUITS.forEach(c => out.push({
      g: 'Mạch',
      ic: '🔧',
      t: `${c.l}.${c.n} ${c.name}`,
      s: c.goal,
      go: () => onJump(`m-${c.l}-${c.n}`),
    }))
    const partMap = new Map<string, { spec: string; uses: typeof CIRCUITS }>()
    CIRCUITS.forEach(c => c.parts.forEach(p => {
      const e = partMap.get(p[0]) || { spec: p[1], uses: [] }
      e.uses.push(c)
      partMap.set(p[0], e)
    }))
    partMap.forEach((e, name) => {
      const sh = SHOP[name] || {}
      const src = sh.b || sh.c
      out.push({
        g: 'Linh kiện',
        ic: '⚡',
        img: src ? IMG[src.u] : undefined,
        t: name,
        s: `${e.spec} · dùng ở ${e.uses.map(c => `${c.l}.${c.n}`).join(', ')}`,
        r: sh.s ? '—' : (src ? src.p : 'chưa có nguồn'),
        go: () => onJump(`m-${e.uses[0].l}-${e.uses[0].n}`),
      })
    })
    Object.entries(SHOP).forEach(([name, v]) => ['b', 'c'].forEach(k => {
      const x = (v as Record<string, { t: string; u: string; p: string } | undefined>)[k]
      if (!x || seen.has(x.u)) return
      seen.add(x.u)
      out.push({
        g: 'Sản phẩm ở shop',
        ic: '🛒',
        img: IMG[x.u],
        t: x.t,
        s: `${k === 'b' ? 'banlinhkien.com' : 'caka.vn'} · cho ${name}`,
        r: x.p,
        go: () => window.open(x.u, '_blank', 'noopener'),
      })
    }))
    EXTRA.forEach(e => out.push({
      g: 'Mua thêm (CSV)',
      ic: '📦',
      img: IMG[e[4]],
      t: e[0],
      go: () => window.open(e[4], '_blank', 'noopener'),
    }))
    COMPONENTS.forEach(c => out.push({
      g: 'Linh kiện (Học)',
      ic: '🔌',
      t: c.name,
      s: c.description,
      go: () => onJump('cmp-' + c.id),
    }))
    FORMULAS.forEach(f => out.push({
      g: 'Công thức (Học)',
      ic: '📐',
      t: f.name,
      s: f.expression,
      go: () => onJump('fml-' + f.id),
    }))
    GLOSSARY.forEach(g => out.push({
      g: 'Thuật ngữ (Học)',
      ic: '📖',
      t: g.term,
      s: g.definition,
      go: () => onJump('glossary'),
    }))
    return out
  }, [onJump])

  const hits = useMemo(() => {
    const ts = nrm(q).split(/\s+/).filter(Boolean)
    if (!ts.length) return []
    return idx.filter(x => ts.every(t => nrm(x.t + ' ' + x.s).includes(t))).slice(0, 40)
  }, [q, idx])

  useEffect(() => setSel(0), [q])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, hits.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter' && hits[sel]) { e.preventDefault(); onClose(); hits[sel].go() }
    else if (e.key === 'Escape') onClose()
  }

  let lastGroup = ''

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24"
      onClick={onClose}
    >
      <div
        id="gsbox"
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden fade-in"
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          id="gsq"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Tìm mạch, linh kiện, sản phẩm, giá…"
          autoComplete="off"
          className="w-full px-5 py-4 text-lg border-b border-[var(--color-border)] bg-transparent focus:outline-none"
        />
        <div id="gsres" className="max-h-[60vh] overflow-y-auto">
          {!q && <div className="empty p-6 text-center text-[var(--color-muted)]">Gõ để tìm: tên mạch, linh kiện, mã IC, tên sản phẩm…</div>}
          {q && !hits.length && <div className="empty p-6 text-center text-[var(--color-muted)]">Không thấy gì khớp 🤷</div>}
          {hits.map((x, i) => {
            const head = x.g !== lastGroup ? (lastGroup = x.g, <div className="gh px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] bg-[color-mix(in_srgb,var(--color-bg)_50%,transparent)]">{x.g}</div>) : null
            return (
              <div key={i}>
                {head}
                <div
                  className={`gi flex items-center gap-3 px-5 py-2.5 cursor-pointer ${i === sel ? 'bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)]' : 'hover:bg-[color-mix(in_srgb,var(--color-acc)_8%,transparent)]'}`}
                  onClick={() => { onClose(); x.go() }}
                  onMouseEnter={() => setSel(i)}
                >
                  {x.img ? (
                    <img loading="lazy" src={x.img} alt="" className="size-8 rounded bg-white object-contain ring-1 ring-black/5" />
                  ) : (
                    <div className="size-8 rounded bg-[var(--color-border)] flex items-center justify-center text-base">{x.ic}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[var(--color-muted)] truncate" dangerouslySetInnerHTML={{ __html: hl(x.s || '', q) }} />
                  </div>
                  {x.r && <em className="text-xs font-mono text-[var(--color-muted)] whitespace-nowrap">{x.r}</em>}
                </div>
              </div>
            )
          })}
        </div>
        <div id="gsfoot" className="flex justify-end gap-4 px-5 py-2 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
          <span>↑↓ chọn</span>
          <span>↵ mở</span>
          <span>Esc đóng</span>
        </div>
      </div>
    </div>
  )
}

function hl(txt: string, q: string): string {
  if (!q) return txt
  const ts = nrm(q).split(/\s+/).filter(Boolean)
  let out = String(txt)
  ts.forEach(t => {
    const i = nrm(out).indexOf(t)
    if (i >= 0 && t) out = out.slice(0, i) + '<mark>' + out.slice(i, i + t.length) + '</mark>' + out.slice(i + t.length)
  })
  return out
}
