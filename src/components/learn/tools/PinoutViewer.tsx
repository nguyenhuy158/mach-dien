import { useState, useMemo } from 'react'
import { Cpu, AlertTriangle, Info, Check, Search } from 'lucide-react'
import { useI18n, Bilingual } from '../../../i18n'
import { haptic } from '../../../utils/ux'

interface Pin {
  pin: number // physical pin 1..N
  label: string // e.g. "GPIO34" or "D13"
  name?: string // extra alias e.g. "ADC1_CH6"
  type: 'pwr' | 'gnd' | 'io' | 'input-only'
  capabilities: Array<'adc' | 'dac' | 'pwm' | 'i2c' | 'spi' | 'uart' | 'touch' | 'boot'>
  voltage: '3.3V' | '5V'
  warning?: string
  side: 'L' | 'R'
}

interface Board {
  id: string
  name: string
  mcu: string
  voltage: string
  clock: string
  flash: string
  pins: Pin[]
  notes: string[]
}

const BOARDS: Board[] = [
  {
    id: 'esp32',
    name: 'ESP32 DevKit V1 (30 chân)',
    mcu: 'Xtensa Dual-Core 32-bit LX6',
    voltage: '3.3V Logic (KHÔNG chịu 5V)',
    clock: '240 MHz',
    flash: '4 MB',
    notes: [
      'ADC2 (GPIO 0, 2, 4, 12-15, 25-27) KHÔNG thể dùng khi bật WiFi! Luôn ưu tiên ADC1 (GPIO 32-39).',
      'GPIO 34, 35, 36, 39 là INPUT-ONLY (không có pull-up/pull-down nội, không xuất output được).',
      'GPIO 6-11 nối sẵn chip Flash SPI nội — CẤM dùng làm chân I/O bên ngoài.',
      'Strapping pins quyết định chế độ boot: GPIO 0, 2, 12, 15 (tránh treo pull-down/pull-up cứng).',
    ],
    pins: [
      // Left side (1..15)
      { pin: 1, label: 'EN', name: 'Reset (Active-Low)', type: 'io', capabilities: [], voltage: '3.3V', side: 'L' },
      { pin: 2, label: 'GPIO36', name: 'VP / ADC1_CH0', type: 'input-only', capabilities: ['adc'], voltage: '3.3V', warning: 'Input only', side: 'L' },
      { pin: 3, label: 'GPIO39', name: 'VN / ADC1_CH3', type: 'input-only', capabilities: ['adc'], voltage: '3.3V', warning: 'Input only', side: 'L' },
      { pin: 4, label: 'GPIO34', name: 'ADC1_CH6', type: 'input-only', capabilities: ['adc'], voltage: '3.3V', warning: 'Input only', side: 'L' },
      { pin: 5, label: 'GPIO35', name: 'ADC1_CH7', type: 'input-only', capabilities: ['adc'], voltage: '3.3V', warning: 'Input only', side: 'L' },
      { pin: 6, label: 'GPIO32', name: 'ADC1_CH4 / Touch9', type: 'io', capabilities: ['adc', 'pwm', 'touch'], voltage: '3.3V', side: 'L' },
      { pin: 7, label: 'GPIO33', name: 'ADC1_CH5 / Touch8', type: 'io', capabilities: ['adc', 'pwm', 'touch'], voltage: '3.3V', side: 'L' },
      { pin: 8, label: 'GPIO25', name: 'DAC1 / ADC2_CH8', type: 'io', capabilities: ['dac', 'adc', 'pwm'], voltage: '3.3V', side: 'L' },
      { pin: 9, label: 'GPIO26', name: 'DAC2 / ADC2_CH9', type: 'io', capabilities: ['dac', 'adc', 'pwm'], voltage: '3.3V', side: 'L' },
      { pin: 10, label: 'GPIO27', name: 'ADC2_CH7 / Touch7', type: 'io', capabilities: ['adc', 'pwm', 'touch'], voltage: '3.3V', side: 'L' },
      { pin: 11, label: 'GPIO14', name: 'HSPI_CLK / Touch6', type: 'io', capabilities: ['spi', 'pwm', 'touch'], voltage: '3.3V', side: 'L' },
      { pin: 12, label: 'GPIO12', name: 'HSPI_MISO / Touch5', type: 'io', capabilities: ['spi', 'pwm', 'touch', 'boot'], voltage: '3.3V', warning: 'Strapping pin (MTDI)', side: 'L' },
      { pin: 13, label: 'GPIO13', name: 'HSPI_MOSI / Touch4', type: 'io', capabilities: ['spi', 'pwm', 'touch'], voltage: '3.3V', side: 'L' },
      { pin: 14, label: 'GND', name: 'Ground', type: 'gnd', capabilities: [], voltage: '3.3V', side: 'L' },
      { pin: 15, label: 'VIN', name: 'Nguồn vào 5V (từ USB)', type: 'pwr', capabilities: [], voltage: '5V', side: 'L' },

      // Right side (16..30)
      { pin: 30, label: 'GPIO23', name: 'VSPI_MOSI', type: 'io', capabilities: ['spi', 'pwm'], voltage: '3.3V', side: 'R' },
      { pin: 29, label: 'GPIO22', name: 'I2C_SCL (mặc định)', type: 'io', capabilities: ['i2c', 'pwm'], voltage: '3.3V', side: 'R' },
      { pin: 28, label: 'GPIO1', name: 'UART0_TX (Serial Debug)', type: 'io', capabilities: ['uart'], voltage: '3.3V', warning: 'Serial TX (in log)', side: 'R' },
      { pin: 27, label: 'GPIO3', name: 'UART0_RX (Serial Debug)', type: 'io', capabilities: ['uart'], voltage: '3.3V', warning: 'Serial RX (nạp code)', side: 'R' },
      { pin: 26, label: 'GPIO21', name: 'I2C_SDA (mặc định)', type: 'io', capabilities: ['i2c', 'pwm'], voltage: '3.3V', side: 'R' },
      { pin: 25, label: 'GND', name: 'Ground', type: 'gnd', capabilities: [], voltage: '3.3V', side: 'R' },
      { pin: 24, label: 'GPIO19', name: 'VSPI_MISO', type: 'io', capabilities: ['spi', 'pwm'], voltage: '3.3V', side: 'R' },
      { pin: 23, label: 'GPIO18', name: 'VSPI_CLK', type: 'io', capabilities: ['spi', 'pwm'], voltage: '3.3V', side: 'R' },
      { pin: 22, label: 'GPIO5', name: 'VSPI_CS', type: 'io', capabilities: ['spi', 'pwm', 'boot'], voltage: '3.3V', warning: 'Strapping pin', side: 'R' },
      { pin: 21, label: 'GPIO17', name: 'UART2_TX', type: 'io', capabilities: ['uart', 'pwm'], voltage: '3.3V', side: 'R' },
      { pin: 20, label: 'GPIO16', name: 'UART2_RX', type: 'io', capabilities: ['uart', 'pwm'], voltage: '3.3V', side: 'R' },
      { pin: 19, label: 'GPIO4', name: 'ADC2_CH0 / Touch0', type: 'io', capabilities: ['adc', 'pwm', 'touch'], voltage: '3.3V', side: 'R' },
      { pin: 18, label: 'GPIO0', name: 'Boot switch / Touch1', type: 'io', capabilities: ['boot', 'touch'], voltage: '3.3V', warning: 'Kéo LOW để vào bootloader', side: 'R' },
      { pin: 17, label: 'GPIO2', name: 'LED onboard / Touch2', type: 'io', capabilities: ['boot', 'touch', 'pwm'], voltage: '3.3V', warning: 'Nối sẵn LED xanh onboard', side: 'R' },
      { pin: 16, label: 'GPIO15', name: 'HSPI_CS / Touch3', type: 'io', capabilities: ['spi', 'touch', 'boot'], voltage: '3.3V', warning: 'Strapping pin', side: 'R' },
    ],
  },
  {
    id: 'nano',
    name: 'Arduino Nano (ATmega328P)',
    mcu: 'ATmega328P 8-bit AVR',
    voltage: '5V Logic (chịu được 5V)',
    clock: '16 MHz',
    flash: '32 KB',
    notes: [
      'Chân PWM phần cứng: D3, D5, D6, D9, D10, D11 (~490Hz hoặc 980Hz).',
      'I2C phần cứng cố định tại A4 (SDA) và A5 (SCL).',
      'SPI phần cứng: D10 (SS), D11 (MOSI), D12 (MISO), D13 (SCK). Chân D13 nối LED onboard.',
      'A6 và A7 là ANALOG-INPUT ONLY (không dùng làm chân Digital I/O được).',
    ],
    pins: [
      { pin: 1, label: 'TX (D1)', name: 'Serial TX', type: 'io', capabilities: ['uart'], voltage: '5V', side: 'L' },
      { pin: 2, label: 'RX (D0)', name: 'Serial RX', type: 'io', capabilities: ['uart'], voltage: '5V', side: 'L' },
      { pin: 3, label: 'RESET', name: 'Reset', type: 'io', capabilities: [], voltage: '5V', side: 'L' },
      { pin: 4, label: 'GND', name: 'Ground', type: 'gnd', capabilities: [], voltage: '5V', side: 'L' },
      { pin: 5, label: 'D2', name: 'External Interrupt 0', type: 'io', capabilities: [], voltage: '5V', side: 'L' },
      { pin: 6, label: 'D3', name: 'PWM / Ext Interrupt 1', type: 'io', capabilities: ['pwm'], voltage: '5V', side: 'L' },
      { pin: 7, label: 'D4', name: 'GPIO', type: 'io', capabilities: [], voltage: '5V', side: 'L' },
      { pin: 8, label: 'D5', name: 'PWM', type: 'io', capabilities: ['pwm'], voltage: '5V', side: 'L' },
      { pin: 9, label: 'D6', name: 'PWM', type: 'io', capabilities: ['pwm'], voltage: '5V', side: 'L' },
      { pin: 10, label: 'D7', name: 'GPIO', type: 'io', capabilities: [], voltage: '5V', side: 'L' },
      { pin: 11, label: 'D8', name: 'GPIO', type: 'io', capabilities: [], voltage: '5V', side: 'L' },
      { pin: 12, label: 'D9', name: 'PWM', type: 'io', capabilities: ['pwm'], voltage: '5V', side: 'L' },
      { pin: 13, label: 'D10', name: 'PWM / SPI_SS', type: 'io', capabilities: ['pwm', 'spi'], voltage: '5V', side: 'L' },
      { pin: 14, label: 'D11', name: 'PWM / SPI_MOSI', type: 'io', capabilities: ['pwm', 'spi'], voltage: '5V', side: 'L' },
      { pin: 15, label: 'D12', name: 'SPI_MISO', type: 'io', capabilities: ['spi'], voltage: '5V', side: 'L' },

      { pin: 30, label: 'VIN', name: 'Nguồn ngoài 7-12V', type: 'pwr', capabilities: [], voltage: '5V', side: 'R' },
      { pin: 29, label: 'GND', name: 'Ground', type: 'gnd', capabilities: [], voltage: '5V', side: 'R' },
      { pin: 28, label: 'RESET', name: 'Reset', type: 'io', capabilities: [], voltage: '5V', side: 'R' },
      { pin: 27, label: '5V', name: '5V Output', type: 'pwr', capabilities: [], voltage: '5V', side: 'R' },
      { pin: 26, label: 'A7', name: 'ADC7 (Input Only)', type: 'input-only', capabilities: ['adc'], voltage: '5V', warning: 'Analog only', side: 'R' },
      { pin: 25, label: 'A6', name: 'ADC6 (Input Only)', type: 'input-only', capabilities: ['adc'], voltage: '5V', warning: 'Analog only', side: 'R' },
      { pin: 24, label: 'A5', name: 'ADC5 / I2C_SCL', type: 'io', capabilities: ['adc', 'i2c'], voltage: '5V', side: 'R' },
      { pin: 23, label: 'A4', name: 'ADC4 / I2C_SDA', type: 'io', capabilities: ['adc', 'i2c'], voltage: '5V', side: 'R' },
      { pin: 22, label: 'A3', name: 'ADC3', type: 'io', capabilities: ['adc'], voltage: '5V', side: 'R' },
      { pin: 21, label: 'A2', name: 'ADC2', type: 'io', capabilities: ['adc'], voltage: '5V', side: 'R' },
      { pin: 20, label: 'A1', name: 'ADC1', type: 'io', capabilities: ['adc'], voltage: '5V', side: 'R' },
      { pin: 19, label: 'A0', name: 'ADC0', type: 'io', capabilities: ['adc'], voltage: '5V', side: 'R' },
      { pin: 18, label: 'AREF', name: 'Analog Reference', type: 'io', capabilities: [], voltage: '5V', side: 'R' },
      { pin: 17, label: '3V3', name: '3.3V Output (max 50mA)', type: 'pwr', capabilities: [], voltage: '3.3V', side: 'R' },
      { pin: 16, label: 'D13', name: 'SPI_SCK / LED onboard', type: 'io', capabilities: ['spi'], voltage: '5V', side: 'R' },
    ],
  },
]

