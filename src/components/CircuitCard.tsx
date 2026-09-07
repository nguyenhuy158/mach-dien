import { SIM, SHOP, isNaPart, nrm } from '../data/circuits'
import type { Circuit } from '../data/circuits'
import { PriceCell, Thumb } from './Parts'
import { SimButton } from './SimButton'

interface Props {
  c: Circuit
  flash?: boolean
}

export function CircuitCard({ c, flash }: Props) {
  const simUrl = SIM[`${c.l}-${c.n}`]
  const anyNa = c.parts.some(p => isNaPart(p[0]))
  const searchBlob = (
    c.name + ' ' + c.goal + ' ' + c.parts.map(p => p[0] + ' ' + p[1]).join(' ')
  ).toLowerCase()

  return (
    <article
      id={`m-${c.l}-${c.n}`}
      data-na={anyNa ? 1 : 0}
      data-l={c.l}
      data-s={nrm(searchBlob)}
      className={`card p-5 bg-[var(--color-card)] border border-[var(--color-border)] ${flash ? 'flash' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="num font-mono text-sm font-bold text-[var(--color-muted)]">
          {c.l}.{c.n}
        </span>
        <h3 className="text-lg font-bold tracking-tight">{c.name}</h3>
      </div>
      <div className="goal text-sm text-[var(--color-muted)] mb-3">{c.goal}</div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            <th className="p-im w-12"></th>
            <th className="p-name">Linh kiện</th>
            <th className="p-spec">Thông số</th>
            <th className="p-qty text-center">SL</th>
            <th className="p-blk">banlinhkien</th>
            <th className="p-caka">caka.vn</th>
          </tr>
        </thead>
        <tbody>
          {c.parts.map((p, i) => {
            const s = SHOP[p[0]] || {}
            const isNa = !s.b && !s.c && !s.s
            return (
              <tr key={i} className={`border-t border-[var(--color-border)] ${isNa ? 'na-row' : ''}`}>
                <td className="im py-2">
                  <Thumb url={s.b?.u || s.c?.u} alt={s.b?.t || s.c?.t} />
                </td>
                <td className="p-name py-2 font-medium">{p[0]}</td>
                <td className="p-spec py-2 text-[var(--color-muted)] text-xs">{p[1]}</td>
                <td className="p-qty py-2 text-center">{p[2]}</td>
                <td className="p-blk py-2">
                  {s.s ? <span className="nn">—</span> : <PriceCell entry={s.b} />}
                </td>
                <td className="p-caka py-2">
                  {s.s ? <span className="nn">—</span> : <PriceCell entry={s.c} />}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <img
        className="sch mt-4 w-full max-w-2xl mx-auto block"
        src={`/svg/${c.l}-${c.n}.svg`}
        alt={`Sơ đồ ${c.l}.${c.n}`}
        loading="lazy"
        onError={e => (e.currentTarget.style.display = 'none')}
      />

      {simUrl && <SimButton sim={simUrl} />}

      {c.dia && <pre>{c.dia}</pre>}

      {c.fm && <div className="fm mt-3" dangerouslySetInnerHTML={{ __html: c.fm }} />}
      {c.note && <div className="fm mt-3" dangerouslySetInnerHTML={{ __html: c.note }} />}
      {c.warn && (
        <div className="warn mt-3 flex gap-2">
          <span className="font-bold">⚠</span>
          <span dangerouslySetInnerHTML={{ __html: c.warn }} />
        </div>
      )}
    </article>
  )
}
