import { OhmCalc } from './OhmCalc'
import { LedCalc } from './LedCalc'
import { DividerCalc } from './DividerCalc'
import { RcTauCalc } from './RcTauCalc'
import { RcFcCalc } from './RcFcCalc'
import { BjtCalc } from './BjtCalc'
import { OpAmpCalc } from './OpAmpCalc'
import { FiveFive55Calc } from './FiveFive55Calc'
import { FiveFive55MonoCalc } from './FiveFive55MonoCalc'
import { LdoCalc } from './LdoCalc'
import { PowerCalc } from './PowerCalc'
import { RParallelCalc } from './RParallelCalc'
import { RSeriesCalc } from './RSeriesCalc'
import { BatteryCalc } from './BatteryCalc'

interface Props { kind: string }

export function CalculatorPanel({ kind }: Props) {
  return (
    <div className="mt-3 p-4 rounded-xl bg-[var(--color-bg)] border-2 border-[color-mix(in_srgb,var(--color-acc)_30%,transparent)]">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-acc)] mb-2">🧮 Tính nhanh</div>
      {kind === 'ohm' && <OhmCalc />}
      {kind === 'led' && <LedCalc />}
      {kind === 'divider' && <DividerCalc />}
      {kind === 'rc-tau' && <RcTauCalc />}
      {kind === 'rc-fc' && <RcFcCalc />}
      {kind === 'bjt' && <BjtCalc />}
      {kind === 'opamp' && <OpAmpCalc />}
      {kind === '555' && <FiveFive55Calc />}
      {kind === '555-mono' && <FiveFive55MonoCalc />}
      {kind === 'ldo' && <LdoCalc />}
      {kind === 'power' && <PowerCalc />}
      {kind === 'r-parallel' && <RParallelCalc />}
      {kind === 'r-series' && <RSeriesCalc />}
      {kind === 'battery' && <BatteryCalc />}
    </div>
  )
}
