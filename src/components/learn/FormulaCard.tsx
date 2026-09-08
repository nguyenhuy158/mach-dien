import type { Formula } from '../../data/learn'
import { CalculatorPanel } from './calculators/CalculatorPanel'
import { Bilingual } from '../../i18n'

interface Props {
  f: Formula
  bookmarked: boolean
  onToggleBookmark: () => void
}

export function FormulaCard({ f, bookmarked, onToggleBookmark }: Props) {
  return (
    <article
      id={`fml-${f.id}`}
      data-s={f.name.toLowerCase()}
      className="card p-5 bg-[var(--color-card)] border border-[var(--color-border)]"
    >
      <header className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{f.category}</span>
          </div>
          <h3 className="text-lg font-bold tracking-tight"><Bilingual en={f.enName || f.name} vn={f.name} /></h3>
        </div>
        <button
          onClick={onToggleBookmark}
          className={`size-9 rounded-full border flex items-center justify-center transition shrink-0 ${
            bookmarked
              ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
              : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-acc)]'
          }`}
          title={bookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu đã học'}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </header>

      <div className="bg-[color-mix(in_srgb,var(--color-acc)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-acc)_25%,transparent)] rounded-xl px-4 py-3 mb-3">
        <code className="text-base font-mono font-semibold">{f.expression}</code>
      </div>

      <table className="w-full text-sm mb-3">
        <tbody>
          {f.variables.map(([sym, desc], i) => (
            <tr key={i} className="border-t border-[var(--color-border)]">
              <td className="py-1.5 pr-3 font-mono font-semibold text-[var(--color-acc)] text-sm w-16">{sym}</td>
              <td className="py-1.5 text-sm text-[var(--color-fg)]">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-sm text-[var(--color-fg)] leading-relaxed mb-3"><Bilingual en={f.enDescription || f.description} vn={f.description} /></p>

      {f.notes && (
        <div className="fm mb-3">
          <div className="flex gap-2">
            <span className="font-bold shrink-0">📝</span>
            <span className="text-sm"><Bilingual en={f.enNotes || f.notes} vn={f.notes} /></span>
          </div>
        </div>
      )}

      {f.calculator && <CalculatorPanel kind={f.calculator} />}
    </article>
  )
}
