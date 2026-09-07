import { useState } from 'react'
import { NumInput } from './NumInput'
import { formatResistance } from '../../../data/learn'

export function RSeriesCalc() {
  const [r1, setR1] = useState(1000)
  const [r2, setR2] = useState(2200)
  const r = r1 + r2
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <NumInput label="R1 (Ω)" value={r1} setValue={setR1} />
        <NumInput label="R2 (Ω)" value={r2} setValue={setR2} />
      </div>
      <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-center">
        <div className="text-xs text-[var(--color-muted)]">R = R1 + R2</div>
        <div className="text-lg font-bold font-mono">{formatResistance(r)}</div>
      </div>
    </div>
  )
}
