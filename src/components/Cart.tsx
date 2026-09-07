import { useState, useMemo, useEffect, useRef } from 'react'
import { CIRCUITS, SHOP, EXTRA, formatVND, isPack, parseQty, parsePrice } from '../data/circuits'
import type { Part } from '../data/circuits'
import { Thumb } from './Parts'

const OKEY = 'machdien.owned'
const DEF_OWN = ['Đồng hồ vạn năng', 'Mỏ hàn chỉnh nhiệt T12']
const TOOL = 300000

interface Grouped {
  src: { t: string; u: string; p: string }
  blk: boolean
  names: string[]
  spec: string
  need: number
  use: Set<string>
  price: number
  qty: number
  line: number
  key: string
  owned: boolean
}

interface NaItem {
  name: string
  spec: string
  need: number
  use: Set<string>
  owned: boolean
}

interface ExRow {
  name: string
  qty: number
  unit: string
  price: number
  url: string
  key: string
  owned: boolean
}

export function Cart() {
  const [own, setOwn] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(OKEY) || '{}') } catch { return {} }
  })
  const [seeded] = useState(() => localStorage.getItem(OKEY) !== null)

  useEffect(() => {
    localStorage.setItem(OKEY, JSON.stringify(own))
  }, [own])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'Z' || e.key === 'z')) { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Undo/redo history (last 20 states). Refs to avoid re-renders.
  const past = useRef<Record<string, boolean>[]>([])
  const future = useRef<Record<string, boolean>[]>([])
  const commit = (next: Record<string, boolean>) => {
    past.current = [...past.current, own].slice(-20)
    future.current = []
    setOwn(next)
  }
  const undo = () => {
    const prev = past.current.pop()
    if (!prev) return
    future.current = [...future.current, own].slice(-20)
    setOwn(prev)
  }
  const redo = () => {
    const next = future.current.pop()
    if (!next) return
    past.current = [...past.current, own].slice(-20)
    setOwn(next)
  }

  const toggle = (k: string, on: boolean) => {
    setOwn(o => {
      const n = { ...o }
      if (on) n[k] = true
      else delete n[k]
      past.current = [...past.current, o].slice(-20)
      future.current = []
      return n
    })
  }

  const { groups, na, exRows } = useMemo(() => {
    // Aggregate parts across circuits by product URL
    const partMap = new Map<string, { name: string; spec: string; need: number; use: Set<string>; s: ReturnType<typeof getShop> }>()
    CIRCUITS.forEach(c => c.parts.forEach((p) => {
      const s = getShop(p.name)
      if (s.s) return
      const n = parseQty(p.qty)
      const e = partMap.get(p.name) || { name: p.name, spec: p.spec, need: 0, use: new Set<string>(), s }
      e.need = Math.max(e.need, n)
      e.use.add(`${c.l}|${c.n}|${c.name}`)
      partMap.set(p.name, e)
    }))

    const byUrl = new Map<string, Grouped>()
    const naArr: NaItem[] = []
    partMap.forEach(e => {
      const src = e.s.b || e.s.c
      if (!src) {
        naArr.push({ name: e.name, spec: e.spec, need: e.need, use: e.use, owned: !!own[e.name] })
        return
      }
      const g: Grouped = byUrl.get(src.u) || {
        src, blk: !!e.s.b, names: [], spec: e.spec, need: 0, use: new Set<string>(),
        price: 0, qty: 0, line: 0, key: src.u, owned: false,
      }
      g.names.push(e.name)
      g.need = Math.max(g.need, e.need)
      e.use.forEach(u => g.use.add(u))
      byUrl.set(src.u, g)
    })

    const groups: Grouped[] = [...byUrl.values()].map(g => {
      const price = parsePrice(g.src.p)
      const qty = isPack(g.src.t) ? 1 : g.need
      return { ...g, price, qty, line: qty * price, owned: !!own[g.key] }
    }).sort((a, b) => b.line - a.line)
    // First-visit: seed default owned (Đồng hồ vạn năng + Mỏ hàn T12)
    if (!seeded) {
      const seededOwn: Record<string, true> = {}
      groups.forEach(i => {
        if (i.names.some(n => DEF_OWN.includes(n))) seededOwn[i.key] = true
      })
      setTimeout(() => setOwn(seededOwn), 0)
    }

    const exRows: ExRow[] = EXTRA.map(e => ({
      name: e[0], qty: e[1], unit: e[2], price: e[3], url: e[4],
      key: `${e[4]}|${e[0]}`, owned: !!own[`${e[4]}|${e[0]}`],
    }))

    return { groups, na: naArr, exRows }
  }, [own, seeded])

  const kit = groups.filter(i => i.price < TOOL)
  const tool = groups.filter(i => i.price >= TOOL)
  const sum = (arr: { line: number; owned: boolean }[]) => arr.reduce((s, i) => s + (i.owned ? 0 : i.line), 0)
  const tEx = exRows.reduce((s, i) => s + (i.owned ? 0 : i.qty * i.price), 0)
  const tKit = sum(kit)
  const tTool = sum(tool)
  const nOwn = groups.filter(i => i.owned).length + na.filter(e => e.owned).length + exRows.filter(i => i.owned).length

  return (
    <div className="pt-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <SumCard label="Linh kiện cho mạch" value={`${kit.length} món`} />
        <SumCard label="Mua thêm (CSV)" value={`${EXTRA.length} món`} />
        <SumCard label="Chưa có nguồn" value={`${na.length} món`} />
        <SumCard label="Đã có sẵn" value={`${nOwn} món`} />
        <SumCard label="Cần trả ngay" value={formatVND(tKit + tEx)} highlight />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={undo}
          disabled={past.current.length === 0}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-[var(--color-border)] hover:border-[var(--color-acc)] disabled:opacity-30 transition"
          title="Hoàn tác (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          onClick={redo}
          disabled={future.current.length === 0}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-[var(--color-border)] hover:border-[var(--color-acc)] disabled:opacity-30 transition"
          title="Làm lại (Ctrl+Shift+Z)"
        >
          ↷ Redo
        </button>
        <span className="text-[10px] text-[var(--color-muted)]">undo/redo cho checkbox "Đã có sẵn" (lưu 20 bước)</span>
      </div>

      <Section title="1. Linh kiện & module theo mạch">
        <p className="text-sm text-[var(--color-muted)] mb-3">
          SL = số lượng cần nhiều nhất trong 1 mạch. Món bán theo gói/vỉ chỉ tính 1 gói (đủ xài cho mọi mạch). Dòng gộp nhiều tên = cùng 1 sản phẩm.
        </p>
        <GroupTable
          rows={kit.map((g, k) => ({ ...g, idx: k + 1, onToggle: () => toggle(g.key, !g.owned) }))}
        />
        <div className="flex justify-between items-center px-2 py-3 mt-2 border-t border-[var(--color-border)] font-semibold">
          <span>Tạm tính linh kiện</span>
          <span>{formatVND(tKit)}</span>
        </div>
      </Section>

      <Section title="2. Mua thêm — dụng cụ & vật tư">
        <p className="text-sm text-[var(--color-muted)] mb-3">
          Lấy từ file <code>gio_hang_banlinhkien.csv</code>, không thuộc mạch nào.
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              <th className="k-own w-10">Có</th>
              <th className="k-no w-8">#</th>
              <th className="k-im w-12"></th>
              <th className="k-name">Linh kiện</th>
              <th className="k-use">Dùng cho mạch</th>
              <th className="k-qty w-16">SL</th>
              <th className="k-price w-24">Đơn giá</th>
              <th className="k-line w-28">Thành tiền</th>
              <th className="k-src w-24">Nguồn</th>
            </tr>
          </thead>
          <tbody>
            {exRows.map((e, k) => (
              <tr key={e.key} className={`border-t border-[var(--color-border)] ${e.owned ? 'own' : ''}`}>
                <td className="k-own py-2 text-center">
                  <input type="checkbox" checked={e.owned} onChange={ev => toggle(e.key, ev.target.checked)} className="rounded" />
                </td>
                <td className="k-no py-2 text-center">{k + 1}</td>
                <td className="k-im py-2"><Thumb url={e.url} alt={e.name} /></td>
                <td className="k-name py-2">
                  <b>{e.name}</b>
                  {e.owned && <span className="owntag">ĐÃ CÓ</span>}
                </td>
                <td className="k-use py-2 text-xs text-[var(--color-muted)]">Mua thêm — không thuộc mạch nào (dụng cụ / vật tư chung)</td>
                <td className="k-qty py-2 text-center">{e.qty} {e.unit}</td>
                <td className="k-price py-2 font-mono">{formatVND(e.price)}</td>
                <td className="k-line py-2 font-mono font-semibold">{formatVND(e.qty * e.price)}</td>
                <td className="k-src py-2 text-xs">
                  <a href={e.url} target="_blank" rel="noopener" className="underline">banlinhkien</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-2 py-3 mt-2 border-t border-[var(--color-border)] font-semibold">
          <span>Tạm tính mua thêm</span>
          <span>{formatVND(tEx)}</span>
        </div>
        <div className="flex justify-between items-center px-2 py-3 mt-2 border-t border-[var(--color-border)] font-bold text-lg">
          <span>TỔNG CẦN MUA (mục 1 + 2)</span>
          <span>{formatVND(tKit + tEx)}</span>
        </div>
      </Section>

      {tool.length > 0 && (
        <Section title="3. Thiết bị đo & máy — mua sau, khi cần">
          <p className="text-sm text-[var(--color-muted)] mb-3">
            Món trên 300k, chưa cần từ Level 1. Không tính vào tổng ở trên.
          </p>
          <GroupTable
            rows={tool.map((g, k) => ({ ...g, idx: k + 1, onToggle: () => toggle(g.key, !g.owned) }))}
          />
          <div className="flex justify-between items-center px-2 py-3 mt-2 border-t border-[var(--color-border)] font-semibold">
            <span>Nếu mua đủ thiết bị</span>
            <span>{formatVND(tTool)}</span>
          </div>
        </Section>
      )}

      {na.length > 0 && (
        <Section title="4. Không có ở banlinhkien / caka">
          <p className="text-sm text-[var(--color-muted)] mb-3">
            Phải mua Hshop, Nshop, Icdayroi, Shopee… — chưa tính vào tổng.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                <th className="k-own w-10">Có</th>
                <th className="k-no w-8">#</th>
                <th className="k-im w-12"></th>
                <th className="k-name">Linh kiện</th>
                <th className="k-use">Dùng cho mạch</th>
                <th className="k-qty w-16">SL</th>
                <th className="k-price w-24">Đơn giá</th>
                <th className="k-line w-28">Thành tiền</th>
                <th className="k-src w-24">Nguồn</th>
              </tr>
            </thead>
            <tbody>
              {na.map((e, k) => (
                <tr key={e.name} className={`na border-t border-[var(--color-border)] ${e.owned ? 'own' : ''}`}>
                  <td className="k-own py-2 text-center">
                    <input type="checkbox" checked={e.owned} onChange={ev => toggle(e.name, ev.target.checked)} className="rounded" />
                  </td>
                  <td className="k-no py-2 text-center">{k + 1}</td>
                  <td className="k-im py-2"><div className="ph">?</div></td>
                  <td className="k-name py-2">
                    <b>{e.name}</b>
                    {e.owned && <span className="owntag">ĐÃ CÓ</span>}
                    <div className="text-xs text-[var(--color-muted)]">{e.spec}</div>
                  </td>
                  <td className="k-use py-2 text-xs"><UseLinks uses={e.use} /></td>
                  <td className="k-qty py-2 text-center">{e.need}</td>
                  <td className="k-price py-2 text-[var(--color-muted)]">—</td>
                  <td className="k-line py-2 text-[var(--color-muted)]">—</td>
                  <td className="k-src py-2 text-xs">
                    <span className="no">mua chỗ khác</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}
    </div>
  )
}

function getShop(name: string) {
  return SHOP[name] || {}
}

function SumCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${highlight ? 'bg-[color-mix(in_srgb,var(--color-acc)_15%,transparent)] border-[var(--color-acc)]' : 'border-[var(--color-border)] bg-[var(--color-card)]'}`}>
      <div className="text-xs text-[var(--color-muted)]">{label}</div>
      <div className="text-lg font-bold mt-0.5">{value}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold tracking-tight mb-3">{title}</h2>
      {children}
    </section>
  )
}

function GroupTable({ rows }: { rows: (Grouped & { idx: number; onToggle: () => void })[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          <th className="k-own w-10">Có</th>
          <th className="k-no w-8">#</th>
          <th className="k-im w-12"></th>
          <th className="k-name">Linh kiện</th>
          <th className="k-use">Dùng cho mạch</th>
          <th className="k-qty w-16">SL</th>
          <th className="k-price w-24">Đơn giá</th>
          <th className="k-line w-28">Thành tiền</th>
          <th className="k-src w-24">Nguồn</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(g => (
          <tr key={g.key} className={`border-t border-[var(--color-border)] ${g.owned ? 'own' : ''}`}>
            <td className="k-own py-2 text-center">
              <input type="checkbox" checked={g.owned} onChange={g.onToggle} className="rounded" />
            </td>
            <td className="k-no py-2 text-center">{g.idx}</td>
            <td className="k-im py-2"><Thumb url={g.src.u} alt={g.src.t} /></td>
            <td className="k-name py-2">
              <b>{g.names.join(' / ')}</b>
              {g.owned && <span className="owntag">ĐÃ CÓ</span>}
              <div className="text-xs text-[var(--color-muted)]">{g.src.t}</div>
            </td>
            <td className="k-use py-2 text-xs"><UseLinks uses={g.use} /></td>
            <td className="k-qty py-2 text-center">{g.qty}</td>
            <td className="k-price py-2 font-mono">{formatVND(g.price)}</td>
            <td className="k-line py-2 font-mono font-semibold">{formatVND(g.line)}</td>
            <td className="k-src py-2 text-xs">
              <a href={g.src.u} target="_blank" rel="noopener" className="underline">{g.blk ? 'banlinhkien' : 'caka.vn'}</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function UseLinks({ uses }: { uses: Set<string> }) {
  const arr = [...uses].map(s => s.split('|'))
  const children: React.ReactNode[] = []
  arr.forEach(([l, n, name], i) => {
    if (i > 0) children.push(<span key={`s${i}`}> · </span>)
    children.push(
      <a key={i} href={`#m-${l}-${n}`} className="underline hover:text-[var(--color-acc)]">
        {l}.{n} {name}
      </a>
    )
  })
  return <span className="space-x-1">{children}</span>
}
