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
      className="card-interactive p-4 cursor-pointer"
      onClick={go}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') go() }}
      aria-label={`${bank.bank} — fails ${stats.mean_td.toFixed(2)}% of the time on average, ${tdLabel(stats.mean_td)}`}
      role="article"
    >
      <div className="flex items-center gap-3 mb-3">
        {rank !== undefined && (
          <span className="font-mono text-xs text-ink-faint w-5 shrink-0">{String(rank + 1).padStart(2, '0')}</span>
        )}
        <BankAvatar name={bank.bank} size={38} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm text-ink truncate">{bank.bank}</div>
          <div className="text-[11px] text-ink-faint capitalize">
            {bank.role === 'remitter' ? 'when sending' : 'when receiving'}
          </div>
        </div>
        <ClassificationBadge c={stats.classification} />
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-2xl" style={{ color }}>{stats.mean_td.toFixed(2)}%</span>
            <span className="text-xs font-semibold" style={{ color }}>{tdLabel(stats.mean_td)}</span>
          </div>
          <div className="text-[11px] text-ink-faint">of payments fail (bank's fault), on average</div>
        </div>
        <Sparkline values={bank.series.map((s) => s.td_pct)} />
      </div>

      <div className="mt-3 pt-3 border-t border-line grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="font-mono text-sm font-semibold text-ink">{stats.max_td.toFixed(1)}%</div>
          <div className="text-[10px] text-ink-faint">worst month</div>
        </div>
        <div>
          <div className="font-mono text-sm font-semibold" style={{ color: trendColor(stats.trend) }}>
            {trendIcon(stats.trend)} <span className="capitalize">{stats.trend}</span>
          </div>
          <div className="text-[10px] text-ink-faint">direction</div>
        </div>
        <div>
          <div className="font-mono text-sm font-semibold text-ink">{stats.impact_score.toFixed(2)}M</div>
          <div className="text-[10px] text-ink-faint">people/mo hit</div>
        </div>
      </div>
    </motion.article>
  )
}
