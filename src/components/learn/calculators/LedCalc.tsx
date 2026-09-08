import { useState } from 'react'
import { NumInput } from './NumInput'
import { formatResistance } from '../../../data/learn'

const LED_PRESETS = [
  { name: 'Đỏ', vf: 1.9, color: 'bg-red-500' },
  { name: 'Vàng', vf: 2.1, color: 'bg-amber-400' },
  { name: 'Xanh lá', vf: 2.3, color: 'bg-emerald-500' },
  { name: 'Xanh dương', vf: 3.2, color: 'bg-blue-500' },
  { name: 'Trắng', vf: 3.2, color: 'bg-slate-200 text-slate-800' },
]

const VIN_PRESETS = [3.3, 5, 9, 12]

export function LedCalc() {
  const [vcc, setVcc] = useState(5)
  const [vf, setVf] = useState(1.9)
  const [if_mA, setIf] = useState(20)

  const vDiff = vcc - vf
  const valid = vDiff > 0 && if_mA > 0
  const r = valid ? vDiff / (if_mA / 1000) : 0
  const standard = [100, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000, 1500, 2200, 3300, 4700, 10000]
  const closest = valid ? standard.reduce((p, c) => Math.abs(c - r) < Math.abs(p - r) ? c : p) : 0

  // Power dissipation on resistor: P = I^2 * R
  const p_mW = valid ? Math.pow(if_mA / 1000, 2) * closest * 1000 : 0
  const p_W = p_mW / 1000

  return (
    <div className="space-y-3">
      {/* Quick LED Color presets */}
      <div>
        <div className="text-[11px] text-[var(--color-muted)] mb-1">Màu LED gợi ý (Vf):</div>
        <div className="flex flex-wrap gap-1.5">
          {LED_PRESETS.map(p => (
            <button
              key={p.name}
              type="button"
              onClick={() => setVf(p.vf)}
              className={`px-2 py-0.5 rounded text-xs border transition flex items-center gap-1.5 ${
                Math.abs(vf - p.vf) < 0.05
                  ? 'border-[var(--color-acc)] font-bold bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-acc)]'
              }`}
            >
              <span className={`size-2 rounded-full ${p.color}`} />
              {p.name} ({p.vf}V)
            </button>
          ))}
        </div>
      </div>

      {/* Quick Vin presets */}
      <div>
        <div className="text-[11px] text-[var(--color-muted)] mb-1">Nguồn cấp phổ biến (Vcc):</div>
        <div className="flex gap-1.5">
          {VIN_PRESETS.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setVcc(v)}
              className={`px-2 py-0.5 rounded text-xs border transition ${
                vcc === v
                  ? 'border-[var(--color-acc)] font-bold bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-acc)]'
              }`}
            >
              {v}V
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <NumInput label="V_CC (V)" value={vcc} setValue={setVcc} />
        <NumInput label="V_f (V)" value={vf} setValue={setVf} />
        <NumInput label="I_f (mA)" value={if_mA} setValue={setIf} />
      </div>

      {valid ? (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)]">
              <div className="text-[11px] text-[var(--color-muted)]">R tính toán</div>
              <div className="text-base font-bold font-mono">{r.toFixed(0)}Ω</div>
            </div>
            <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-ok)_15%,transparent)]">
              <div className="text-[11px] text-[var(--color-muted)]">Chuẩn E24 khuyên dùng</div>
              <div className="text-base font-bold font-mono text-[var(--color-ok)]">{formatResistance(closest)}</div>
            </div>
            <div className="p-2 rounded bg-[color-mix(in_srgb,var(--color-warn)_15%,transparent)]">
              <div className="text-[11px] text-[var(--color-muted)]">Công suất tỏa nhiệt P</div>
              <div className="text-base font-bold font-mono">{p_mW.toFixed(1)} mW</div>
            </div>
          </div>
          <div className="text-[11px] text-[var(--color-muted)] flex items-center gap-1.5">
            <span>💡 <b>Công suất trở:</b></span>
            {p_W > 0.25 ? (
              <span className="text-amber-500 font-semibold">⚠ P &gt; 1/4W! Cần dùng trở công suất 1/2W hoặc 1W để không nóng.</span>
            ) : p_W > 0.125 ? (
              <span>Dùng trở 1/4W (0.25W) — trở sẽ ấm nhẹ (~{(p_W * 1000).toFixed(0)}mW).</span>
            ) : (
              <span className="text-emerald-500">Trở 1/4W thông dụng mát mẻ an toàn.</span>
            )}
          </div>
        </div>
      ) : (
        <div className="text-xs text-rose-500 p-2 rounded bg-rose-500/10 border border-rose-500/20">
          ⚠ Vcc ({vcc}V) phải lớn hơn điện áp rơi Vf ({vf}V) của LED để có dòng chạy qua.
        </div>
      )}
    </div>
  )
}
