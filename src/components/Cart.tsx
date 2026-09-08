import { useState, useMemo, useEffect } from 'react'
import { CIRCUITS, SHOP, EXTRA, formatVND, isPack, parseQty, parsePrice } from '../data/circuits'
import type { ShopProduct } from '../data/circuits'
import { Thumb } from './Parts'
import { Download, Copy, Check, Filter, Layers, CheckSquare, Square, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
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

const ALL_CIRCUIT_KEYS = CIRCUITS.map(c => `${c.l}-${c.n}`)
const L1_KEYS = CIRCUITS.filter(c => c.l === 1).map(c => `${c.l}-${c.n}`)
const L2_KEYS = CIRCUITS.filter(c => c.l === 2).map(c => `${c.l}-${c.n}`)
const L3_KEYS = CIRCUITS.filter(c => c.l === 3).map(c => `${c.l}-${c.n}`)

export function Cart() {
  const [selectedCircuits, setSelectedCircuits] = useState<Set<string>>(() => new Set(ALL_CIRCUIT_KEYS))
  const [showCircuitSelector, setShowCircuitSelector] = useState(false)
  const [copied, setCopied] = useState(false)

  const [history, setHistory] = useState<{
    past: Record<string, boolean>[]
    present: Record<string, boolean>
    future: Record<string, boolean>[]
  }>(() => {
    let initial: Record<string, boolean> = {}
    try { initial = JSON.parse(localStorage.getItem(OKEY) || '{}') } catch {}
    return { past: [], present: initial, future: [] }
  })
  const [seeded, setSeeded] = useState(() => localStorage.getItem(OKEY) !== null)

  const own = history.present

  useEffect(() => {
    localStorage.setItem(OKEY, JSON.stringify(own))
  }, [own])

  const toggle = (k: string, on: boolean) => {
    setHistory(h => {
      const next = { ...h.present }
      if (on) next[k] = true
      else delete next[k]
      return {
        past: [...h.past, h.present].slice(-20),
        present: next,
        future: [],
      }
    })
  }

  const undo = () => {
    setHistory(h => {
      if (h.past.length === 0) return h
      const prev = h.past[h.past.length - 1]
      return {
        past: h.past.slice(0, -1),
        present: prev,
        future: [h.present, ...h.future].slice(-20),
      }
    })
  }

  const redo = () => {
    setHistory(h => {
      if (h.future.length === 0) return h
      const next = h.future[0]
      return {
        past: [...h.past, h.present].slice(-20),
        present: next,
        future: h.future.slice(1),
      }
    })
  }

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault()
        undo()
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'Z' || e.key === 'z')) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])
  const { groups, na, exRows } = useMemo(() => {
    // Aggregate parts across selected circuits by product URL
    const partMap = new Map<string, { name: string; spec: string; need: number; use: Set<string>; s: ShopProduct }>()
    const activeCircuits = CIRCUITS.filter(c => selectedCircuits.has(`${c.l}-${c.n}`))
    activeCircuits.forEach(c => c.parts.forEach((p) => {
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
      setTimeout(() => {
        setHistory(h => ({ ...h, present: { ...h.present, ...seededOwn } }))
        setSeeded(true)
      }, 0)
    }

    const exRows: ExRow[] = EXTRA.map(e => ({
      name: e[0], qty: e[1], unit: e[2], price: e[3], url: e[4],
      key: `${e[4]}|${e[0]}`, owned: !!own[`${e[4]}|${e[0]}`],
    }))

    return { groups, na: naArr, exRows }
  }, [own, seeded, selectedCircuits])
  const kit = groups.filter(i => i.price < TOOL)
  const tool = groups.filter(i => i.price >= TOOL)
  const sum = (arr: { line: number; owned: boolean }[]) => arr.reduce((s, i) => s + (i.owned ? 0 : i.line), 0)
  const tEx = exRows.reduce((s, i) => s + (i.owned ? 0 : i.qty * i.price), 0)
  const tKit = sum(kit)
  const tTool = sum(tool)
  const nOwn = groups.filter(i => i.owned).length + na.filter(e => e.owned).length + exRows.filter(i => i.owned).length

  const handleExportCsv = () => {
    const rows: string[][] = [
      ['STT', 'Phan loai', 'Ten linh kien', 'Thong so', 'So luong', 'Don gia (VND)', 'Thanh tien (VND)', 'Nguon / Cua hang', 'Link', 'Trang thai']
    ]
    let idx = 1
    kit.forEach(g => {
      rows.push([
        String(idx++),
        'Linh kien theo mach',
        `"${g.names.join(' / ').replace(/"/g, '""')}"`,
        `"${g.spec.replace(/"/g, '""')}"`,
        String(g.qty),
        String(g.price),
        String(g.line),
        g.blk ? 'banlinhkien' : 'caka.vn',
        g.src.u,
        g.owned ? 'Da co san' : 'Can mua'
      ])
    })
    tool.forEach(g => {
      rows.push([
        String(idx++),
        'Thiet bi & May do',
        `"${g.names.join(' / ').replace(/"/g, '""')}"`,
        `"${g.spec.replace(/"/g, '""')}"`,
        String(g.qty),
        String(g.price),
        String(g.line),
        g.blk ? 'banlinhkien' : 'caka.vn',
        g.src.u,
        g.owned ? 'Da co san' : 'Can mua'
      ])
    })
    exRows.forEach(e => {
      rows.push([
        String(idx++),
        'Dung cu mua them',
        `"${e.name.replace(/"/g, '""')}"`,
        e.unit,
        String(e.qty),
        String(e.price),
        String(e.qty * e.price),
        'banlinhkien',
        e.url,
        e.owned ? 'Da co san' : 'Can mua'
      ])
    })
    na.forEach(n => {
      rows.push([
        String(idx++),
        'Ngoai cua hang (Shopee/Hshop...)',
        `"${n.name.replace(/"/g, '""')}"`,
        `"${n.spec.replace(/"/g, '""')}"`,
        String(n.need),
        '0',
        '0',
        'Tu mua',
        '',
        n.owned ? 'Da co san' : 'Can mua'
      ])
    })

    const csvContent = '\uFEFF' + rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `BOM_mach_dien_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyForShop = async () => {
    const neededKit = kit.filter(g => !g.owned)
    const neededEx = exRows.filter(e => !e.owned)
    const neededNa = na.filter(n => !n.owned)

    let txt = `📦 DANH SÁCH MUA LINH KIỆN - MẠCH ĐIỆN TỬ\n`
    txt += `Mạch đã chọn: ${selectedCircuits.size}/${CIRCUITS.length} mạch\n`
    txt += `Tổng chi phí dự kiến: ${formatVND(tKit + tEx)}\n`
    txt += `----------------------------------------\n`

    if (neededKit.length > 0) {
      txt += `\n[1. LINH KIỆN MẠCH (${neededKit.length} món)]:\n`
      neededKit.forEach((g, i) => {
        const pack = isPack(g.src.t) ? ' (Gói/vỉ)' : ''
        txt += `${i + 1}. ${g.names.join(' / ')} - SL: ${g.qty}${pack} - ${formatVND(g.line)} [${g.blk ? 'banlinhkien' : 'caka'}]\n`
      })
    }

    if (neededEx.length > 0) {
      txt += `\n[2. DỤNG CỤ & VẬT TƯ MUA THÊM (${neededEx.length} món)]:\n`
      neededEx.forEach((e, i) => {
        txt += `${i + 1}. ${e.name} - SL: ${e.qty} ${e.unit} - ${formatVND(e.qty * e.price)}\n`
      })
    }

    if (neededNa.length > 0) {
      txt += `\n[3. LINH KIỆN KHÁC (SHOPEE/HSHOP) (${neededNa.length} món)]:\n`
      neededNa.forEach((n, i) => {
        txt += `${i + 1}. ${n.name} (${n.spec}) - SL: ${n.need}\n`
      })
    }

    txt += `\n----------------------------------------\n`
    txt += `Tạo từ: https://mach-dien.pages.dev\n`

    try {
      await navigator.clipboard.writeText(txt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('Sao chép danh sách:', txt)
    }
  }

  const isAllSelected = selectedCircuits.size === CIRCUITS.length
  const isL1Selected = L1_KEYS.every(k => selectedCircuits.has(k)) && selectedCircuits.size === L1_KEYS.length
  const isL2Selected = L2_KEYS.every(k => selectedCircuits.has(k)) && selectedCircuits.size === L2_KEYS.length
  const isL3Selected = L3_KEYS.every(k => selectedCircuits.has(k)) && selectedCircuits.size === L3_KEYS.length

  return (
    <div className="pt-6">
      {/* Combo Starter Kits & Circuit Filter Selection */}
      <div className="mb-6 p-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--color-acc)]" />
            <h3 className="font-bold text-sm tracking-tight">Gói linh kiện theo nhu cầu (BOM Generator)</h3>
            <span className="text-xs text-[var(--color-muted)]">({selectedCircuits.size}/{CIRCUITS.length} mạch)</span>
          </div>
          <button
            type="button"
            onClick={() => setShowCircuitSelector(v => !v)}
            className="inline-flex items-center gap-1 text-xs text-[var(--color-acc)] hover:underline font-medium"
          >
            <Filter className="size-3" />
            <span>{showCircuitSelector ? 'Thu gọn danh sách mạch' : 'Tùy chọn từng mạch'}</span>
            {showCircuitSelector ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
        </div>

        {/* Presets buttons */}
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            type="button"
            onClick={() => setSelectedCircuits(new Set(ALL_CIRCUIT_KEYS))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isAllSelected
                ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-acc)] bg-[var(--color-bg)]'
            }`}
          >
            🌟 Tất cả 23 mạch
          </button>
          <button
            type="button"
            onClick={() => setSelectedCircuits(new Set(L1_KEYS))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isL1Selected
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-[var(--color-border)] hover:border-emerald-500 bg-[var(--color-bg)]'
            }`}
          >
            🎓 Combo Level 1 (Nhập môn: 6 mạch)
          </button>
          <button
            type="button"
            onClick={() => setSelectedCircuits(new Set(L2_KEYS))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isL2Selected
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-[var(--color-border)] hover:border-blue-500 bg-[var(--color-bg)]'
            }`}
          >
            ⚡ Combo Level 2 (MCU & Tải lớn: 8 mạch)
          </button>
          <button
            type="button"
            onClick={() => setSelectedCircuits(new Set(L3_KEYS))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isL3Selected
                ? 'bg-purple-600 text-white border-purple-600'
                : 'border-[var(--color-border)] hover:border-purple-500 bg-[var(--color-bg)]'
            }`}
          >
            🚀 Combo Level 3 (Chuyên sâu: 9 mạch)
          </button>
        </div>

        {/* Expanded Circuit Checkboxes */}
        {showCircuitSelector && (
          <div className="mt-3 pt-3 border-t border-[var(--color-border)] animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-[var(--color-muted)] mb-2">
              <span>Tick chọn các mạch bạn muốn làm:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCircuits(new Set(ALL_CIRCUIT_KEYS))}
                  className="hover:underline text-[var(--color-acc)]"
                >
                  Chọn hết
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSelectedCircuits(new Set())}
                  className="hover:underline text-[var(--color-acc)]"
                >
                  Bỏ chọn hết
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {CIRCUITS.map(c => {
                const k = `${c.l}-${c.n}`
                const checked = selectedCircuits.has(k)
                return (
                  <label
                    key={k}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition ${
                      checked
                        ? 'bg-[color-mix(in_srgb,var(--color-acc)_10%,transparent)] border-[var(--color-acc)] font-medium'
                        : 'bg-[var(--color-bg)] border-[var(--color-border)] opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => {
                        const next = new Set(selectedCircuits)
                        if (e.target.checked) next.add(k)
                        else next.delete(k)
                        setSelectedCircuits(next)
                      }}
                      className="rounded text-[var(--color-acc)] focus:ring-[var(--color-acc)]"
                    />
                    <span className="font-mono text-[10px] text-[var(--color-muted)] font-bold">{c.l}.{c.n}</span>
                    <span className="truncate">{c.name}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <SumCard label="Linh kiện cho mạch" value={`${kit.length} món`} />
        <SumCard label="Mua thêm (CSV)" value={`${EXTRA.length} món`} />
        <SumCard label="Chưa có nguồn" value={`${na.length} món`} />
        <SumCard label="Đã có sẵn" value={`${nOwn} món`} />
        <SumCard label="Cần trả ngay" value={formatVND(tKit + tEx)} highlight />
      </div>

      {/* Export BOM Bar & Undo/Redo */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap bg-[var(--color-card)] p-3 rounded-xl border border-[var(--color-border)]">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-acc)] text-[var(--color-bg)] hover:opacity-90 transition shadow-sm"
            title="Tải bảng danh sách linh kiện dạng file Excel/CSV"
          >
            <Download className="size-3.5" />
            <span>Xuất file CSV (Excel)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyForShop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--color-border)] hover:border-[var(--color-acc)] bg-[var(--color-bg)] transition shadow-sm"
            title="Sao chép danh sách linh kiện gọn gàng để gửi shop bán lẻ"
          >
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            <span>{copied ? 'Đã sao chép vào clipboard!' : 'Sao chép gửi shop'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-[var(--color-border)] hover:border-[var(--color-acc)] disabled:opacity-30 transition"
            title="Hoàn tác (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-[var(--color-border)] hover:border-[var(--color-acc)] disabled:opacity-30 transition"
            title="Làm lại (Ctrl+Shift+Z)"
          >
            ↷ Redo
          </button>
        </div>
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
