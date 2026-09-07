import { useState, useMemo, useEffect } from 'react'
import { LayoutGrid, ShoppingCart, Search, Settings2, AlertTriangle } from 'lucide-react'
import { LEVELS, CIRCUITS, isNaPart } from '../data/circuits'
import { CircuitCard } from './CircuitCard'
import { GlobalSearch } from './GlobalSearch'
import { SettingsMenu } from './SettingsMenu'
import { Cart } from './Cart'

type Filter = 'all' | '1' | '2' | '3' | 'na'

export function AppShell() {
  const [tab, setTab] = useState<'m' | 'g'>('m')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)

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

  const jumpTo = (id: string) => {
    setTab('m')
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

      <div className="lg">
        <i /> Dòng tô đỏ = <b>không tìm thấy</b> ở cả banlinhkien.com và caka.vn (phải mua chỗ khác: Hshop, Nshop, Icdayroi, Shopee…). Giá lấy trực tiếp từ trang bán, bấm vào giá để mở sản phẩm. Rê chuột lên giá để xem đúng tên sản phẩm.
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pb-12">
        {tab === 'm' ? (
          <CircuitList filter={filter} query={query} flashId={flashId} />
        ) : (
          <Cart />
        )}
      </main>

      <Footer />

      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} onJump={jumpTo} />}
      {settingsOpen && <SettingsMenu onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}

function Header({
  tab, onTab, onSearch, onSettings,
}: {
  tab: 'm' | 'g'
  onTab: (t: 'm' | 'g') => void
  onSearch: () => void
  onSettings: () => void
}) {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color-mix(in_srgb,var(--color-bg)_85%,transparent)] border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <span className="text-[var(--color-acc)]">⚡</span> Mạch điện tử cơ bản
            </h1>
            <div className="sub text-xs text-[var(--color-muted)] mt-0.5">
              23 mạch chia 3 level — kèm danh sách linh kiện đầy đủ
            </div>
          </div>
          <nav className="tabs flex items-center gap-2 flex-wrap">
            <button
              data-t="m"
              onClick={() => onTab('m')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--color-border)] transition hover:border-[var(--color-acc)] ${tab === 'm' ? 'tab-active' : ''}`}
            >
              <LayoutGrid className="size-3.5" /> Mạch điện
            </button>
            <button
              data-t="g"
              onClick={() => onTab('g')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--color-border)] transition hover:border-[var(--color-acc)] ${tab === 'g' ? 'tab-active' : ''}`}
            >
              <ShoppingCart className="size-3.5" /> Giỏ hàng
            </button>
            <button
              id="gsbtn"
              onClick={onSearch}
              title="Tìm mọi thứ (⌘K)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--color-border)] transition hover:border-[var(--color-acc)]"
            >
              <Search className="size-3.5" /> Tìm mọi thứ <kbd className="text-[10px] opacity-70">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <span className="relative">
              <button
                id="setbtn"
                onClick={onSettings}
                title="Bật/tắt cột"
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

function FilterBar({
  filter, setFilter, query, setQuery, hidden,
}: {
  filter: Filter
  setFilter: (f: Filter) => void
  query: string
  setQuery: (q: string) => void
  hidden?: boolean
}) {
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
          {f === 'all' ? 'Tất cả' : f === 'na' ? 'Thiếu nguồn' : `Level ${f}`}
        </button>
      ))}
      <input
        id="q"
        value={query}
        onChange={e => setQuery(e.target.value.toLowerCase())}
        placeholder="Tìm mạch hoặc linh kiện… (vd: mosfet, 555, relay)"
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
          const blob = (c.name + ' ' + c.goal + ' ' + c.parts.map(p => p[0] + ' ' + p[1]).join(' ')).toLowerCase()
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

function isNaCircuit(c: { parts: [string, string, string, string][] }): boolean {
  return c.parts.some(p => isNaPart(p[0]))
}

function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-6 text-xs text-[var(--color-muted)] border-t border-[var(--color-border)] mt-8 space-y-1">
      <p>
        Giá lấy tự động từ <a className="underline" href="https://banlinhkien.com/" target="_blank">banlinhkien.com</a> và{' '}
        <a className="underline" href="https://caka.vn/" target="_blank">caka.vn</a> (cập nhật 09/2026) — có thể đổi, kiểm tra lại khi đặt hàng. Ký hiệu ✕ = shop đó không có, — = không phải linh kiện mua lẻ.
      </p>
      <p>
        Mô phỏng trước khi ráp: <a className="underline" href="https://www.falstad.com/circuit/" target="_blank">Falstad</a> ·{' '}
        <a className="underline" href="https://wokwi.com" target="_blank">Wokwi</a> (có Arduino/ESP32).
      </p>
      <p><b>An toàn:</b> không đụng vào điện 220V khi chưa có người hướng dẫn trực tiếp.</p>
    </footer>
  )
}
