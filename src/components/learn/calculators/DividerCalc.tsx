import { useState } from 'react'
import { NumInput } from './NumInput'

export function DividerCalc() {
  const [vin, setVin] = useState(5)
  const [r1, setR1] = useState(10000)
  const [r2, setR2] = useState(10000)
  const vout = (vin * r2) / (r1 + r2)

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <NumInput label="V_in (V)" value={vin} setValue={setVin} />
        <NumInput label="R1 (Ω)" value={r1} setValue={setR1} />
        <NumInput label="R2 (Ω)" value={r2} setValue={setR2} />
      </div>
      <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-center">
        <div className="text-xs text-[var(--color-muted)]">V_out</div>
        <div className="text-lg font-bold font-mono">{vout.toFixed(3)} V</div>
      </div>
    </div>
  )
}
