import { useState } from 'react'
import { Calculator, X } from 'lucide-react'

const FKEY = 'machdien.calc.open'

export function FloatingCalculator() {
  const [open, setOpen] = useState(() => localStorage.getItem(FKEY) === '1')
  const [v, setV] = useState(5)
  const [i, setI] = useState(0.02)
  const [r, setR] = useState(250)

  const toggle = () => {
    const next = !open
    setOpen(next)
    localStorage.setItem(FKEY, next ? '1' : '0')
  }

  const calcV = i * r
  const calcI = v / r
  const calcR = v / i

  return (
    <>
      {!open && (
        <button
          onClick={toggle}
          className="fixed bottom-6 right-6 z-30 size-12 rounded-full bg-[var(--color-acc)] text-[var(--color-bg)] shadow-lg flex items-center justify-center hover:scale-110 transition print:hidden"
          title="Máy tính nhanh"
        >
          <Calculator className="size-5" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-30 w-72 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-4 print:hidden fade-in">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">⚡ Ohm: V = I·R</h4>
            <button onClick={toggle} className="size-6 rounded-full hover:bg-[var(--color-border)] flex items-center justify-center">
              <X className="size-3.5" />
            </button>
          </div>
          <div className="space-y-1.5">
            <div>
              <div className="text-[10px] text-[var(--color-muted)]">V (V)</div>
              <input type="number" value={v} step="0.1" onChange={e => setV(parseFloat(e.target.value) || 0)} className="w-full rounded px-2 py-1 text-sm border border-[var(--color-border)] bg-transparent font-mono" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-muted)]">I (A)</div>
              <input type="number" value={i} step="0.01" onChange={e => setI(parseFloat(e.target.value) || 0)} className="w-full rounded px-2 py-1 text-sm border border-[var(--color-border)] bg-transparent font-mono" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-muted)]">R (Ω)</div>
              <input type="number" value={r} step="1" onChange={e => setR(parseFloat(e.target.value) || 0)} className="w-full rounded px-2 py-1 text-sm border border-[var(--color-border)] bg-transparent font-mono" />
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1 text-[10px]">
            <button onClick={() => setV(calcV)} className="px-1 py-1 rounded bg-[var(--color-acc)] text-[var(--color-bg)] font-medium">V=I·R → {calcV.toFixed(2)}</button>
            <button onClick={() => setI(calcI)} className="px-1 py-1 rounded bg-[var(--color-acc)] text-[var(--color-bg)] font-medium">I=V/R → {calcI.toFixed(3)}</button>
            <button onClick={() => setR(calcR)} className="px-1 py-1 rounded bg-[var(--color-acc)] text-[var(--color-bg)] font-medium">R=V/I → {calcR.toFixed(0)}</button>
          </div>
        </div>
      )}
    </>
  )
}
