import { useState, useMemo } from 'react'
import { NumInput } from './NumInput'
import { formatResistance } from '../../../data/learn'

const E24_BASE = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1]
const MULTIPLIERS = [100, 1000, 10000, 100000]

const E24_VALUES: number[] = []
for (const m of MULTIPLIERS) {
  for (const b of E24_BASE) {
    E24_VALUES.push(Math.round(b * m))
  }
}

export function DividerCalc() {
  const [mode, setMode] = useState<'direct' | 'reverse'>('direct')
  const [vin, setVin] = useState(5)
  const [r1, setR1] = useState(10000)
  const [r2, setR2] = useState(10000)

  // Reverse mode: target Vout
  const [targetVout, setTargetVout] = useState(3.3)

  // Direct calculation
  const totalR = r1 + r2
  const vout = totalR > 0 ? (vin * r2) / totalR : 0
  const i_mA = totalR > 0 ? (vin / totalR) * 1000 : 0
  const p_mW = totalR > 0 ? (Math.pow(vin, 2) / totalR) * 1000 : 0

  // Reverse calculation: find best E24 pairs
  const suggestions = useMemo(() => {
    if (targetVout <= 0 || targetVout >= vin) return []
    const desiredRatio = targetVout / vin

    interface Candidate {
      r1: number
      r2: number
      vout: number
      errorPct: number
      current_uA: number
    }

    const candidates: Candidate[] = []
    // Test common R1 values (1k - 100k) to keep bridge current practical
    const practicalValues = E24_VALUES.filter(r => r >= 1000 && r <= 100000)

    for (const testR1 of practicalValues) {
      // ratio = R2 / (R1 + R2) => R2 = R1 * ratio / (1 - ratio)
      const idealR2 = (testR1 * desiredRatio) / (1 - desiredRatio)
      // find closest E24 to idealR2
      let bestR2 = practicalValues[0]
      let minDiff = Math.abs(bestR2 - idealR2)
      for (const candidate of practicalValues) {
        const diff = Math.abs(candidate - idealR2)
        if (diff < minDiff) {
          minDiff = diff
          bestR2 = candidate
        }
      }
      const actualVout = (vin * bestR2) / (testR1 + bestR2)
      const errorPct = Math.abs((actualVout - targetVout) / targetVout) * 100
      const current_uA = (vin / (testR1 + bestR2)) * 1000000
      candidates.push({ r1: testR1, r2: bestR2, vout: actualVout, errorPct, current_uA })
    }

    // Sort by smallest error percentage, then practical bridge current (0.05mA - 2mA)
    candidates.sort((a, b) => {
      if (Math.abs(a.errorPct - b.errorPct) > 0.1) {
        return a.errorPct - b.errorPct
      }
      // prefer current around 100uA - 500uA
      const distA = Math.abs(a.current_uA - 300)
      const distB = Math.abs(b.current_uA - 300)
      return distA - distB
    })

    // Deduplicate identical (r1, r2)
    const unique: Candidate[] = []
    const seen = new Set<string>()
    for (const c of candidates) {
      const key = `${c.r1}-${c.r2}`
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(c)
        if (unique.length >= 4) break
      }
    }
    return unique
  }, [vin, targetVout])

  return (
    <div className="space-y-3">
      {/* Mode switcher */}
      <div className="flex gap-2 text-xs border-b border-[var(--color-border)] pb-2">
        <button
          type="button"
          onClick={() => setMode('direct')}
          className={`px-2.5 py-1 rounded transition ${
            mode === 'direct'
              ? 'bg-[var(--color-acc)] text-[var(--color-bg)] font-bold'
              : 'text-[var(--color-muted)] hover:text-[var(--color-acc)]'
          }`}
        >
          1. Tính V_out từ R1, R2
        </button>
        <button
          type="button"
          onClick={() => setMode('reverse')}
          className={`px-2.5 py-1 rounded transition ${
            mode === 'reverse'
              ? 'bg-[var(--color-acc)] text-[var(--color-bg)] font-bold'
              : 'text-[var(--color-muted)] hover:text-[var(--color-acc)]'
          }`}
        >
          2. Gợi ý cặp trở E24 từ V_out
        </button>
      </div>

      {mode === 'direct' ? (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <NumInput label="V_in (V)" value={vin} setValue={setVin} />
            <NumInput label="R1 (Ω)" value={r1} setValue={setR1} />
            <NumInput label="R2 (Ω)" value={r2} setValue={setR2} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)]">
              <div className="text-[10px] text-[var(--color-muted)]">V_out</div>
              <div className="text-base font-bold font-mono text-[var(--color-acc)]">{vout.toFixed(3)} V</div>
            </div>
            <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-ok)_15%,transparent)]">
              <div className="text-[10px] text-[var(--color-muted)]">Dòng qua cầu</div>
              <div className="text-base font-bold font-mono">{i_mA.toFixed(3)} mA</div>
            </div>
            <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-warn)_15%,transparent)]">
              <div className="text-[10px] text-[var(--color-muted)]">Công suất hao phí</div>
              <div className="text-base font-bold font-mono">{p_mW.toFixed(1)} mW</div>
            </div>
          </div>
          <div className="text-[11px] text-[var(--color-muted)]">
            💡 <i>Công thức:</i> V_out = Vin · R2 / (R1 + R2). R2 là điện trở nối từ chân ra xuống GND.
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <NumInput label="V_in nguồn cấp (V)" value={vin} setValue={setVin} />
            <NumInput label="V_out mong muốn (V)" value={targetVout} setValue={setTargetVout} />
          </div>

          <div>
            <div className="text-[11px] text-[var(--color-muted)] mb-1">
              Top cặp trở chuẩn E24 cho ra {targetVout}V từ {vin}V:
            </div>
            {suggestions.length > 0 ? (
              <div className="space-y-1.5">
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setR1(s.r1)
                      setR2(s.r2)
                      setMode('direct')
                    }}
                    className="p-2 rounded border border-[var(--color-border)] hover:border-[var(--color-acc)] bg-[var(--color-card)] flex items-center justify-between text-xs cursor-pointer transition"
                    title="Bấm để chọn cặp trở này"
                  >
                    <div className="font-mono font-medium">
                      R1 = <span className="font-bold text-[var(--color-acc)]">{formatResistance(s.r1)}</span>, R2 = <span className="font-bold text-[var(--color-acc)]">{formatResistance(s.r2)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className="font-mono">V_out: <b>{s.vout.toFixed(2)}V</b></span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${s.errorPct < 1 ? 'bg-emerald-500/10 text-emerald-500 font-bold' : 'bg-amber-500/10 text-amber-500'}`}>
                        Lệch: {s.errorPct.toFixed(1)}%
                      </span>
                      <span className="text-[var(--color-muted)] hidden sm:inline text-[10px]">
                        {(s.current_uA / 1000).toFixed(2)}mA
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-rose-500 p-2 rounded bg-rose-500/10">
                V_out mong muốn phải nhỏ hơn V_in và lớn hơn 0V.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
