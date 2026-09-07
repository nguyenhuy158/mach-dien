import { useState } from 'react'
import { NumInput } from './NumInput'

export function RcTauCalc() {
  const [r, setR] = useState(10000)
  const [c_nF, setC] = useState(100)
  const c = c_nF / 1e9
  const tau = r * c
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <NumInput label="R (Ω)" value={r} setValue={setR} />
        <NumInput label="C (nF)" value={c_nF} setValue={setC} />
      </div>
      <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-center">
        <div className="text-xs text-[var(--color-muted)]">τ = R·C</div>
        <div className="text-lg font-bold font-mono">{tau >= 1 ? `${tau.toFixed(3)} s` : `${(tau * 1000).toFixed(2)} ms`}</div>
        <div className="text-xs text-[var(--color-muted)] mt-1">5τ = {(tau * 5).toFixed(3)} s — coi như đầy/xả hết</div>
      </div>
    </div>
  )
}
