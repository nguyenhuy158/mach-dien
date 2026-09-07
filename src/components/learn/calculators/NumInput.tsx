interface Props {
  label: string
  value: number
  setValue: (v: number) => void
  step?: number
}

export function NumInput({ label, value, setValue, step = 1 }: Props) {
  return (
    <div>
      <div className="text-xs text-[var(--color-muted)] mb-0.5">{label}</div>
      <input
        type="number"
        value={value}
        step={step}
        onChange={e => setValue(parseFloat(e.target.value) || 0)}
        className="w-full rounded-lg px-2 py-1.5 text-sm border border-[var(--color-border)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-acc)_35%,transparent)] focus:outline-none bg-transparent font-mono"
      />
    </div>
  )
}
