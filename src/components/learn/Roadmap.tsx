import { COMPONENTS, FORMULAS, GLOSSARY } from '../../data/learn'
import { useI18n, Bilingual } from '../../i18n'

interface Props {
  bookmarked: { components: Set<string>; formulas: Set<string>; glossary: Set<string> }
}

export function Roadmap({ bookmarked }: Props) {
  const { mode, T, tvn } = useI18n()
  const total = COMPONENTS.length + FORMULAS.length + GLOSSARY.length
  const done = bookmarked.components.size + bookmarked.formulas.size + bookmarked.glossary.size
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const items = [
    { en: 'Components', vn: 'Linh kiện', done: bookmarked.components.size, total: COMPONENTS.length, color: 'var(--color-b1)' },
    { en: 'Formulas', vn: 'Công thức', done: bookmarked.formulas.size, total: FORMULAS.length, color: 'var(--color-b2)' },
    { en: 'Glossary', vn: 'Thuật ngữ', done: bookmarked.glossary.size, total: GLOSSARY.length, color: 'var(--color-b3)' },
  ]

  return (
    <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">
          <Bilingual en={T.learnProgress} vn={tvn.learnProgress} />
        </h3>
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
            <div key={it.en}>
              <div className="flex items-center justify-between text-xs mb-1">
                <Bilingual en={it.en} vn={it.vn} as="span" />
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
          <span className="text-sm font-semibold text-[var(--color-ok)]">
            <Bilingual en={T.learnComplete} vn={tvn.learnComplete} />
          </span>
        </div>
      )}
    </div>
  )
}
