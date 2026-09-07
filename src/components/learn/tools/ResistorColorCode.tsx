import { useState } from 'react'
import { COLOR_BANDS, TOLERANCE_BANDS, decodeResistor, formatResistance } from '../../../data/learn'

export function ResistorColorCode() {
  const [b1, setB1] = useState('nâu')
  const [b2, setB2] = useState('đen')
  const [b3, setB3] = useState('đen')
  const [mult, setMult] = useState('nâu')
  const [tol, setTol] = useState('vàng')

  const result = decodeResistor(b1, b2, b3, mult, tol)
  const totalOhms = result.value
  const lowOhms = Math.round(totalOhms * (1 - result.tolerance / 100))
  const highOhms = Math.round(totalOhms * (1 + result.tolerance / 100))

  return (
    <div className="card p-5 bg-[var(--color-card)] border border-[var(--color-border)]">
      <h3 className="text-lg font-bold tracking-tight mb-1">Mã màu điện trở (4 vạch)</h3>
      <p className="text-xs text-[var(--color-muted)] mb-4">Chọn màu từng vạch → giá trị tự tính.</p>

      {/* Visual band */}
      <div className="flex items-center justify-center gap-1 mb-4 py-3 bg-[color-mix(in_srgb,var(--color-bg)_50%,transparent)] rounded-xl">
        <ResistorLead />
        <Band color={TOLERANCE_BANDS[tol]?.hex || '#000'} />
        <Band color={COLOR_BANDS.find(c => c.color === b1)?.hex || '#000'} />
        <Band color={COLOR_BANDS.find(c => c.color === b2)?.hex || '#000'} />
        <Band color={COLOR_BANDS.find(c => c.color === mult)?.hex || '#000'} />
        <ResistorLead />
      </div>

      <div className="text-center mb-4">
        <div className="text-3xl font-bold tracking-tight text-[var(--color-acc)] font-mono">{result.formatted}</div>
        <div className="text-xs text-[var(--color-muted)] mt-1">
          ±{result.tolerance}% → {formatResistance(lowOhms)} … {formatResistance(highOhms)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <BandPicker label="Vạch 1" value={b1} onChange={setB1} />
        <BandPicker label="Vạch 2" value={b2} onChange={setB2} />
        <BandPicker label="Hệ số" value={mult} onChange={setMult} />
        <BandPicker label="Sai số" value={tol} onChange={setTol} bands={[
          { color: 'nâu', hex: TOLERANCE_BANDS['nâu'].hex, label: '±1%' },
          { color: 'đỏ', hex: TOLERANCE_BANDS['đỏ'].hex, label: '±2%' },
          { color: 'vàng', hex: TOLERANCE_BANDS['vàng'].hex, label: '±5%' },
          { color: 'bạc', hex: TOLERANCE_BANDS['bạc'].hex, label: '±10%' },
        ]} />
      </div>

      <div className="mt-4 p-3 rounded-lg bg-[color-mix(in_srgb,var(--color-acc)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-acc)_20%,transparent)] text-xs">
        <b>SMD 3 số:</b> 103 = 10×10³ = 10kΩ, 472 = 47×10² = 4.7kΩ, 4R7 = 4.7Ω
        <br /><b>SMD 4 số:</b> 1001 = 100×10¹ = 1kΩ, 4702 = 470×10² = 47kΩ
      </div>
    </div>
  )
}

function Band({ color }: { color: string }) {
  return <div className="w-7 h-12 rounded" style={{ background: color }} />
}

function ResistorLead() {
  return <div className="w-6 h-1 bg-[var(--color-fg)] opacity-40" />
}

function BandPicker({
  label, value, onChange, bands,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  bands?: { color: string; hex: string; label?: string }[]
}) {
  const list = bands || COLOR_BANDS.map(c => ({ ...c, label: `${c.color}` }))
  return (
    <div>
      <div className="text-xs text-[var(--color-muted)] mb-1">{label}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg px-2 py-1.5 text-sm border border-[var(--color-border)] bg-transparent"
      >
        {list.map(c => (
          <option key={c.color} value={c.color}>{c.label || c.color}</option>
        ))}
      </select>
    </div>
  )
}
