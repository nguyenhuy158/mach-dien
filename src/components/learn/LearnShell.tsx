import { useState, useMemo, useEffect } from 'react'
import { Search, Bookmark, ChevronRight, GraduationCap, Sparkles } from 'lucide-react'
import { COMPONENTS, FORMULAS, GLOSSARY, CATEGORIES } from '../../data/learn'
import { ComponentCard } from './ComponentCard'
import { FormulaCard } from './FormulaCard'
import { GlossaryList } from './GlossaryList'
import { Roadmap } from './Roadmap'
import { ComparisonTool } from './ComparisonTool'
import { MyBuilds } from './MyBuilds'
import { QuizMode } from './QuizMode'
import { ResistorColorCode } from './tools/ResistorColorCode'
import { SmdLookup } from './tools/SmdLookup'
import { UnitConverter } from './tools/UnitConverter'
import { PinoutViewer } from './tools/PinoutViewer'
import { CheatSheet } from './CheatSheet'
import { useI18n, Bilingual } from '../../i18n'

type Section = 'components' | 'formulas' | 'glossary' | 'tools' | 'cheatsheet'
type Filter = 'all' | string

const BKEY = 'machdien.learn.bookmarks'

interface Bookmarks {
  components: Set<string>
  formulas: Set<string>
  glossary: Set<string>
}

function loadBookmarks(): Bookmarks {
  try {
    const raw = JSON.parse(localStorage.getItem(BKEY) || '{}')
    return {
      components: new Set(raw.components || []),
      formulas: new Set(raw.formulas || []),
      glossary: new Set(raw.glossary || []),
    }
  } catch {
    return { components: new Set(), formulas: new Set(), glossary: new Set() }
  }
}

function saveBookmarks(b: Bookmarks) {
  localStorage.setItem(BKEY, JSON.stringify({
    components: [...b.components],
    formulas: [...b.formulas],
    glossary: [...b.glossary],
  }))
}

