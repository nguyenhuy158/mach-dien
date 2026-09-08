import { useState, useMemo, useEffect } from 'react'
import { LayoutGrid, ShoppingCart, Search, Settings2, AlertTriangle, GraduationCap, Languages, Sun, Moon } from 'lucide-react'
import { LEVELS, CIRCUITS, isNaPart } from '../data/circuits'
import { useI18n, Bilingual, tStr } from '../i18n'
import { useTheme } from '../theme'
import { FloatingCalculator } from './learn/tools/FloatingCalculator'
import { CircuitCard } from './CircuitCard'
import { GlobalSearch } from './GlobalSearch'
import { SettingsMenu } from './SettingsMenu'
import { Cart } from './Cart'
import { LearnShell } from './learn/LearnShell'
import { BackToTop } from './BackToTop'
import { QuickNav } from './QuickNav'
import { haptic } from '../utils/ux'
type Filter = 'all' | '1' | '2' | '3' | 'na'

export function AppShell() {
  const [tab, setTab] = useState<'m' | 'g' | 'h'>('m')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)
  const { mode, T, tvn } = useI18n()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA)$/.test((e.target as HTMLElement)?.tagName || '')
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      } else if (e.key === '/' && !typing) {
        e.preventDefault()
        setSearchOpen(true)
      } else if (e.key === 'Escape') {
        setSearchOpen(false)
        setSettingsOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Deep link from URL hash on first mount
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) {
      setTimeout(() => jumpTo(id), 200)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const jumpTo = (id: string) => {
    if (id.startsWith('cmp-') || id.startsWith('fml-') || id === 'tools' || id === 'glossary') setTab('h')
    else setTab('m')
    setFilter('all')
    setQuery('')
    setSearchOpen(false)
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setFlashId(id)
        setTimeout(() => setFlashId(null), 1800)
        history.replaceState(null, '', '#' + id)
      }
    }, 50)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        tab={tab}
        onTab={setTab}
        onSearch={() => setSearchOpen(true)}
        onSettings={() => setSettingsOpen(o => !o)}
      />
      <FilterBar
        filter={filter}
        setFilter={setFilter}
        query={query}
        setQuery={setQuery}
        hidden={tab !== 'm'}
      />

      {tab === 'm' && <QuickNav onJump={jumpTo} flashId={flashId} />}

      <div className="lg">
        <i /> {tStr(T.infoNa, tvn.infoNa, mode)}
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pb-12">
        {tab === 'm' && (
          <CircuitList filter={filter} query={query} flashId={flashId} />
        )}
        {tab === 'g' && <Cart />}
        {tab === 'h' && <LearnShell />}
      </main>

      <Footer />

      <FloatingCalculator />
      <BackToTop />

      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} onJump={jumpTo} />}
      {settingsOpen && <SettingsMenu onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}

