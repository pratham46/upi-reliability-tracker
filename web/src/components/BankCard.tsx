import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tdColor, tdLabel, trendIcon, trendColor } from '../lib/data'
import ClassificationBadge from './ClassificationBadge'
import BankAvatar from './BankAvatar'
import Sparkline from './Sparkline'
import type { BankEntry } from '../lib/types'

export default function BankCard({ bank, rank }: { bank: BankEntry; rank?: number }) {
  const navigate = useNavigate()
  const { stats } = bank
  const color = tdColor(stats.mean_td)
  const go = () => navigate(`/bank/${encodeURIComponent(bank.bank)}?role=${bank.role}`)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="card-interactive p-4"
      onClick={go}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') go() }}
      aria-label={`${bank.bank} — fails ${stats.mean_td.toFixed(2)}% of the time on average, ${tdLabel(stats.mean_td)}`}
      role="article"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {rank !== undefined && (
          <span className="font-mono text-[11px] font-bold text-ink-faint w-5 shrink-0 tabular-nums">
            {String(rank + 1).padStart(2, '0')}
          </span>
        )}
        <BankAvatar name={bank.bank} size={36} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm text-ink truncate leading-tight">{bank.bank}</div>
          <div className="text-[11px] text-ink-faint capitalize mt-0.5">
            {bank.role === 'remitter' ? 'when sending' : 'when receiving'}
          </div>
        </div>
        <ClassificationBadge c={stats.classification} />
      </div>

      {/* Main stat */}
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <div
            className="font-display font-extrabold text-3xl tabular-nums leading-none"
            style={{ color, textShadow: `0 0 28px ${color}55, 0 0 56px ${color}1A` }}
          >
            {stats.mean_td.toFixed(2)}%
          </div>
          <div className="text-[11px] text-ink-faint mt-1.5">avg bank-fault failures</div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Sparkline values={bank.series.map((s) => s.td_pct)} width={96} height={32} />
          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>
            {tdLabel(stats.mean_td)}
          </span>
        </div>
      </div>

      {/* Footer stats */}
      <div
        className="grid grid-cols-3 rounded-xl overflow-hidden text-center"
        style={{
          background: 'rgb(var(--surface-sunken) / 0.55)',
          border: '1px solid rgb(var(--line) / 0.48)',
        }}
      >
        <div className="px-2 py-2.5" style={{ borderRight: '1px solid rgb(var(--line) / 0.48)' }}>
          <div className="font-mono text-sm font-bold text-ink tabular-nums">{stats.max_td.toFixed(1)}%</div>
          <div className="text-[9px] text-ink-faint uppercase tracking-wide mt-0.5">worst mo.</div>
        </div>
        <div className="px-2 py-2.5" style={{ borderRight: '1px solid rgb(var(--line) / 0.48)' }}>
          <div className="font-mono text-sm font-bold tabular-nums" style={{ color: trendColor(stats.trend) }}>
            {trendIcon(stats.trend)}
          </div>
          <div className="text-[9px] text-ink-faint uppercase tracking-wide mt-0.5 capitalize">{stats.trend}</div>
        </div>
        <div className="px-2 py-2.5">
          <div className="font-mono text-sm font-bold text-ink tabular-nums">{stats.impact_score.toFixed(1)}M</div>
          <div className="text-[9px] text-ink-faint uppercase tracking-wide mt-0.5">affected/mo</div>
        </div>
      </div>
    </motion.article>
  )
}
