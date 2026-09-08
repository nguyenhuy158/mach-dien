import { useState, useRef, useEffect } from 'react'
import { Plus, Minus } from 'lucide-react'
import { haptic } from '../../../utils/ux'

interface Props {
  label: string
  value: number
  setValue: (v: number) => void
  step?: number
  min?: number
  max?: number
  unit?: string
  className?: string
}

export function NumInput({
  label,
  value,
  setValue,
  step = 1,
  min,
  max,
  unit,
  className = '',
}: Props) {
  // Local string to allow user to type decimals/minus freely without jumping
  const [text, setText] = useState(value.toString())
  const timerRef = useRef<any>(null)

  useEffect(() => {
    setText(value.toString())
  }, [value])

  const clamp = (v: number) => {
    let res = v
    if (min !== undefined) res = Math.max(min, res)
    if (max !== undefined) res = Math.min(max, res)
    // Round to avoid floating point precision issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
    const decimals = step.toString().split('.')[1]?.length || 0
    return parseFloat(res.toFixed(Math.max(decimals, 4)))
  }

  const handleStep = (delta: number) => {
    haptic(5)
    setValue(clamp(value + delta))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value
    setText(valStr)
    const num = parseFloat(valStr)
    if (!isNaN(num)) {
      setValue(clamp(num))
    }
  }

  const handleBlur = () => {
    const num = parseFloat(text)
    if (isNaN(num)) {
      setText(value.toString())
    } else {
      const clamped = clamp(num)
      setText(clamped.toString())
      setValue(clamped)
    }
  }

  // Keyboard Up/Down arrows inside input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      handleStep(step)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleStep(-step)
    }
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between text-xs text-[var(--color-muted)] font-medium px-0.5">
        <span>{label}</span>
        {unit && <span className="text-[10px] font-mono opacity-70">{unit}</span>}
      </div>

      <div className="flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] transition shadow-2xs focus-within:border-[var(--color-acc)] focus-within:ring-2 focus-within:ring-[color-mix(in_srgb,var(--color-acc)_25%,transparent)] overflow-hidden">
        {/* Decrement button */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => handleStep(-step)}
          disabled={min !== undefined && value <= min}
          className="size-8 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:bg-[color-mix(in_srgb,var(--color-acc)_10%,transparent)] active:scale-95 disabled:opacity-20 transition shrink-0 border-r border-[var(--color-border)]"
          aria-label="Decrease"
        >
          <Minus className="size-3.5" />
        </button>

        {/* Clean, spinner-free Number Input */}
        <input
          type="text"
          inputMode="decimal"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 py-1.5 px-2 text-center text-sm font-mono font-bold text-[var(--color-fg)] bg-transparent focus:outline-none"
        />

        {/* Increment button */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => handleStep(step)}
          disabled={max !== undefined && value >= max}
          className="size-8 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:bg-[color-mix(in_srgb,var(--color-acc)_10%,transparent)] active:scale-95 disabled:opacity-20 transition shrink-0 border-l border-[var(--color-border)]"
          aria-label="Increase"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