type CapFilter = 'all' | 'adc' | 'pwm' | 'i2c' | 'spi' | 'uart' | 'touch' | 'boot'

export function PinoutViewer() {
  const [boardId, setBoardId] = useState<'esp32' | 'nano'>('esp32')
  const [filter, setFilter] = useState<CapFilter>('all')
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [query, setQuery] = useState('')

  const board = useMemo(() => BOARDS.find(b => b.id === boardId) || BOARDS[0], [boardId])

  const leftPins = board.pins.filter(p => p.side === 'L')
  const rightPins = board.pins.filter(p => p.side === 'R')

  const isHighlighted = (p: Pin) => {
    if (filter !== 'all' && !p.capabilities.includes(filter)) return false
    if (query) {
      const q = query.toLowerCase()
      if (!p.label.toLowerCase().includes(q) && !(p.name && p.name.toLowerCase().includes(q))) return false
    }
    return true
  }

  return (
    <div className="card p-5 bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-2">
          <Cpu className="size-5 text-[var(--color-acc)]" />
          <h3 className="text-lg font-bold tracking-tight">
            <Bilingual en="MCU Pinout Reference" vn="Sơ đồ chân Vi điều khiển" />
          </h3>
        </div>

        {/* Board switcher */}
        <div className="flex gap-1 bg-[var(--color-bg)] p-1 rounded-lg border border-[var(--color-border)]">
          {BOARDS.map(b => (
            <button
              key={b.id}
              onClick={() => { haptic(5); setBoardId(b.id as any); setSelectedPin(null) }}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                boardId === b.id
                  ? 'bg-[var(--color-acc)] text-[var(--color-bg)] shadow-sm'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]'
              }`}
            >
              {b.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Board specs bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs bg-[var(--color-bg)] p-2.5 rounded-lg border border-[var(--color-border)]">
        <div><span className="text-[var(--color-muted)]">MCU:</span> <b>{board.mcu}</b></div>
        <div><span className="text-[var(--color-muted)]">Logic:</span> <b className="text-[var(--color-acc)]">{board.voltage}</b></div>
        <div><span className="text-[var(--color-muted)]">Clock:</span> <b>{board.clock}</b></div>
        <div><span className="text-[var(--color-muted)]">Flash:</span> <b>{board.flash}</b></div>
      </div>

      {/* Filter by capability */}
      <div className="flex gap-1.5 mb-4 flex-wrap items-center">
        <span className="text-xs text-[var(--color-muted)] font-medium mr-1">Lọc chân:</span>
        <CapPill label="Tất cả" active={filter === 'all'} onClick={() => setFilter('all')} />
        <CapPill label="ADC (Analog)" color="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40" active={filter === 'adc'} onClick={() => setFilter('adc')} />
        <CapPill label="PWM" color="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40" active={filter === 'pwm'} onClick={() => setFilter('pwm')} />
        <CapPill label="I²C" color="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40" active={filter === 'i2c'} onClick={() => setFilter('i2c')} />
        <CapPill label="SPI" color="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/40" active={filter === 'spi'} onClick={() => setFilter('spi')} />
        <CapPill label="UART" color="bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40" active={filter === 'uart'} onClick={() => setFilter('uart')} />
      </div>

      {/* Interactive Pinout Dual-Side View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* Left Side */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase px-2 mb-1">Cột chân trái (Left Pins)</div>
          {leftPins.map(p => (
            <PinRow
              key={p.pin}
              pin={p}
              highlight={isHighlighted(p)}
              selected={selectedPin?.pin === p.pin}
              onSelect={() => { haptic(5); setSelectedPin(p) }}
            />
          ))}
        </div>

        {/* Right Side */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase px-2 mb-1">Cột chân phải (Right Pins)</div>
          {rightPins.map(p => (
            <PinRow
              key={p.pin}
              pin={p}
              highlight={isHighlighted(p)}
              selected={selectedPin?.pin === p.pin}
              onSelect={() => { haptic(5); setSelectedPin(p) }}
            />
          ))}
        </div>
      </div>

      {/* Selected Pin Details Card */}
      {selectedPin && (
        <div className="p-3.5 rounded-xl border-2 border-[var(--color-acc)] bg-[color-mix(in_srgb,var(--color-acc)_6%,transparent)] mb-3 fade-in">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-[var(--color-acc)]">{selectedPin.label}</span>
                <span className="text-xs text-[var(--color-muted)]">(Chân vật lý #{selectedPin.pin})</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-border)] uppercase">{selectedPin.voltage}</span>
              </div>
              <div className="text-xs font-medium text-[var(--color-fg)] mt-0.5">{selectedPin.name || 'Chân I/O thông thường'}</div>
            </div>
            <button
              onClick={() => setSelectedPin(null)}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] px-2 py-1 rounded"
            >
              Đóng
            </button>
          </div>

          {selectedPin.warning && (
            <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="size-3.5 shrink-0" />
              <span>{selectedPin.warning}</span>
            </div>
          )}

          {selectedPin.capabilities.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {selectedPin.capabilities.map(cap => (
                <span key={cap} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] uppercase">
                  {cap}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Board Traps & Warnings */}
      <div className="space-y-1.5 pt-3 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
        <h4 className="font-semibold text-[var(--color-fg)] flex items-center gap-1.5 text-xs">
          <AlertTriangle className="size-3.5 text-amber-500" />
          <span>Lưu ý sống còn khi dùng board {board.name.split(' (')[0]}:</span>
        </h4>
        {board.notes.map((n, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-amber-500 font-bold">•</span>
            <span>{n}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CapPill({ label, active, onClick, color = '' }: { label: string; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={() => { haptic(5); onClick() }}
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition ${
        active
          ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
          : color ? color : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-acc)]'
      }`}
    >
      {label}
    </button>
  )
}

