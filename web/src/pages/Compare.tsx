import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import Controls from '../components/Controls'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import ClassificationBadge from '../components/ClassificationBadge'
import BankAvatar from '../components/BankAvatar'
import { formatMonth, tdColor, trendIcon, trendColor } from '../lib/data'
import { useTheme, chartTheme } from '../lib/useTheme'
import type { BankEntry, Meta, SortKey } from '../lib/types'

interface Props {
  banks: BankEntry[]
  meta: Meta | null
  loading: boolean
  error: string | null
  role: string
  setRole: (r: string) => void
  sortKey: SortKey
  setSortKey: (s: SortKey) => void
  search: string
  setSearch: (s: string) => void
  monthRange: [number, number]
  setMonthRange: (r: [number, number]) => void
  allMonths: string[]
  compareList: string[]
  setCompareList: (l: string[]) => void
  setSelectedBank: (b: BankEntry | null) => void
}

const PALETTE = ['#FF6A1A', '#12A150', '#6D4AFF']

export default function Compare(props: Props) {
  const { banks, loading, error, compareList, setCompareList } = props
  const [localSearch, setLocalSearch] = useState('')
  const { theme } = useTheme()

  const uniqueBankNames = Array.from(new Set(banks.map((b) => b.bank)))
  const filtered = uniqueBankNames.filter((n) => localSearch === '' || n.toLowerCase().includes(localSearch.toLowerCase()))

  const toggle = (name: string) => {
    if (compareList.includes(name)) setCompareList(compareList.filter((n) => n !== name))
    else if (compareList.length < 3) setCompareList([...compareList, name])
  }

  const selectedBanks = compareList.map((name) => banks.find((b) => b.bank === name)).filter(Boolean) as BankEntry[]

  const allMonths = props.allMonths
  const [start, end] = props.monthRange
  const visibleMonths = allMonths.slice(start, end + 1)

  const chartData = useMemo(() => {
    return visibleMonths.map((m) => {
      const row: Record<string, string | number | null> = { month: formatMonth(m) }
      selectedBanks.forEach((bank) => {
        const point = bank.series.find((s) => s.month === m)
        row[bank.bank] = point?.td_pct ?? null
      })
      return row
    })
  }, [selectedBanks, visibleMonths])

  // All hooks above this line — safe to early-return now.
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorBanner error={error} />

  const c = chartTheme(theme)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-3xl text-ink mb-2">Compare banks side by side</h1>
        <p className="text-ink-soft text-sm">Pick up to 3 banks and see whose payments fail more often, month by month. Lower line = more reliable.</p>
      </div>

      <Controls {...props} />

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Picker */}
        <div className="card p-4 lg:col-span-1">
          <h2 className="eyebrow mb-3">Pick banks ({compareList.length}/3)</h2>
          <input
            type="search"
            placeholder="Filter…"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-surface border border-line text-ink text-sm rounded-xl px-3 py-2 mb-3 focus:border-upi-orange outline-none placeholder:text-ink-faint"
            aria-label="Filter banks for comparison"
          />
          <ul className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin" role="listbox" aria-multiselectable="true" aria-label="Bank selection list">
            {filtered.map((name) => {
              const selected = compareList.includes(name)
              const idx = compareList.indexOf(name)
              const color = selected ? PALETTE[idx] : undefined
              return (
                <li key={name}>
                  <button
                    onClick={() => toggle(name)}
                    disabled={!selected && compareList.length >= 3}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-sm transition-colors flex items-center gap-2.5 ${
                      selected ? 'bg-upi-orange/8 text-ink font-medium' : 'text-ink-soft hover:bg-surface-sunken disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                    aria-selected={selected}
                    role="option"
                  >
                    <span className="w-3.5 h-3.5 rounded-full border-2 shrink-0" style={{ borderColor: color ?? '#D9D2C2', backgroundColor: selected ? color : 'transparent' }} aria-hidden="true" />
                    {name}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Chart */}
        <div className="card p-5 lg:col-span-2">
          {selectedBanks.length === 0 ? (
            <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center gap-2">
              <span className="text-4xl" aria-hidden="true">📊</span>
              <p className="text-ink-soft text-sm">Pick at least one bank on the left to start comparing.</p>
            </div>
          ) : (
            <>
              <h2 className="font-display font-bold text-base text-ink mb-1">Failure rate over time</h2>
              <p className="text-xs text-ink-soft mb-4">Each line is one bank. The lower it sits, the more reliable that bank is.</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3,3" stroke={c.grid} />
                  <XAxis dataKey="month" tick={{ fill: c.axis, fontSize: 10 }} stroke={c.grid} />
                  <YAxis tick={{ fill: c.axis, fontSize: 10 }} tickFormatter={(v) => `${v}%`} stroke={c.grid} />
                  <Tooltip
                    contentStyle={c.tooltip}
                    formatter={(v: number) => (v != null ? `${v.toFixed(2)}% failed` : 'No data')}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  {selectedBanks.map((bank, i) => (
                    <Line key={bank.bank} type="monotone" dataKey={bank.bank} stroke={PALETTE[i]} strokeWidth={2.5} dot={{ fill: PALETTE[i], r: 3 }} connectNulls={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>

      {/* Stat cards */}
      {selectedBanks.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-3 gap-4" aria-label="Comparison stat cards">
          {selectedBanks.map((bank, i) => (
            <div key={bank.bank} className="card p-4 border-t-4" style={{ borderTopColor: PALETTE[i] }}>
              <div className="flex items-center gap-2.5 mb-3">
                <BankAvatar name={bank.bank} size={36} />
                <span className="font-semibold text-sm text-ink">{bank.bank}</span>
              </div>
              <ClassificationBadge c={bank.stats.classification} />
              <div className="mt-3 space-y-1.5 text-sm">
                <Row label="Typical failures" value={`${bank.stats.mean_td.toFixed(2)}%`} color={tdColor(bank.stats.mean_td)} />
                <Row label="Worst month" value={`${bank.stats.max_td.toFixed(2)}%`} />
                <Row label="Direction" value={`${trendIcon(bank.stats.trend)} ${bank.stats.trend}`} color={trendColor(bank.stats.trend)} />
                <Row label="People hit/mo" value={`${bank.stats.impact_score.toFixed(2)}M`} />
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-soft">{label}</span>
      <span className="font-mono font-medium capitalize" style={{ color: color ?? '#181B24' }}>{value}</span>
    </div>
  )
}
