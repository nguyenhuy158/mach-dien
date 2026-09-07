import { useState } from 'react'
import { NumInput } from './NumInput'

export function RcFcCalc() {
  const [r, setR] = useState(1000)
  const [c_nF, setC] = useState(100)
  const c = c_nF / 1e9
  const fc = 1 / (2 * Math.PI * r * c)
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <NumInput label="R (Ω)" value={r} setValue={setR} />
        <NumInput label="C (nF)" value={c_nF} setValue={setC} />
      </div>
      <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-center">
        <div className="text-xs text-[var(--color-muted)]">f_c = 1/(2πRC)</div>
        <div className="text-lg font-bold font-mono">
          {fc >= 1000 ? `${(fc / 1000).toFixed(2)} kHz` : `${fc.toFixed(1)} Hz`}
        </div>
        <div className="text-xs text-[var(--color-muted)] mt-1">Tín hiệu tại f_c bị suy hao −3dB (còn 70.7%)</div>
      </div>
    </div>
  )
}
