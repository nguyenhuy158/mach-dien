import { useState } from 'react'
import { NumInput } from './NumInput'

export function OhmCalc() {
  const [v, setV] = useState(5)
  const [i, setI] = useState(0.02)
  const [r, setR] = useState(250)

  const calcV = () => i * r
  const calcI = () => v / r
  const calcR = () => v / i

  return (
    <div className="grid grid-cols-3 gap-2 items-end">
      <NumInput label="V (V)" value={v} setValue={setV} />
      <NumInput label="I (A)" value={i} setValue={setI} />
      <NumInput label="R (Ω)" value={r} setValue={setR} />
      <button onClick={() => setV(calcV())} className="px-2 py-1 text-xs rounded bg-[var(--color-acc)] text-[var(--color-bg)]">Tính V = I·R</button>
      <button onClick={() => setI(calcI())} className="px-2 py-1 text-xs rounded bg-[var(--color-acc)] text-[var(--color-bg)]">Tính I = V/R</button>
      <button onClick={() => setR(calcR())} className="px-2 py-1 text-xs rounded bg-[var(--color-acc)] text-[var(--color-bg)]">Tính R = V/I</button>
    </div>
  )
}
