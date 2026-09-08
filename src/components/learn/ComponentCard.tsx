import type { Component } from '../../data/learn'
import { SchematicGlyph } from './SchematicGlyph'
import { Bilingual, useI18n } from '../../i18n'

interface Props {
  c: Component
  bookmarked: boolean
  onToggleBookmark: () => void
}

export function ComponentCard({ c, bookmarked, onToggleBookmark }: Props) {
  return (
    <article
      id={`cmp-${c.id}`}
      data-s={c.name.toLowerCase()}
      className="card p-5 bg-[var(--color-card)] border border-[var(--color-border)]"
    >
      <header className="flex items-start gap-3 mb-3">
        <div className="size-16 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center shrink-0 text-[var(--color-acc)] shadow-sm">
          <SchematicGlyph kind={c.schematic} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold tracking-tight">
            <Bilingual en={c.enName || c.name} vn={c.name} />
          </h3>
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mt-0.5">
            <span className="font-mono">sym: {c.symbol}</span>
            <span>·</span>
            <span><Bilingual en={c.enCategory || c.category} vn={c.category} /></span>
          </div>
        </div>
        <button
          onClick={onToggleBookmark}
          className={`size-9 rounded-full border flex items-center justify-center transition ${
            bookmarked
              ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
              : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-acc)]'
          }`}
          title={bookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu đã học'}
        >
          <BookmarkIcon filled={bookmarked} />
        </button>
      </header>

      <p className="text-sm text-[var(--color-fg)] leading-relaxed mb-3">
        <Bilingual en={c.enDescription || c.description} vn={c.description} />
      </p>

      <table className="w-full text-sm mb-3">
        <tbody>
          {c.specs.map((spec, i) => (
            <tr key={i} className="border-t border-[var(--color-border)]">
              <td className="py-1.5 pr-3 text-[var(--color-muted)] text-xs w-32">
                <Bilingual en={spec[2] || spec[0]} vn={spec[0]} />
              </td>
              <td className="py-1.5 text-sm">
                <Bilingual en={spec[3] || spec[1]} vn={spec[1]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {c.applications.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            <Bilingual en="Applications" vn="Ứng dụng" />
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {c.applications.map((a, i) => (
              <span key={i} className="text-xs bg-[color-mix(in_srgb,var(--color-acc)_12%,transparent)] text-[var(--color-acc)] rounded-full px-2.5 py-0.5">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {c.notes && (
        <div className="warn">
          <div className="flex gap-2">
            <span className="font-bold shrink-0">💡</span>
            <span className="text-sm">
              <Bilingual en={c.enNotes || c.notes} vn={c.notes} />
            </span>
          </div>
        </div>
      )}
    </article>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

