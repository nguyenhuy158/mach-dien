import { useState } from 'react'
import { NumInput } from './NumInput'

export function OpAmpCalc() {
  const [rf, setRf] = useState(10000)
  const [rg, setRg] = useState(1000)
  const a = 1 + rf / rg
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <NumInput label="R_f (Ω)" value={rf} setValue={setRf} />
        <NumInput label="R_g (Ω)" value={rg} setValue={setRg} />
      </div>
      <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-center">
        <div className="text-xs text-[var(--color-muted)]">Gain A_v = 1 + R_f/R_g</div>
        <div className="text-lg font-bold font-mono">{a.toFixed(2)}×</div>
        <div className="text-xs text-[var(--color-muted)] mt-1">Đảo cực: thay bằng A_v = -R_f/R_in</div>
      </div>
    </div>
  )
}
