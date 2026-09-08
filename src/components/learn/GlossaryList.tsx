import { useState, useMemo } from 'react'
import type { GlossaryTerm } from '../../data/learn'
import { CATEGORIES } from '../../data/learn'
import { Bilingual } from '../../i18n'

interface Props {
  terms: GlossaryTerm[]
  bookmarked: Set<string>
  onToggleBookmark: (term: string) => void
}

export function GlossaryList({ terms, bookmarked, onToggleBookmark }: Props) {
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<string>('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return terms.filter(t => {
      if (activeCat !== 'all' && t.category !== activeCat) return false
      if (q && !(t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))) return false
      return true
    })
  }, [terms, query, activeCat])

  // Group by first letter
  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>()
    filtered.forEach(t => {
      const k = (t.term[0] || '#').toUpperCase()
      const arr = map.get(k) || []
      arr.push(t)
      map.set(k, arr)
    })
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <FilterPill active={activeCat === 'all'} onClick={() => setActiveCat('all')}>
          Tất cả ({terms.length})
        </FilterPill>
        {CATEGORIES.glossary.map(cat => {
          const count = terms.filter(t => t.category === cat).length
          return (
            <FilterPill key={cat} active={activeCat === cat} onClick={() => setActiveCat(cat)}>
              {cat} ({count})
            </FilterPill>
          )
        })}
      </div>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Tìm thuật ngữ hoặc định nghĩa…"
        className="w-full mb-4 rounded-full px-4 py-2 text-sm border border-[var(--color-border)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-acc)_35%,transparent)] focus:outline-none bg-transparent"
      />

      {grouped.length === 0 && (
        <div className="text-center py-12 text-[var(--color-muted)]">Không tìm thấy thuật ngữ nào.</div>
      )}

      {grouped.map(([letter, items]) => (
        <section key={letter} className="mb-6">
          <h3 className="text-2xl font-display font-bold text-[var(--color-acc)] mb-2 sticky top-[68px] bg-[var(--color-bg)] py-1 z-10">{letter}</h3>
          <dl className="space-y-2">
            {items.map((t, i) => {
              const isBookmarked = bookmarked.has(t.term)
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-acc)] transition"
                >
                  <button
                    onClick={() => onToggleBookmark(t.term)}
                    className={`size-7 rounded-md border flex items-center justify-center shrink-0 transition ${
                      isBookmarked
                        ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
                        : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-acc)]'
                    }`}
                    title={isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <dt className="font-mono font-bold text-sm text-[var(--color-fg)]">
                        <Bilingual en={t.enTerm || t.term} vn={t.term} />
                      </dt>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">{t.category}</span>
                    </div>
                    <dd className="text-sm text-[var(--color-muted)] leading-relaxed mt-0.5">
                      <Bilingual en={t.enDefinition || t.definition} vn={t.definition} />
                    </dd>
                  </div>
                </div>
              )
            })}
          </dl>
        </section>
      ))}
    </div>
  )
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
        active
          ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
          : 'border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-acc)]'
      }`}
    >
      {children}
    </button>
  )
}
