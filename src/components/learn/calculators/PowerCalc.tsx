import { useState } from 'react'
import { NumInput } from './NumInput'

export function PowerCalc() {
  const [v, setV] = useState(5)
  const [i, setI] = useState(0.5)
  const p = v * i
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <NumInput label="V (V)" value={v} setValue={setV} />
        <NumInput label="I (A)" value={i} setValue={setI} />
      </div>
      <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-center">
        <div className="text-xs text-[var(--color-muted)]">P = V × I</div>
        <div className="text-lg font-bold font-mono">{p.toFixed(3)} W</div>
        <div className="text-xs text-[var(--color-muted)] mt-1">
          = {p * 1000 >= 1000 ? `${(p * 1000).toFixed(0)} mW` : `${(p * 1000).toFixed(1)} mW`}
        </div>
      </div>
    </div>
  )
}
