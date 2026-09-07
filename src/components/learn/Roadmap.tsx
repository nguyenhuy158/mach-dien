import { COMPONENTS, FORMULAS, GLOSSARY } from '../../data/learn'

interface Props {
  bookmarked: { components: Set<string>; formulas: Set<string>; glossary: Set<string> }
}

export function Roadmap({ bookmarked }: Props) {
  const total = COMPONENTS.length + FORMULAS.length + GLOSSARY.length
  const done = bookmarked.components.size + bookmarked.formulas.size + bookmarked.glossary.size
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const items = [
    { label: 'Linh kiện', done: bookmarked.components.size, total: COMPONENTS.length, color: 'var(--color-b1)' },
    { label: 'Công thức', done: bookmarked.formulas.size, total: FORMULAS.length, color: 'var(--color-b2)' },
    { label: 'Thuật ngữ', done: bookmarked.glossary.size, total: GLOSSARY.length, color: 'var(--color-b3)' },
  ]

  return (
    <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Tiến độ học</h3>
        <span className="text-xs text-[var(--color-muted)] font-mono">{done}/{total}</span>
      </div>

      <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden mb-3">
        <div
          className="h-full bg-[var(--color-acc)] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="text-center mb-3">
        <span className="text-3xl font-bold tracking-tight text-[var(--color-acc)]">{pct}%</span>
      </div>

      <div className="space-y-2">
        {items.map(it => {
          const p = it.total > 0 ? Math.round((it.done / it.total) * 100) : 0
          return (
            <div key={it.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span>{it.label}</span>
                <span className="text-[var(--color-muted)] font-mono">{it.done}/{it.total}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${p}%`, background: it.color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {pct === 100 && (
        <div className="mt-3 p-2 rounded-lg bg-[color-mix(in_srgb,var(--color-ok)_15%,transparent)] border border-[color-mix(in_srgb,var(--color-ok)_30%,transparent)] text-center">
          <span className="text-sm font-semibold text-[var(--color-ok)]">🎉 Hoàn thành!</span>
        </div>
      )}
    </div>
  )
}
