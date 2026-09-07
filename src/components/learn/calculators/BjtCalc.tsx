import { useState } from 'react'
import { NumInput } from './NumInput'

export function BjtCalc() {
  const [vin, setVin] = useState(3.3)
  const [hfe, setHfe] = useState(100)
  const [ic_mA, setIc] = useState(100)
  const k = 5
  const vbe = 0.7
  const ib_mA = (ic_mA / hfe) * k
  const rb = (vin - vbe) / (ib_mA / 1000)

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <NumInput label="V_in (V)" value={vin} setValue={setVin} />
        <NumInput label="h_FE" value={hfe} setValue={setHfe} />
        <NumInput label="I_C (mA)" value={ic_mA} setValue={setIc} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)]">
          <div className="text-xs text-[var(--color-muted)]">I_B (k={k})</div>
          <div className="text-sm font-bold font-mono">{ib_mA.toFixed(2)} mA</div>
        </div>
        <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-ok)_15%,transparent)]">
          <div className="text-xs text-[var(--color-muted)]">R_B</div>
          <div className="text-sm font-bold font-mono">{rb > 0 ? `${(rb / 1000).toFixed(2)} kΩ` : '—'}</div>
        </div>
      </div>
    </div>
  )
}
