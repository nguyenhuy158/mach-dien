import { useState } from 'react'
import { SIM, SHOP, isNaPart, nrm } from '../data/circuits'
import type { Circuit } from '../data/circuits'
import { PriceCell, Thumb } from './Parts'
import { SimButton } from './SimButton'
import { ResourcesPanel } from './ResourcesPanel'
import { Share2, Check, Printer, X } from 'lucide-react'
import { useI18n, tStr } from '../i18n'

interface Props {
  c: Circuit
  flash?: boolean
}

export function CircuitCard({ c, flash }: Props) {
  const simUrl = SIM[`${c.l}-${c.n}`]
  const anyNa = c.parts.some(p => isNaPart(p[0]))
  const searchBlob = (
    c.name + ' ' + c.goal + ' ' + c.parts.map(p => p[0] + ' ' + p[1]).join(' ')
  ).toLowerCase()

  return (
    <article
      id={`m-${c.l}-${c.n}`}
      data-na={anyNa ? 1 : 0}
      data-l={c.l}
      data-s={nrm(searchBlob)}
      className={`card p-5 bg-[var(--color-card)] border border-[var(--color-border)] ${flash ? 'flash' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="num font-mono text-sm font-bold text-[var(--color-muted)]">
          {c.l}.{c.n}
        </span>
        <h3 className="text-lg font-bold tracking-tight flex-1">{c.name}</h3>
        <ShareButton id={`m-${c.l}-${c.n}`} name={c.name} />
        <PrintButton id={`m-${c.l}-${c.n}`} />
      </div>
      <div className="goal text-sm text-[var(--color-muted)] mb-3">{c.goal}</div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            <th className="p-im w-12"></th>
            <th className="p-name">Linh kiện</th>
            <th className="p-spec">Thông số</th>
            <th className="p-qty text-center">SL</th>
            <th className="p-blk">banlinhkien</th>
            <th className="p-caka">caka.vn</th>
          </tr>
        </thead>
        <tbody>
          {c.parts.map((p, i) => {
            const s = SHOP[p[0]] || {}
            const isNa = !s.b && !s.c && !s.s
            return (
              <tr key={i} className={`border-t border-[var(--color-border)] ${isNa ? 'na-row' : ''}`}>
                <td className="im py-2">
                  <Thumb url={s.b?.u || s.c?.u} alt={s.b?.t || s.c?.t} />
                </td>
                <td className="p-name py-2 font-medium">{p[0]}</td>
                <td className="p-spec py-2 text-[var(--color-muted)] text-xs">{p[1]}</td>
                <td className="p-qty py-2 text-center">{p[2]}</td>
                <td className="p-blk py-2">
                  {s.s ? <span className="nn">—</span> : <PriceCell entry={s.b} />}
                </td>
                <td className="p-caka py-2">
                  {s.s ? <span className="nn">—</span> : <PriceCell entry={s.c} />}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <SchematicImage l={c.l} n={c.n} />

      {simUrl && <SimButton sim={simUrl} />}

      {c.dia && <pre>{c.dia}</pre>}

      {c.fm && <div className="fm mt-3" dangerouslySetInnerHTML={{ __html: c.fm }} />}
      {c.note && <div className="fm mt-3" dangerouslySetInnerHTML={{ __html: c.note }} />}
      {c.warn && (
        <div className="warn mt-3 flex gap-2">
          <span className="font-bold">⚠</span>
          <span dangerouslySetInnerHTML={{ __html: c.warn }} />
        </div>
      )}

      <ResourcesPanel partNames={c.parts.map(p => p[0])} />
    </article>
  )
}

function ShareButton({ id, name }: { id: string; name: string }) {
  const [done, setDone] = useState(false)
  const { T, tvn, mode } = useI18n()
  const label = tStr(T.share, tvn.share, mode)
  const onClick = async () => {
    const url = window.location.origin + window.location.pathname + '#' + id
    if (navigator.share) {
      try { await navigator.share({ title: name, url }); return } catch { /* fallthrough */ }
    }
    try {
      await navigator.clipboard.writeText(url)
      setDone(true)
      setTimeout(() => setDone(false), 1500)
    } catch {
      window.prompt(label, url)
    }
  }
  return (
    <button
      onClick={onClick}
      title={label}
      className="size-7 rounded-full border border-[var(--color-border)] hover:border-[var(--color-acc)] transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-acc)] print:hidden"
    >
      {done ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
    </button>
  )
}

function PrintButton({ id }: { id: string }) {
  const { T, tvn, mode } = useI18n()
  const label = tStr(T.print, tvn.print, mode)
  const onClick = () => {
    document.querySelectorAll('.card.printing').forEach(el => el.classList.remove('printing'))
    const el = document.getElementById(id)
    if (el) {
      el.classList.add('printing')
      window.print()
      setTimeout(() => el.classList.remove('printing'), 1000)
    } else {
      window.print()
    }
  }
  return (
    <button
      onClick={onClick}
      title={label}
      className="size-7 rounded-full border border-[var(--color-border)] hover:border-[var(--color-acc)] transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-acc)] print:hidden"
    >
      <Printer className="size-3.5" />
    </button>
  )
}

function SchematicImage({ l, n }: { l: number; n: number }) {
  const [zoom, setZoom] = useState(false)
  const src = `/svg/${l}-${n}.svg`
  return (
    <>
      <button
        type="button"
        onClick={() => setZoom(true)}
        className="block w-full mt-4 cursor-zoom-in"
        title="Click to zoom"
        aria-label="Zoom schematic"
      >
        <img
          className="sch w-full max-w-2xl mx-auto block"
          src={src}
          alt={`Sơ đồ ${l}.${n}`}
          loading="lazy"
          onError={e => (e.currentTarget.style.display = 'none')}
        />
      </button>
      {zoom && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoom(false)}
        >
          <button onClick={() => setZoom(false)} className="absolute top-4 right-4 size-10 rounded-full bg-white/10 text-white flex items-center justify-center" aria-label="Close">
            <X className="size-5" />
          </button>
          <img src={src} alt={`Sơ đồ ${l}.${n} (zoomed)`} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </>
  )
}
