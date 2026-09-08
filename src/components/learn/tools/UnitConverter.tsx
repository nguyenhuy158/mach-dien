import { useState } from 'react'
import { ArrowLeftRight, Copy, Check } from 'lucide-react'
import { useI18n, Bilingual } from '../../../i18n'
import { haptic } from '../../../utils/ux'

type ConverterCategory = 'cap' | 'res' | 'freq' | 'current' | 'awg'

export function UnitConverter() {
  const { mode } = useI18n()
  const [cat, setCat] = useState<ConverterCategory>('cap')

  return (
    <div className="card p-5 bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <ArrowLeftRight className="size-5 text-[var(--color-acc)]" />
        <h3 className="text-lg font-bold tracking-tight">
          <Bilingual en="Electronics Unit Converter" vn="Chuyển đổi đơn vị điện tử" />
        </h3>
      </div>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        <CategoryPill active={cat === 'cap'} onClick={() => setCat('cap')}>
          <Bilingual en="Capacitance" vn="Tụ điện" />
        </CategoryPill>
        <CategoryPill active={cat === 'res'} onClick={() => setCat('res')}>
          <Bilingual en="Resistance" vn="Điện trở" />
        </CategoryPill>
        <CategoryPill active={cat === 'freq'} onClick={() => setCat('freq')}>
          <Bilingual en="Frequency / Period" vn="Tần số & Chu kỳ" />
        </CategoryPill>
        <CategoryPill active={cat === 'current'} onClick={() => setCat('current')}>
          <Bilingual en="Current" vn="Dòng điện" />
        </CategoryPill>
        <CategoryPill active={cat === 'awg'} onClick={() => setCat('awg')}>
          <Bilingual en="Wire AWG" vn="Cỡ dây AWG" />
        </CategoryPill>
      </div>

      {cat === 'cap' && <CapacitanceConverter />}
      {cat === 'res' && <ResistanceConverter />}
      {cat === 'freq' && <FrequencyConverter />}
      {cat === 'current' && <CurrentConverter />}
      {cat === 'awg' && <AwgConverter />}
    </div>
  )
}

function CategoryPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={() => { haptic(5); onClick() }}
      className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
        active
          ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)] shadow-sm'
          : 'border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-acc)]'
      }`}
    >
      {children}
    </button>
  )
}

/* 1. Capacitance Converter */
function CapacitanceConverter() {
  const [val, setVal] = useState<number>(100) // base in nF
  const [unit, setUnit] = useState<'pF' | 'nF' | 'uF' | 'mF' | 'F'>('nF')

  const baseF = unit === 'pF' ? val * 1e-12
    : unit === 'nF' ? val * 1e-9
    : unit === 'uF' ? val * 1e-6
    : unit === 'mF' ? val * 1e-3
    : val

  // 3-digit EIA code (e.g., 100nF -> 104)
  const pF = baseF * 1e12
  let eiaCode = '—'
  if (pF >= 10 && pF < 1e9) {
    const s = Math.round(pF).toString()
    if (s.length >= 2) {
      const sig = s.slice(0, 2)
      const exp = s.length - 2
      eiaCode = `${sig}${exp}`
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-[var(--color-muted)] font-medium block mb-1">
            <Bilingual en="Input value" vn="Giá trị nhập" />
          </label>
          <input
            type="number"
            value={isNaN(val) ? '' : val}
            onChange={e => setVal(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg px-3 py-2 text-base font-mono border border-[var(--color-border)] bg-[var(--color-bg)] focus:ring-2 focus:ring-[var(--color-acc)] focus:outline-none"
          />
        </div>
        <div className="w-28">
          <label className="text-xs text-[var(--color-muted)] font-medium block mb-1">
            <Bilingual en="Unit" vn="Đơn vị" />
          </label>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value as any)}
            className="w-full rounded-lg px-3 py-2 text-sm font-semibold border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="pF">pF (pico)</option>
            <option value="nF">nF (nano)</option>
            <option value="uF">µF (micro)</option>
            <option value="mF">mF (milli)</option>
            <option value="F">F (Farad)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <OutputCard label="pF (picofarad)" value={formatNum(baseF * 1e12)} unit="pF" />
        <OutputCard label="nF (nanofarad)" value={formatNum(baseF * 1e9)} unit="nF" highlight />
        <OutputCard label="µF (microfarad)" value={formatNum(baseF * 1e6)} unit="µF" highlight />
        <OutputCard label="mF (millifarad)" value={formatNum(baseF * 1e3)} unit="mF" />
        <OutputCard label="F (Farad)" value={formatNum(baseF)} unit="F" />
        <OutputCard label="Mã tụ 3 số (EIA)" value={eiaCode} unit="" note="VD: 104 = 100nF" />
      </div>
    </div>
  )
}

/* 2. Resistance Converter */
function ResistanceConverter() {
  const [val, setVal] = useState<number>(4.7)
  const [unit, setUnit] = useState<'ohm' | 'kohm' | 'Mohm'>('kohm')

  const baseOhm = unit === 'ohm' ? val : unit === 'kohm' ? val * 1e3 : val * 1e6

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-[var(--color-muted)] font-medium block mb-1">
            <Bilingual en="Input value" vn="Giá trị nhập" />
          </label>
          <input
            type="number"
            value={isNaN(val) ? '' : val}
            onChange={e => setVal(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg px-3 py-2 text-base font-mono border border-[var(--color-border)] bg-[var(--color-bg)] focus:ring-2 focus:ring-[var(--color-acc)] focus:outline-none"
          />
        </div>
        <div className="w-28">
          <label className="text-xs text-[var(--color-muted)] font-medium block mb-1">
            <Bilingual en="Unit" vn="Đơn vị" />
          </label>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value as any)}
            className="w-full rounded-lg px-3 py-2 text-sm font-semibold border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="ohm">Ω (Ohm)</option>
            <option value="kohm">kΩ (Kilo)</option>
            <option value="Mohm">MΩ (Mega)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <OutputCard label="Ohm (Ω)" value={formatNum(baseOhm)} unit="Ω" />
        <OutputCard label="Kilohm (kΩ)" value={formatNum(baseOhm / 1e3)} unit="kΩ" highlight />
        <OutputCard label="Megohm (MΩ)" value={formatNum(baseOhm / 1e6)} unit="MΩ" highlight />
      </div>
    </div>
  )
}

/* 3. Frequency / Period Converter */
function FrequencyConverter() {
  const [freq, setFreq] = useState<number>(1)
  const [unit, setUnit] = useState<'Hz' | 'kHz' | 'MHz' | 'GHz'>('kHz')

  const baseHz = unit === 'Hz' ? freq : unit === 'kHz' ? freq * 1e3 : unit === 'MHz' ? freq * 1e6 : freq * 1e9
  const periodS = baseHz > 0 ? 1 / baseHz : 0

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-[var(--color-muted)] font-medium block mb-1">
            <Bilingual en="Frequency" vn="Tần số" />
          </label>
          <input
            type="number"
            value={isNaN(freq) ? '' : freq}
            onChange={e => setFreq(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg px-3 py-2 text-base font-mono border border-[var(--color-border)] bg-[var(--color-bg)] focus:ring-2 focus:ring-[var(--color-acc)] focus:outline-none"
          />
        </div>
        <div className="w-28">
          <label className="text-xs text-[var(--color-muted)] font-medium block mb-1">
            <Bilingual en="Unit" vn="Đơn vị" />
          </label>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value as any)}
            className="w-full rounded-lg px-3 py-2 text-sm font-semibold border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="Hz">Hz</option>
            <option value="kHz">kHz</option>
            <option value="MHz">MHz</option>
            <option value="GHz">GHz</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <OutputCard label="Hz" value={formatNum(baseHz)} unit="Hz" />
        <OutputCard label="kHz" value={formatNum(baseHz / 1e3)} unit="kHz" highlight />
        <OutputCard label="MHz" value={formatNum(baseHz / 1e6)} unit="MHz" />
        <OutputCard label="GHz" value={formatNum(baseHz / 1e9)} unit="GHz" />
      </div>

      <div className="pt-2 border-t border-[var(--color-border)]">
        <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">
          <Bilingual en="Corresponding Period (T = 1/f)" vn="Chu kỳ tương ứng (T = 1/f)" />
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <OutputCard label="Giây (s)" value={formatNum(periodS)} unit="s" />
          <OutputCard label="Mili-giây (ms)" value={formatNum(periodS * 1e3)} unit="ms" highlight />
          <OutputCard label="Micro-giây (µs)" value={formatNum(periodS * 1e6)} unit="µs" highlight />
          <OutputCard label="Nano-giây (ns)" value={formatNum(periodS * 1e9)} unit="ns" />
        </div>
      </div>
    </div>
  )
}

/* 4. Current Converter */
function CurrentConverter() {
  const [val, setVal] = useState<number>(20)
  const [unit, setUnit] = useState<'uA' | 'mA' | 'A'>('mA')

  const baseA = unit === 'uA' ? val * 1e-6 : unit === 'mA' ? val * 1e-3 : val

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-[var(--color-muted)] font-medium block mb-1">
            <Bilingual en="Current value" vn="Dòng điện" />
          </label>
          <input
            type="number"
            value={isNaN(val) ? '' : val}
            onChange={e => setVal(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg px-3 py-2 text-base font-mono border border-[var(--color-border)] bg-[var(--color-bg)] focus:ring-2 focus:ring-[var(--color-acc)] focus:outline-none"
          />
        </div>
        <div className="w-28">
          <label className="text-xs text-[var(--color-muted)] font-medium block mb-1">
            <Bilingual en="Unit" vn="Đơn vị" />
          </label>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value as any)}
            className="w-full rounded-lg px-3 py-2 text-sm font-semibold border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="uA">µA (micro)</option>
            <option value="mA">mA (milli)</option>
            <option value="A">A (Ampere)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <OutputCard label="Microampere (µA)" value={formatNum(baseA * 1e6)} unit="µA" />
        <OutputCard label="Milliampere (mA)" value={formatNum(baseA * 1e3)} unit="mA" highlight />
        <OutputCard label="Ampere (A)" value={formatNum(baseA)} unit="A" />
      </div>
    </div>
  )
}

/* 5. Wire Gauge (AWG) Table */
const AWG_DATA: Array<{ awg: number; diaMm: number; areaMm2: number; maxAmps: number; desc: string }> = [
  { awg: 10, diaMm: 2.588, areaMm2: 5.26, maxAmps: 30, desc: 'Nguồn lớn, pin mặt trời, sạc nhanh' },
  { awg: 12, diaMm: 2.053, areaMm2: 3.31, maxAmps: 20, desc: 'Dây nguồn AC 220V thiết bị công suất cao' },
  { awg: 14, diaMm: 1.628, areaMm2: 2.08, maxAmps: 15, desc: 'Dây ổ cắm dân dụng, motor DC lớn' },
  { awg: 16, diaMm: 1.291, areaMm2: 1.31, maxAmps: 10, desc: 'Dây loa, nguồn 12V quạt, đèn LED công suất' },
  { awg: 18, diaMm: 1.024, areaMm2: 0.823, maxAmps: 7, desc: 'Dây nguồn module, cầu H, relay' },
  { awg: 20, diaMm: 0.812, areaMm2: 0.518, maxAmps: 5, desc: 'Dây nguồn ESP32, Arduino, sensor xa' },
  { awg: 22, diaMm: 0.644, areaMm2: 0.326, maxAmps: 3, desc: 'Dây hookup breadboard, jumper' },
  { awg: 24, diaMm: 0.511, areaMm2: 0.205, maxAmps: 2, desc: 'Cáp mạng LAN CAT5/6, cảm biến' },
  { awg: 26, diaMm: 0.405, areaMm2: 0.129, maxAmps: 1.3, desc: 'Dây dẹt ribbon, cáp tín hiệu nhỏ' },
  { awg: 28, diaMm: 0.321, areaMm2: 0.081, maxAmps: 0.8, desc: 'Dây quấn biến áp nhỏ, dây test probe' },
  { awg: 30, diaMm: 0.255, areaMm2: 0.051, maxAmps: 0.5, desc: 'Dây câu mạch (wire-wrap, sửa PCB)' },
]

function AwgConverter() {
  const [selectedAwg, setSelectedAwg] = useState<number>(22)
  const item = AWG_DATA.find(x => x.awg === selectedAwg) || AWG_DATA[6]

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-[var(--color-muted)] font-medium block mb-1">
          <Bilingual en="Select American Wire Gauge (AWG)" vn="Chọn cỡ dây tiêu chuẩn Mỹ (AWG)" />
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {AWG_DATA.map(d => (
            <button
              key={d.awg}
              onClick={() => { haptic(5); setSelectedAwg(d.awg) }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition border ${
                selectedAwg === d.awg
                  ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-acc)]'
              }`}
            >
              AWG {d.awg}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <OutputCard label="Đường kính (Ø)" value={item.diaMm.toFixed(3)} unit="mm" highlight />
        <OutputCard label="Tiết diện dây" value={item.areaMm2.toFixed(3)} unit="mm²" highlight />
        <OutputCard label="Dòng an toàn tối đa" value={`${item.maxAmps}`} unit="A" highlight />
        <OutputCard label="Ứng dụng điển hình" value={item.desc} unit="" />
      </div>

      <div className="p-3 rounded-lg bg-[color-mix(in_srgb,var(--color-acc)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-acc)_20%,transparent)] text-xs text-[var(--color-muted)]">
        💡 <b>Mẹo nhớ:</b> Số AWG càng LỚN thì dây càng NHỎ. Cứ tăng 3 cỡ AWG thì tiết diện giảm 1 nửa. Dây breadboard cắm thường là AWG 22 (0.64mm).
      </div>
    </div>
  )
}

