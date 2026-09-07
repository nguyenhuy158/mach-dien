import { useState } from 'react'
import { NumInput } from './NumInput'

export function LdoCalc() {
  const [vin, setVin] = useState(12)
  const [vout, setVout] = useState(5)
  const [i_mA, setI] = useState(500)
  const p = (vin - vout) * (i_mA / 1000)
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <NumInput label="V_in (V)" value={vin} setValue={setVin} />
        <NumInput label="V_out (V)" value={vout} setValue={setVout} />
        <NumInput label="I (mA)" value={i_mA} setValue={setI} />
      </div>
      <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-center">
        <div className="text-xs text-[var(--color-muted)]">P = (V_in - V_out)·I</div>
        <div className="text-lg font-bold font-mono">{p.toFixed(2)} W</div>
        <div className="text-xs text-[var(--color-muted)] mt-1">
          {p > 1 ? '⚠ Cần tản nhiệt TO-220' : p > 0.5 ? 'Cần tản nhiệt nhỏ' : 'OK không cần tản nhiệt'}
        </div>
      </div>
    </div>
  )
}
