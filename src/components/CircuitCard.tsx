import { useState } from 'react'
import { SIM, SHOP, isNaPart, nrm, parsePrice } from '../data/circuits'
import type { Circuit } from '../data/circuits'
import { PriceCell, Thumb } from './Parts'
import { SimButton } from './SimButton'
import { ResourcesPanel } from './ResourcesPanel'
import { Share2, Check, Printer, X, Calculator, Wrench, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { useI18n, Bilingual, tStr } from '../i18n'
import { CIRCUIT_CALCULATORS } from '../data/circuitCalculators'
import { TROUBLESHOOTING } from '../data/troubleshooting'
import { CalculatorPanel } from './learn/calculators/CalculatorPanel'

interface Props {
  c: Circuit
  flash?: boolean
}

export function CircuitCard({ c, flash }: Props) {
  const [showCalc, setShowCalc] = useState(false)
  const [showTrouble, setShowTrouble] = useState(false)
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({})
  
  const circuitKey = `${c.l}-${c.n}`
  const calcs = CIRCUIT_CALCULATORS[circuitKey]
  const [selectedCalc, setSelectedCalc] = useState<string>(calcs ? calcs[0].kind : '')
  const trouble = TROUBLESHOOTING[circuitKey]

  const simUrl = SIM[circuitKey]
  const anyNa = c.parts.some(p => isNaPart(p.name))
  const searchBlob = (
    c.name + ' ' + c.goal + ' ' + c.parts.map(p => p.name + ' ' + p.spec).join(' ')
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
            const s = SHOP[p.name] || {}
            const isNa = !s.b && !s.c && !s.s
            const priceB = s.b?.p ? parsePrice(s.b.p) : 0
            const priceC = s.c?.p ? parsePrice(s.c.p) : 0
            const bothPriced = priceB > 0 && priceC > 0 && priceB !== priceC
            const bIsCheaper = bothPriced && priceB < priceC
            const cIsCheaper = bothPriced && priceC < priceB
            return (
              <tr key={i} className={`border-t border-[var(--color-border)] ${isNa ? 'na-row' : ''}`}>
                <td className="im py-2">
                  <Thumb url={s.b?.u || s.c?.u} alt={s.b?.t || s.c?.t} />
                </td>
                <td className="p-name py-2 font-medium">
                  <Bilingual en={p.enName || p.name} vn={p.name} />
                </td>
                <td className="p-spec py-2 text-[var(--color-muted)] text-xs">{p.spec}</td>
                <td className="p-qty py-2 text-center">{p.qty}</td>
                <td className="p-blk py-2">
                  {s.s ? (
                    <span className="nn">—</span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <PriceCell entry={s.b} />
                      {bIsCheaper && (
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded leading-none">
                          Rẻ hơn
                        </span>
                      )}
                    </span>
                  )}
                </td>
                <td className="p-caka py-2">
                  {s.s ? (
                    <span className="nn">—</span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <PriceCell entry={s.c} />
                      {cIsCheaper && (
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded leading-none">
                          Rẻ hơn
                        </span>
                      )}
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <SchematicImage l={c.l} n={c.n} />

      {simUrl && <SimButton sim={simUrl} title="Falstad CircuitJS" />}
      {c.l === 2 && c.n === 7 && (
        <SimButton
          sim="https://wokwi.com/projects/new/esp32"
          title="Wokwi ESP32 Live Simulator"
          isWokwi
        />
      )}

      {c.dia && <pre>{c.dia}</pre>}

      {c.fm && <div className="fm mt-3" dangerouslySetInnerHTML={{ __html: c.fm }} />}
      {c.note && <div className="fm mt-3" dangerouslySetInnerHTML={{ __html: c.note }} />}
      {c.warn && (
        <div className="warn mt-3 flex gap-2">
          <span className="font-bold">⚠</span>
          <span dangerouslySetInnerHTML={{ __html: c.warn }} />
        </div>
      )}

      {/* Interactive Tooling & Troubleshooting Action Bar */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex flex-wrap gap-2 print:hidden">
        {calcs && calcs.length > 0 && (
          <button
            type="button"
            onClick={() => setShowCalc(v => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              showCalc
                ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-acc)] bg-[var(--color-card)] text-[var(--color-fg)]'
            }`}
          >
            <Calculator className="size-3.5" />
            <span>{showCalc ? 'Ẩn máy tính' : '🧮 Máy tính tham số'}</span>
            {showCalc ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
        )}

        {trouble && (
          <button
            type="button"
            onClick={() => setShowTrouble(v => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              showTrouble
                ? 'bg-amber-600 text-white border-amber-600'
                : 'border-[var(--color-border)] hover:border-amber-500 bg-[var(--color-card)] text-[var(--color-fg)]'
            }`}
          >
            <Wrench className="size-3.5 text-amber-500" />
            <span>{showTrouble ? 'Đóng gỡ lỗi' : '🔧 Gỡ lỗi: Mạch không chạy?'}</span>
            {showTrouble ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
        )}
      </div>

      {/* In-Card Interactive Calculator */}
      {showCalc && calcs && (
        <div className="mt-3 p-3.5 rounded-xl bg-[var(--color-bg)] border-2 border-[var(--color-acc)] animate-in fade-in">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-acc)] flex items-center gap-1.5">
              <Calculator className="size-3.5" />
              <span>Công cụ tính toán cho mạch {c.l}.{c.n}</span>
            </div>
            {calcs.length > 1 && (
              <div className="flex gap-1">
                {calcs.map(cl => (
                  <button
                    key={cl.kind}
                    type="button"
                    onClick={() => setSelectedCalc(cl.kind)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border transition ${
                      selectedCalc === cl.kind
                        ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-acc)]'
                    }`}
                  >
                    {cl.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <CalculatorPanel kind={selectedCalc || calcs[0].kind} />
        </div>
      )}

      {/* In-Card Troubleshooting Checklist */}
      {showTrouble && trouble && (
        <div className="mt-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/30 text-xs space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400 text-sm">
            <Wrench className="size-4" />
            <span>Checklist gỡ lỗi: {trouble.title}</span>
          </div>

          <div className="space-y-2">
            {trouble.checks.map((check, idx) => {
              const isChecked = !!checkedSteps[idx]
              return (
                <label
                  key={idx}
                  className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition border ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-[var(--color-fg)] line-through opacity-75'
                      : 'bg-[var(--color-card)] border-[var(--color-border)] hover:border-amber-500/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={e => setCheckedSteps(prev => ({ ...prev, [idx]: e.target.checked }))}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="leading-relaxed">{check}</span>
                </label>
              )
            })}
          </div>

          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Lỗi phổ biến của người mới:</span> {trouble.commonMistake}
            </div>
          </div>
        </div>
      )}

      <ResourcesPanel partNames={c.parts.map(p => p.name)} />
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
          className="sch w-full max-w-2xl mx-auto block rounded-xl p-3 bg-slate-100/60 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800"
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
