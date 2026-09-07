import { useState } from 'react'
import { NumInput } from './NumInput'
import { formatResistance } from '../../../data/learn'

export function LedCalc() {
  const [vcc, setVcc] = useState(5)
  const [vf, setVf] = useState(1.8)
  const [if_mA, setIf] = useState(20)
  const r = (vcc - vf) / (if_mA / 1000)
  const standard = [100, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000, 1500, 2200, 3300, 4700]
  const closest = standard.reduce((p, c) => Math.abs(c - r) < Math.abs(p - r) ? c : p)

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <NumInput label="V_CC (V)" value={vcc} setValue={setVcc} />
        <NumInput label="V_f (V)" value={vf} setValue={setVf} />
        <NumInput label="I_f (mA)" value={if_mA} setValue={setIf} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)]">
          <div className="text-xs text-[var(--color-muted)]">R tính được</div>
          <div className="text-lg font-bold font-mono">{r.toFixed(0)}Ω</div>
        </div>
        <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-ok)_15%,transparent)]">
          <div className="text-xs text-[var(--color-muted)]">Gợi ý chuẩn E24</div>
          <div className="text-lg font-bold font-mono">{formatResistance(closest)}</div>
        </div>
      </div>
    </div>
  )
}