function Header({
  tab, onTab, onSearch, onSettings,
}: {
  tab: 'm' | 'g' | 'h'
  onTab: (t: 'm' | 'g' | 'h') => void
  onSearch: () => void
  onSettings: () => void
}) {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)
  const { mode, setMode, T, tvn } = useI18n()

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color-mix(in_srgb,var(--color-bg)_85%,transparent)] border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight leading-tight">
              <span className="text-[var(--color-acc)]">⚡</span>{' '}
              <Bilingual en={T.siteTitle} vn={tvn.siteTitle} />
            </h1>
            <div className="sub text-xs text-[var(--color-muted)] mt-0.5">
              <Bilingual en={T.siteSubtitle} vn={tvn.siteSubtitle} />
            </div>
          </div>
          <nav className="tabs flex items-center gap-2 flex-wrap">
            <button
              data-t="m"
              onClick={() => onTab('m')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--color-border)] transition hover:border-[var(--color-acc)] ${tab === 'm' ? 'tab-active' : ''}`}
            >
              <LayoutGrid className="size-3.5" /> <Bilingual en={T.tabMach} vn={tvn.tabMach} />
            </button>
            <button
              data-t="h"
              onClick={() => onTab('h')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--color-border)] transition hover:border-[var(--color-acc)] ${tab === 'h' ? 'tab-active' : ''}`}
            >
              <GraduationCap className="size-3.5" /> <Bilingual en={T.tabHoc} vn={tvn.tabHoc} />
            </button>
            <button
              data-t="g"
              onClick={() => onTab('g')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--color-border)] transition hover:border-[var(--color-acc)] ${tab === 'g' ? 'tab-active' : ''}`}
            >
              <ShoppingCart className="size-3.5" /> <Bilingual en={T.tabGio} vn={tvn.tabGio} />
            </button>
            <button
              id="gsbtn"
              onClick={onSearch}
              title={tStr(T.search, tvn.search, mode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--color-border)] transition hover:border-[var(--color-acc)]"
            >
              <Search className="size-3.5" /> <Bilingual en={T.search} vn={tvn.search} /> <kbd className="text-[10px] opacity-70">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <span className="relative">
              <LanguageToggle />
            </span>
            <span className="relative">
              <ThemeToggle />
            </span>
            <span className="relative">
              <button
                id="setbtn"
                onClick={onSettings}
                title={tStr(T.settingsTitle, tvn.settingsTitle, mode)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm border border-[var(--color-border)] transition hover:border-[var(--color-acc)]"
              >
                <Settings2 className="size-3.5" />
              </button>
            </span>
          </nav>
        </div>
      </div>
    </header>
  )
}

function LanguageToggle() {
  const { mode, setMode, T, tvn } = useI18n()
  const next = () => {
    const order = ['bilingual', 'en', 'vn'] as const
    const i = order.indexOf(mode)
    setMode(order[(i + 1) % order.length])
  }
  const label = mode === 'bilingual' ? 'EN/VN' : mode === 'en' ? 'EN' : 'VN'
  return (
    <button
      onClick={next}
      title={tStr(T.langTitle, tvn.langTitle, mode)}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-[var(--color-border)] hover:border-[var(--color-acc)] transition min-w-[3.5rem] justify-center"
    >
      <Languages className="size-3.5" /> {label}
    </button>
  )
}
function ThemeToggle() {
  const { mode, setMode, resolved } = useTheme()
  const { mode: langMode, T, tvn } = useI18n()
  const cycle = () => {
    const order: Array<'auto' | 'light' | 'dark'> = ['auto', 'light', 'dark']
    setMode(order[(order.indexOf(mode) + 1) % order.length])
  }
  const label = mode === 'auto' ? tStr(T.themeAuto, tvn.themeAuto, langMode)
                : mode === 'light' ? tStr(T.themeLight, tvn.themeLight, langMode)
                : tStr(T.themeDark, tvn.themeDark, langMode)
  return (
    <button
      onClick={cycle}
      title={`${tStr(T.themeTitle, tvn.themeTitle, langMode)}: ${label}`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-[var(--color-border)] hover:border-[var(--color-acc)] transition min-w-[3.5rem] justify-center"
    >
      {resolved === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
      {label}
    </button>
  )
}

 function FilterBar({
  filter, setFilter, query, setQuery, hidden,
}: {
  filter: Filter
  setFilter: (f: Filter) => void
  query: string
  setQuery: (q: string) => void
  hidden?: boolean
}) {
  const { mode, T, tvn } = useI18n()
  if (hidden) return null
  return (
    <div className="ctl max-w-6xl mx-auto px-6 pt-4 flex flex-wrap gap-2 items-center">
      {(['all', '1', '2', '3', 'na'] as Filter[]).map(f => (
        <button
          key={f}
          data-f={f}
          onClick={() => setFilter(f)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--color-border)] transition hover:border-[var(--color-acc)] ${filter === f ? 'tab-active' : ''}`}
        >
          {f === 'na' && <AlertTriangle className="size-3.5" />}
          <Bilingual
            en={f === 'all' ? T.filterAll : f === 'na' ? T.filterNa : T.filterLevel(parseInt(f))}
            vn={f === 'all' ? tvn.filterAll : f === 'na' ? tvn.filterNa : tvn.filterLevel(parseInt(f))}
            vnClass="inline text-[0.8em] opacity-80 ml-1 before:content-['·'] before:mr-1 font-normal"
          />
        </button>
      ))}
      <input
        id="q"
        value={query}
        onChange={e => setQuery(e.target.value.toLowerCase())}
        placeholder={tStr(T.searchHintMach, tvn.searchHintMach, mode)}
        className="flex-1 min-w-[200px] rounded-full px-4 py-1.5 text-sm border border-[var(--color-border)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-acc)_35%,transparent)] focus:outline-none bg-transparent"
      />
    </div>
  )
}

function CircuitList({
  filter, query, flashId,
}: {
  filter: Filter
  query: string
  flashId: string | null
}) {
  const grouped = useMemo(() => {
    return LEVELS.map(L => {
      const cards = CIRCUITS
        .filter(c => c.l === L.n)
        .filter(c => filter === 'na' ? isNaCircuit(c) : true)
        .filter(c => {
          if (!query) return true
          const blob = (c.name + ' ' + c.goal + ' ' + c.parts.map(p => p.name + ' ' + p.spec).join(' ')).toLowerCase()
          return blob.includes(query)
        })
      return { L, cards }
    })
  }, [filter, query])

  return (
    <div className="space-y-12 mt-6">
      {grouped.map(({ L, cards }) => (
        <section key={L.n} data-l={L.n} className={cards.length === 0 ? 'hide' : ''}>
          <div className="lvlhead flex items-center gap-3 mb-4 flex-wrap">
            <span className={`badge ${L.cls}`}>LEVEL {L.n}</span>
            <h2 className="text-2xl font-display font-bold tracking-tight">{L.t}</h2>
            <span className="text-sm text-[var(--color-muted)]">{L.g}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cards.map(c => (
              <CircuitCard
                key={`${c.l}-${c.n}`}
                c={c}
                flash={flashId === `m-${c.l}-${c.n}`}
              />
            ))}
          </div>
          <div className="proj mt-4" dangerouslySetInnerHTML={{ __html: L.proj }} />
        </section>
      ))}
    </div>
  )
}

function isNaCircuit(c: { parts: { name: string }[] }): boolean {
  return c.parts.some(p => isNaPart(p.name))
}

function Footer() {
  const { T, tvn, mode } = useI18n()
  return (
    <footer className="max-w-6xl mx-auto px-6 py-6 text-xs text-[var(--color-muted)] border-t border-[var(--color-border)] mt-8 space-y-1">
      <p>
        {tStr(T.footerPrice, tvn.footerPrice, mode)}
      </p>
      <p>
        {tStr(T.footerSim, tvn.footerSim, mode)}
      </p>
      <p><b>{mode === 'vn' ? 'An toàn' : 'Safety'}:</b> {mode === 'vn' ? 'không đụng vào điện 220V khi chưa có người hướng dẫn trực tiếp.' : 'do not touch 220V mains without direct supervision.'}</p>
    </footer>
  )
}
