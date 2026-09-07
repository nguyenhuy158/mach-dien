import type { Component } from '../../data/learn'

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
        <div className="size-16 rounded-lg bg-[var(--color-card)] ring-1 ring-[var(--color-border)] flex items-center justify-center shrink-0">
          <SchematicGlyph kind={c.schematic} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold tracking-tight">{c.name}</h3>
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mt-0.5">
            <span className="font-mono">ký hiệu: {c.symbol}</span>
            <span>·</span>
            <span>{c.category}</span>
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

      <p className="text-sm text-[var(--color-fg)] leading-relaxed mb-3">{c.description}</p>

      <table className="w-full text-sm mb-3">
        <tbody>
          {c.specs.map(([k, v], i) => (
            <tr key={i} className="border-t border-[var(--color-border)]">
              <td className="py-1.5 pr-3 text-[var(--color-muted)] text-xs w-32">{k}</td>
              <td className="py-1.5 text-sm">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {c.applications.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">Ứng dụng</h4>
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
            <span className="text-sm">{c.notes}</span>
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

function SchematicGlyph({ kind }: { kind: string }) {
  // Tiny inline SVG glyphs for schematic symbols
  switch (kind) {
    case 'resistor':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20">
          <line x1="0" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 12 L14 4 L22 20 L30 4 L38 20 L46 4 L50 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'capacitor':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20">
          <line x1="0" y1="12" x2="26" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="26" y1="4" x2="26" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="34" y1="4" x2="34" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="34" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'inductor':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20">
          <line x1="0" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 12 Q12 4, 18 4 Q24 4, 24 12 Q24 4, 30 4 Q36 4, 36 12 Q36 4, 42 4 Q48 4, 48 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="48" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'diode':
    case 'zener':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20">
          <line x1="0" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="4" x2="22" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="4" x2="30" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="12" x2="22" y2="4" stroke="currentColor" strokeWidth="1.5" />
          <line x1="30" y1="12" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="30" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="6" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'led':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20">
          <line x1="0" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="4" x2="22" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="4" x2="30" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="12" x2="22" y2="4" stroke="currentColor" strokeWidth="1.5" />
          <line x1="30" y1="12" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="30" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="34" y1="6" x2="44" y2="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="36" y1="10" x2="46" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="38" y1="14" x2="48" y2="10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'npn':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20">
          <circle cx="30" cy="12" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="12" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="12" x2="38" y2="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="6" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'mosfet-n':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20">
          <line x1="0" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="4" x2="22" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="26" y1="4" x2="26" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="26" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="6" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'relay':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20">
          <rect x="8" y="6" width="20" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="6" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="18" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="28" y1="4" x2="36" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="36" y1="6" x2="50" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'opamp':
    case 'ic-555':
    case 'ic-rect':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20">
          <polygon points="6,4 6,20 36,12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="16" x2="6" y2="16" stroke="currentColor" strokeWidth="1.5" />
          <line x1="36" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 60 24" width="50" height="20">
          <rect x="20" y="4" width="20" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
  }
}
