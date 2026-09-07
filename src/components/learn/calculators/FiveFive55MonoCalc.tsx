import { useState } from 'react'
import { NumInput } from './NumInput'

export function FiveFive55MonoCalc() {
  const [r, setR] = useState(10000)
  const [c_uF, setC] = useState(10)
  const c = c_uF / 1e6
  const t = 1.1 * r * c
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <NumInput label="R (Ω)" value={r} setValue={setR} />
        <NumInput label="C (µF)" value={c_uF} setValue={setC} />
      </div>
      <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-center">
        <div className="text-xs text-[var(--color-muted)]">T = 1.1·R·C</div>
        <div className="text-lg font-bold font-mono">
          {t >= 1 ? `${t.toFixed(2)} s` : t >= 0.001 ? `${(t * 1000).toFixed(2)} ms` : `${(t * 1e6).toFixed(2)} µs`}
        </div>
      </div>
    </div>
  )
}