function OutputCard({ label, value, unit, highlight = false, note }: { label: string; value: string; unit: string; highlight?: boolean; note?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(value)
    haptic(10)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div
      onClick={copy}
      className={`p-3 rounded-xl border cursor-pointer group transition hover:border-[var(--color-acc)] relative ${
        highlight
          ? 'bg-[color-mix(in_srgb,var(--color-acc)_8%,transparent)] border-[color-mix(in_srgb,var(--color-acc)_25%,transparent)]'
          : 'bg-[var(--color-bg)] border-[var(--color-border)]'
      }`}
      title="Bấm để sao chép"
    >
      <div className="flex items-center justify-between text-[11px] text-[var(--color-muted)] mb-1">
        <span>{label}</span>
        <span className="opacity-0 group-hover:opacity-100 transition">
          {copied ? <Check className="size-3 text-[var(--color-ok)]" /> : <Copy className="size-3" />}
        </span>
      </div>
      <div className="font-mono font-bold text-base text-[var(--color-fg)] flex items-baseline gap-1 truncate">
        <span>{value}</span>
        {unit && <span className="text-xs font-normal text-[var(--color-muted)]">{unit}</span>}
      </div>
      {note && <div className="text-[10px] text-[var(--color-muted)] mt-0.5">{note}</div>}
    </div>
  )
}

function formatNum(n: number): string {
  if (n === 0) return '0'
  const abs = Math.abs(n)
  if (abs >= 1e6) return n.toExponential(3)
  if (abs >= 1) return (Math.round(n * 1000) / 1000).toLocaleString('en-US')
  if (abs >= 0.001) return (Math.round(n * 1e6) / 1e6).toString()
  return n.toExponential(3)
}
