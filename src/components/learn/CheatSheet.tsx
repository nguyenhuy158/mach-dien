
function downloadPDF() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, M = 12
  let y = M
  doc.setFont('helvetica', 'bold'); doc.setFontSize(16)
  doc.text('MACH DIEN TU CO BAN - Basic Electronics Cheat Sheet', M, y); y += 8
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
  doc.text('23 circuits, 29 components, 19 formulas, 50 glossary terms', M, y); y += 6

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11)
  doc.text('Color code (4-band)', M, y); y += 4
  doc.setFontSize(8)
  for (const c of COLOR_BANDS) {
    const rgb = hex2rgb(c.hex)
    doc.setFillColor(rgb[0], rgb[1], rgb[2])
    doc.rect(M, y - 3, 4, 4, 'F')
    doc.text(c.color + '  digit=' + c.digit + '  x' + c.mult, M + 6, y)
    y += 4
    if (y > 280) { doc.addPage(); y = M }
  }
  y += 2

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11)
  doc.text('Formulas', M, y); y += 5
  doc.setFontSize(8); doc.setFont('helvetica', 'normal')
  for (const f of FORMULAS) {
    const lines = doc.splitTextToSize(f.name + ':  ' + f.expression, W - 2 * M)
    doc.text(lines, M, y)
    y += lines.length * 3.5 + 1
    if (y > 280) { doc.addPage(); y = M }
  }
  y += 2

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11)
  doc.text('Glossary', M, y); y += 5
  doc.setFontSize(8); doc.setFont('helvetica', 'normal')
  for (const g of GLOSSARY) {
    const head = g.term + '  (' + g.category + '): '
    const text = head + g.definition
    const lines = doc.splitTextToSize(text, W - 2 * M)
    doc.text(lines, M, y)
    y += lines.length * 3.5 + 1
    if (y > 280) { doc.addPage(); y = M }
  }

  doc.save('mach-dien-cheatsheet.pdf')
}

function hex2rgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

import { COMPONENTS, FORMULAS, GLOSSARY, COLOR_BANDS, TOLERANCE_BANDS } from '../../data/learn'
import { Printer, FileDown } from 'lucide-react'
import { useI18n, Bilingual } from '../../i18n'
import { jsPDF } from 'jspdf'

export function CheatSheet() {
  return (
    <div>
      <div className="mb-3 flex justify-end print:hidden">
        <button
          onClick={() => downloadPDF()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--color-border)] hover:border-[var(--color-acc)] transition"
        >
          <FileDown className="size-3.5" /> <Bilingual en="Download PDF" vn="Tải PDF" />
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--color-border)] hover:border-[var(--color-acc)] transition"
        >
          <Printer className="size-3.5" /> <Bilingual en="Print / Export PDF" vn="In / Xuất PDF" />
        </button>
      </div>

      <div className="bg-white text-black p-6 rounded-2xl border border-[var(--color-border)] print:border-0 print:p-0 cheat-sheet">
        <style>{`
          @media print {
            body { background: white !important; }
            .cheat-sheet { box-shadow: none !important; }
            h2 { page-break-after: avoid; }
            table { page-break-inside: avoid; }
            .print-hidden { display: none !important; }
          }
        `}</style>

        <h1 className="text-2xl font-bold text-center mb-1">MẠCH ĐIỆN TỬ CƠ BẢN</h1>
        <h2 className="text-center text-sm text-gray-600 mb-4">Cheat Sheet — Tra cứu nhanh</h2>

        <Section title="📐 Mã màu điện trở">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left p-1">Màu</th>
                <th className="text-left p-1">Số</th>
                <th className="text-left p-1">Hệ số</th>
                <th className="text-left p-1">Sai số</th>
              </tr>
            </thead>
            <tbody>
              {COLOR_BANDS.map(c => (
                <tr key={c.color} className="border-b border-gray-200">
                  <td className="p-1 flex items-center gap-2">
                    <span className="inline-block size-3 rounded" style={{ background: c.hex, border: '1px solid #999' }} />
                    {c.color}
                  </td>
                  <td className="p-1 font-mono">{c.digit}</td>
                  <td className="p-1 font-mono">×{c.mult}</td>
                  <td className="p-1">—</td>
                </tr>
              ))}
              <tr className="border-b border-gray-200">
                <td className="p-1 italic text-gray-500" colSpan={4}>Sai số:</td>
              </tr>
              {Object.entries(TOLERANCE_BANDS).map(([k, v]) => (
                <tr key={k} className="border-b border-gray-200">
                  <td className="p-1 flex items-center gap-2">
                    <span className="inline-block size-3 rounded" style={{ background: v.hex, border: '1px solid #999' }} />
                    {k}
                  </td>
                  <td className="p-1" colSpan={2}>—</td>
                  <td className="p-1 font-mono">±{v.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="📊 Ký hiệu đơn vị">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Unit k="p" v="pico 10⁻¹²" />
            <Unit k="n" v="nano 10⁻⁹" />
            <Unit k="µ" v="micro 10⁻⁶" />
            <Unit k="m" v="milli 10⁻³" />
            <Unit k="k" v="kilo 10³" />
            <Unit k="M" v="mega 10⁶" />
            <Unit k="G" v="giga 10⁹" />
          </div>
        </Section>

        <Section title="🧮 Công thức cốt lõi">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {FORMULAS.map(f => (
              <div key={f.id} className="border-b border-gray-200 py-1">
                <b>{f.name}:</b> <span className="font-mono">{f.expression}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="🔧 Linh kiện — tra nhanh">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {COMPONENTS.map(c => (
              <div key={c.id} className="border-b border-gray-200 py-1">
                <b>{c.name}</b> ({c.symbol}): {c.description.split('.')[0]}.
              </div>
            ))}
          </div>
        </Section>

        <Section title="📖 Thuật ngữ">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {GLOSSARY.map(g => (
              <div key={g.term} className="border-b border-gray-200 py-1">
                <b className="font-mono">{g.term}</b>: <span className="text-gray-700">{g.definition.split('.')[0]}.</span>
              </div>
            ))}
          </div>
        </Section>

        <div className="mt-4 text-center text-xs text-gray-500">
          In từ app Mạch điện tử cơ bản — in 2 mặt A4 để dễ tra cứu.
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold border-b-2 border-black pb-1 mb-2">{title}</h3>
      {children}
    </div>
  )
}

function Unit({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-b border-gray-200 py-1">
      <span className="font-mono font-bold">{k}</span> = {v}
    </div>
  )
}
