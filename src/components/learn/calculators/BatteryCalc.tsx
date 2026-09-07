import { useState } from 'react'
import { NumInput } from './NumInput'

export function BatteryCalc() {
  const [c, setC] = useState(3000)
  const [i_mA, setI] = useState(100)
  const hours = c / i_mA
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <NumInput label="Dung lượng (mAh)" value={c} setValue={setC} />
        <NumInput label="Dòng (mA)" value={i_mA} setValue={setI} />
      </div>
      <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-center">
        <div className="text-xs text-[var(--color-muted)]">t = C / I</div>
        <div className="text-lg font-bold font-mono">
          {hours >= 24 ? `${(hours / 24).toFixed(1)} ngày` : hours >= 1 ? `${hours.toFixed(1)} giờ` : `${(hours * 60).toFixed(0)} phút`}
        </div>
        <div className="text-xs text-[var(--color-muted)] mt-1">Thực tế trừ 10-20% hao hụt</div>
      </div>
    </div>
  )
}
