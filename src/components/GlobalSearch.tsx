import { useState, useMemo, useEffect, useRef } from 'react'
import { Mic } from 'lucide-react'
import { VoiceSearchButton } from './VoiceSearchButton'
import { QrScannerButton } from './QrScannerButton'
import { OcrButton } from './OcrButton'
import { haptic } from '../utils/ux'
import { CIRCUITS, SHOP, SIM, IMG, EXTRA, nrm } from '../data/circuits'
import { COMPONENTS, FORMULAS, GLOSSARY } from '../data/learn'
import { useI18n, tStr, pickLang } from '../i18n'

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
  const { mode, T, tvn } = useI18n()

  useEffect(() => {
    inputRef.current?.select()
    inputRef.current?.focus()
  }, [])

  const g = pickLang(mode, T, tvn).searchGroup

  const idx = useMemo(() => {
    const out: Hit[] = []
    const seen = new Set<string>()
    CIRCUITS.forEach(c => out.push({
      g: g.mach, ic: '🔧',
      t: `${c.l}.${c.n} ${c.name}`,
      s: c.goal,
      go: () => onJump(`m-${c.l}-${c.n}`),
    }))
    const partMap = new Map<string, { name: string; spec: string; uses: typeof CIRCUITS }>()
    CIRCUITS.forEach(c => c.parts.forEach(p => {
      const e = partMap.get(p.name) || { name: p.name, spec: p.spec, uses: [] }
      e.uses.push(c)
      partMap.set(p.name, e)
    }))
    partMap.forEach((e, name) => {
      const sh = SHOP[name] || {}
      const src = sh.b || sh.c
      out.push({
        g: g.part, ic: '⚡',
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
        g: g.product, ic: '🛒',
        img: IMG[x.u],
        t: x.t,
        s: `${k === 'b' ? 'banlinhkien.com' : 'caka.vn'} · cho ${name}`,
        r: x.p,
        go: () => window.open(x.u, '_blank', 'noopener'),
      })
    }))
    EXTRA.forEach(e => out.push({
      g: g.csv, ic: '📦',
      img: IMG[e[4]],
      t: e[0],
      s: `banlinhkien.com · ${e[1]} ${e[2]}`,
      r: e[3].toLocaleString('vi-VN') + 'đ',
      go: () => window.open(e[4], '_blank', 'noopener'),
    }))
    COMPONENTS.forEach(c => out.push({
      g: g.learnCmp, ic: '🔌',
      t: c.name, s: c.description,
      go: () => onJump('cmp-' + c.id),
    }))
    FORMULAS.forEach(f => out.push({
      g: g.learnFml, ic: '📐',
      t: f.name, s: f.expression,
      go: () => onJump('fml-' + f.id),
    }))
    GLOSSARY.forEach(gl => out.push({
      g: g.learnGloss, ic: '📖',
      t: gl.term, s: gl.definition,
      go: () => onJump('glossary'),
    }))
    out.push({
      g: 'Công cụ (Tools)', ic: '🔄',
      t: 'Chuyển đổi đơn vị (Unit Converter)',
      s: 'Đổi tụ pF, nF, µF · trở kΩ, MΩ · cỡ dây AWG · tần số Hz, kHz',
      go: () => onJump('tools'),
    })
    out.push({
      g: 'Công cụ (Tools)', ic: '⚡',
      t: 'Sơ đồ chân vi điều khiển (MCU Pinout)',
      s: 'Tra cứu chân ESP32 30-pin, Arduino Nano · lọc chân ADC, I2C, SPI, PWM',
      go: () => onJump('tools'),
    })
    out.push({
      g: 'Công cụ (Tools)', ic: '🎨',
      t: 'Mã màu điện trở (Color Code Calculator)',
      s: 'Chọn màu 4 vạch tính ngay giá trị Ohm và dải sai số',
      go: () => onJump('tools'),
    })
    out.push({
      g: 'Công cụ (Tools)', ic: '🔍',
      t: 'Tra cứu mã dán SMD (SMD Resistor Code)',
      s: 'Giải mã 3 số, 4 số, mã R (103 = 10kΩ, 4R7 = 4.7Ω)',
      go: () => onJump('tools'),
    })
    out.push({
      g: 'Công cụ (Tools)', ic: '🔊',
      t: 'Phát âm thanh tần số & PWM (Tone Generator)',
      s: 'Phát âm thanh còi 5V 2.4kHz, xung PWM 490Hz, tiếng cạch relay, sóng vuông/sin 20Hz - 5kHz',
      go: () => onJump('tools'),
    })
    return out
  }, [onJump, g])

  const hits = useMemo(() => {
    const ts = nrm(q).split(/\s+/).filter(Boolean)
    if (!ts.length) return []
    return idx.filter(x => ts.every(t => nrm((x.t || '') + ' ' + (x.s || '')).includes(t))).slice(0, 40)
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
        <div className="flex items-center border-b border-[var(--color-border)]">
          <input
            ref={inputRef}
            id="gsq"
            value={q}
            onChange={e => { haptic(5); setQ(e.target.value) }}
            onKeyDown={onKey}
            placeholder={tStr(T.searchPlaceholder, tvn.searchPlaceholder, mode)}
            autoComplete="off"
            className="flex-1 px-5 py-4 text-lg bg-transparent focus:outline-none"
          />
          <div className="flex items-center gap-1 pr-2"><VoiceSearchButton onResult={t => setQ(t)} /><QrScannerButton onScan={t => setQ(t)} /><OcrButton onResult={t => setQ(t)} /></div>
        </div>
        <div id="gsres" className="max-h-[60vh] overflow-y-auto">
          {!q && <div className="empty p-6 text-center text-[var(--color-muted)]">{tStr(T.searchEmptyHint, tvn.searchEmptyHint, mode)}</div>}
          {q && !hits.length && <div className="empty p-6 text-center text-[var(--color-muted)]">{tStr(T.searchNoResults, tvn.searchNoResults, mode)}</div>}
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
                    <img loading="lazy" src={x.img} alt="" className="size-8 rounded bg-[var(--color-card)] object-contain ring-1 ring-[var(--color-border)]" />
                  ) : (
                    <div className="size-8 rounded bg-[var(--color-border)] flex items-center justify-center text-base">{x.ic}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate" dangerouslySetInnerHTML={{ __html: hl(x.t, q) }} />
                    <div className="text-xs text-[var(--color-muted)] truncate" dangerouslySetInnerHTML={{ __html: hl(x.s || '', q) }} />
                  </div>
                  {x.r && <em className="text-xs font-mono text-[var(--color-muted)] whitespace-nowrap">{x.r}</em>}
                </div>
              </div>
            )
          })}
        </div>
        <div id="gsfoot" className="flex justify-end gap-4 px-5 py-2 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
          <span>{tStr(T.searchFooter, tvn.searchFooter, mode)}</span>
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