export function LearnShell() {
  const [section, setSection] = useState<Section>('components')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [bookmarks, setBookmarks] = useState<Bookmarks>(loadBookmarks)

  useEffect(() => {
    saveBookmarks(bookmarks)
  }, [bookmarks])

  const toggleComponent = (id: string) => {
    setBookmarks(b => {
      const next = { ...b, components: new Set(b.components) }
      if (next.components.has(id)) next.components.delete(id)
      else next.components.add(id)
      return next
    })
  }
  const toggleFormula = (id: string) => {
    setBookmarks(b => {
      const next = { ...b, formulas: new Set(b.formulas) }
      if (next.formulas.has(id)) next.formulas.delete(id)
      else next.formulas.add(id)
      return next
    })
  }
  const toggleGlossary = (term: string) => {
    setBookmarks(b => {
      const next = { ...b, glossary: new Set(b.glossary) }
      if (next.glossary.has(term)) next.glossary.delete(term)
      else next.glossary.add(term)
      return next
    })
  }

  const filteredComponents = useMemo(() => {
    const q = query.toLowerCase().trim()
    return COMPONENTS.filter(c => {
      if (filter !== 'all' && c.category !== filter) return false
      if (showBookmarkedOnly && !bookmarks.components.has(c.id)) return false
      if (q && !(c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.applications.some(a => a.toLowerCase().includes(q)))) return false
      return true
    })
  }, [filter, query, bookmarks, showBookmarkedOnly])

  const filteredFormulas = useMemo(() => {
    const q = query.toLowerCase().trim()
    return FORMULAS.filter(f => {
      if (filter !== 'all' && f.category !== filter) return false
      if (showBookmarkedOnly && !bookmarks.formulas.has(f.id)) return false
      if (q && !(f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))) return false
      return true
    })
  }, [filter, query, bookmarks, showBookmarkedOnly])

  const categories = section === 'components' ? CATEGORIES.components
    : section === 'formulas' ? CATEGORIES.formulas
    : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 mt-6">
      <aside className="space-y-4">
        <Roadmap bookmarked={bookmarks} />
        <QuizMode />
        <ComparisonTool />
        <MyBuilds />

        <nav className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
          <button
            onClick={() => setSection('components')}
            className={`w-full text-left px-4 py-3 flex items-center gap-2 transition ${
              section === 'components' ? 'bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-[var(--color-acc)] font-semibold' : 'hover:bg-[color-mix(in_srgb,var(--color-acc)_8%,transparent)]'
            }`}
          >
            <GraduationCap className="size-4" /> <Bilingual en="Components" vn="Linh kiện" /> <span className="ml-auto text-xs opacity-70">{COMPONENTS.length}</span>
          </button>
          <button
            onClick={() => setSection('formulas')}
            className={`w-full text-left px-4 py-3 flex items-center gap-2 border-t border-[var(--color-border)] transition ${
              section === 'formulas' ? 'bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-[var(--color-acc)] font-semibold' : 'hover:bg-[color-mix(in_srgb,var(--color-acc)_8%,transparent)]'
            }`}
          >
            <Sparkles className="size-4" /> <Bilingual en="Formulas" vn="Công thức" /> <span className="ml-auto text-xs opacity-70">{FORMULAS.length}</span>
          </button>
          <button
            onClick={() => setSection('glossary')}
            className={`w-full text-left px-4 py-3 flex items-center gap-2 border-t border-[var(--color-border)] transition ${
              section === 'glossary' ? 'bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-[var(--color-acc)] font-semibold' : 'hover:bg-[color-mix(in_srgb,var(--color-acc)_8%,transparent)]'
            }`}
          >
            <ChevronRight className="size-4" /> <Bilingual en="Glossary" vn="Thuật ngữ" /> <span className="ml-auto text-xs opacity-70">{GLOSSARY.length}</span>
          </button>
          <button
            onClick={() => setSection('tools')}
            className={`w-full text-left px-4 py-3 flex items-center gap-2 border-t border-[var(--color-border)] transition ${
              section === 'tools' ? 'bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-[var(--color-acc)] font-semibold' : 'hover:bg-[color-mix(in_srgb,var(--color-acc)_8%,transparent)]'
            }`}
          >
            🛠️ <Bilingual en="Quick lookup" vn="Tra cứu nhanh" />
          </button>
          <button
            onClick={() => setSection('cheatsheet')}
            className={`w-full text-left px-4 py-3 flex items-center gap-2 border-t border-[var(--color-border)] transition ${
              section === 'cheatsheet' ? 'bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] text-[var(--color-acc)] font-semibold' : 'hover:bg-[color-mix(in_srgb,var(--color-acc)_8%,transparent)]'
            }`}
          >
            🖨️ <Bilingual en="Cheat Sheet" vn="Cheat Sheet" />
          </button>
        </nav>
      </aside>

      <div>
        {(section === 'components' || section === 'formulas') && (
          <Toolbar
            query={query}
            setQuery={setQuery}
            filter={filter}
            setFilter={setFilter}
            showBookmarkedOnly={showBookmarkedOnly}
            setShowBookmarkedOnly={setShowBookmarkedOnly}
            categories={categories}
          />
        )}

        {section === 'components' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComponents.length === 0 && (
              <div className="col-span-full text-center py-12 text-[var(--color-muted)]">Không tìm thấy linh kiện nào.</div>
            )}
            {filteredComponents.map(c => (
              <ComponentCard
                key={c.id}
                c={c}
                bookmarked={bookmarks.components.has(c.id)}
                onToggleBookmark={() => toggleComponent(c.id)}
              />
            ))}
          </div>
        )}

        {section === 'formulas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFormulas.length === 0 && (
              <div className="col-span-full text-center py-12 text-[var(--color-muted)]">Không tìm thấy công thức nào.</div>
            )}
            {filteredFormulas.map(f => (
              <FormulaCard
                key={f.id}
                f={f}
                bookmarked={bookmarks.formulas.has(f.id)}
                onToggleBookmark={() => toggleFormula(f.id)}
              />
            ))}
          </div>
        )}

        {section === 'glossary' && (
          <GlossaryList
            terms={GLOSSARY}
            bookmarked={bookmarks.glossary}
            onToggleBookmark={toggleGlossary}
          />
        )}

        {section === 'tools' && (
          <div className="space-y-4">
            <UnitConverter />
            <PinoutViewer />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResistorColorCode />
              <SmdLookup />
            </div>
          </div>
        )}

        {section === 'cheatsheet' && <CheatSheet />}
      </div>
    </div>
  )
}

function Toolbar({
  query, setQuery, filter, setFilter, showBookmarkedOnly, setShowBookmarkedOnly, categories,
}: {
  query: string
  setQuery: (q: string) => void
  filter: Filter
  setFilter: (f: Filter) => void
  showBookmarkedOnly: boolean
  categories: string[]
  setShowBookmarkedOnly: (b: boolean) => void
}) {
  const { mode } = useI18n()
  return (
    <div className="mb-4 space-y-3">
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--color-muted)]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={mode === 'vn' ? 'Tìm kiếm…' : 'Search…'}
            className="w-full rounded-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-acc)_35%,transparent)] focus:outline-none bg-transparent"
          />
        </div>
        <button
          onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition ${
            showBookmarkedOnly
              ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-acc)]'
          }`}
        >
          <Bookmark className="size-3.5" /> <Bilingual en="Bookmarked" vn="Đã đánh dấu" />
        </button>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <Pill active={filter === 'all'} onClick={() => setFilter('all')}><Bilingual en="All" vn="Tất cả" /></Pill>
        {categories.map(c => (
          <Pill key={c} active={filter === c} onClick={() => setFilter(c)}>{c}</Pill>
        ))}
      </div>
    </div>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-0.5 rounded-full text-xs border transition ${
        active
          ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
          : 'border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-acc)]'
      }`}
    >
      {children}
    </button>
  )
}