function PinRow({ pin, highlight, selected, onSelect }: { pin: Pin; highlight: boolean; selected: boolean; onSelect: () => void }) {
  const isPwr = pin.type === 'pwr'
  const isGnd = pin.type === 'gnd'
  const isWarn = !!pin.warning

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between border transition ${
        selected
          ? 'bg-[color-mix(in_srgb,var(--color-acc)_20%,transparent)] border-[var(--color-acc)] shadow-sm'
          : highlight
          ? 'bg-[var(--color-bg)] border-[var(--color-border)] hover:border-[var(--color-acc)]'
          : 'opacity-30 border-transparent bg-transparent hover:opacity-80'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-5 text-center text-[10px] text-[var(--color-muted)] font-normal">{pin.pin}</span>
        <span className={`font-bold truncate ${
          isPwr ? 'text-rose-500' : isGnd ? 'text-slate-500' : isWarn ? 'text-amber-500' : 'text-[var(--color-fg)]'
        }`}>
          {pin.label}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] shrink-0">
        {pin.name && <span className="text-[var(--color-muted)] truncate max-w-[120px]">{pin.name.split(' / ')[0]}</span>}
        {pin.capabilities.slice(0, 2).map(c => (
          <span key={c} className="px-1 rounded bg-[var(--color-border)] text-[9px] uppercase font-sans font-semibold">
            {c}
          </span>
        ))}
      </div>
    </button>
  )
}
