import { useState } from 'react'
import { NumInput } from './NumInput'

export function FiveFive55Calc() {
  const [r1, setR1] = useState(1000)
  const [r2, setR2] = useState(10000)
  const [c_uF, setC] = useState(10)
  const c = c_uF / 1e6
  const f = 1.44 / ((r1 + 2 * r2) * c)
  const duty = (r1 + r2) / (r1 + 2 * r2)
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <NumInput label="R1 (Ω)" value={r1} setValue={setR1} />
        <NumInput label="R2 (Ω)" value={r2} setValue={setR2} />
        <NumInput label="C (µF)" value={c_uF} setValue={setC} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)]">
          <div className="text-xs text-[var(--color-muted)]">f</div>
          <div className="text-lg font-bold font-mono">{f < 1 ? `${(f * 1000).toFixed(2)} mHz` : f < 1000 ? `${f.toFixed(2)} Hz` : `${(f / 1000).toFixed(2)} kHz`}</div>
        </div>
        <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-ok)_15%,transparent)]">
          <div className="text-xs text-[var(--color-muted)]">Duty cycle</div>
          <div className="text-lg font-bold font-mono">{(duty * 100).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  )
}
