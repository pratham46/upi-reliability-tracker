import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { motion } from 'framer-motion'
import ClassificationBadge from '../components/ClassificationBadge'
import BankAvatar from '../components/BankAvatar'
import InfoTip from '../components/InfoTip'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import { tdColor, tdLabel, tdPlain, formatMonth, trendIcon, trendColor, trendPlain, classificationPlain } from '../lib/data'
import { useTheme, chartTheme } from '../lib/useTheme'
import type { BankEntry, Meta } from '../lib/types'

interface Props {
  allBanks: BankEntry[]
  meta: Meta | null
  loading: boolean
  error: string | null
}

export default function BankDetail({ allBanks, loading, error }: Props) {
  const { bankName } = useParams<{ bankName: string }>()
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const role = sp.get('role') ?? 'remitter'

  const bank = useMemo(
    () => allBanks.find((b) => b.bank === decodeURIComponent(bankName ?? '') && b.role === role),
    [allBanks, bankName, role]
  )

  const c = chartTheme(theme)

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorBanner error={error} />
  if (!bank) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-soft text-lg mb-4">We couldn’t find that bank.</p>
        <button onClick={() => navigate(-1)} className="text-upi-orange-deep font-semibold hover:underline text-sm">← Go back</button>
      </div>
    )
  }

  const { stats, series } = bank
  const color = tdColor(stats.mean_td)

  const chartData = series.map((s) => ({
    month: formatMonth(s.month),
    td: s.td_pct,
    bd: s.bd_pct,
    vol: s.volume_mn,
  }))

  const outageMonths = series
    .filter((s) => s.td_pct !== null && s.td_pct >= 3 * stats.mean_td && s.td_pct > 4)
    .map((s) => formatMonth(s.month))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-7">
      <button onClick={() => navigate(-1)} className="text-ink-soft hover:text-upi-orange-deep text-sm font-medium" aria-label="Go back">
        ← Back
      </button>

      {/* Header */}
      <div className="card p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <BankAvatar name={bank.bank} size={64} />
        <div className="flex-1">
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h1 className="font-display font-extrabold text-2xl text-ink">{bank.bank}</h1>
            <ClassificationBadge c={stats.classification} withTip />
            <span className="chip bg-surface-sunken text-ink-soft border border-line">
              {bank.role === 'remitter' ? 'when sending money' : 'when receiving money'}
            </span>
          </div>
          <p className="text-ink-soft text-sm max-w-xl">{classificationPlain(stats.classification)} {tdPlain(stats.mean_td)}</p>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Typical failure rate', tip: 'How often the bank’s own systems fail, averaged across months. Not your wrong PIN — the bank breaking.', value: stats.mean_td.toFixed(2) + '%', sub: tdLabel(stats.mean_td), color },
          { label: 'Worst month', tip: 'The single highest failure rate this bank hit in the data.', value: stats.max_td.toFixed(2) + '%', sub: 'peak failures', color: '#F2691C' },
          { label: 'Direction', tip: 'Whether the bank is getting better or worse over time.', value: trendIcon(stats.trend), sub: stats.trend, color: trendColor(stats.trend) },
          { label: 'People affected', tip: 'Roughly how many million payments fail each month because of this bank — failure rate × how many it handles.', value: stats.impact_score.toFixed(2) + 'M', sub: 'per month', color: '#6D4AFF' },
        ].map((item) => (
          <div key={item.label} className="card p-4 text-center">
            <div className="font-display font-extrabold text-2xl" style={{ color: item.color }}>{item.value}</div>
            <div className="text-xs text-ink-soft mt-1 flex items-center justify-center gap-1">
              {item.label}
              <InfoTip label={item.label}>{item.tip}</InfoTip>
            </div>
            <div className="text-[10px] capitalize font-semibold" style={{ color: item.color }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Plain summary */}
      <div className="card-sunken p-5 flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">💡</span>
        <p className="text-sm text-ink leading-relaxed">
          <strong>In plain English:</strong> when you {bank.role === 'remitter' ? 'pay from' : 'receive into'} {bank.bank},
          about <strong style={{ color }}>{stats.mean_td.toFixed(1)} in every 100</strong> payments fail because of the bank’s
          own systems. {trendPlain(stats.trend)}
        </p>
      </div>

      {/* TD trend */}
      <section className="card p-5 sm:p-6" aria-label="Failure rate over time">
        <h2 className="font-display font-bold text-lg text-ink mb-1 flex items-center gap-2">
          Failure rate, month by month
          <InfoTip label="About this chart">Each point is one month. Lower is better. The dotted red line marks a major outage month.</InfoTip>
        </h2>
        <p className="text-sm text-ink-soft mb-5">How often the bank’s systems failed. ▲ marks a standout bad month.</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3,3" stroke={c.grid} />
            <XAxis dataKey="month" tick={{ fill: c.axis, fontSize: 10 }} stroke={c.grid} />
            <YAxis tick={{ fill: c.axis, fontSize: 10 }} tickFormatter={(v) => `${v}%`} stroke={c.grid} />
            <Tooltip contentStyle={c.tooltip} formatter={(v: number) => [`${v?.toFixed(2)}% failed`, 'Bank’s fault']} />
            {outageMonths.map((m) => (
              <ReferenceLine key={m} x={m} stroke="#DC2828" strokeDasharray="4,4" label={{ value: '▲', fill: '#DC2828', fontSize: 11 }} />
            ))}
            <Line type="monotone" dataKey="td" stroke={color} strokeWidth={2.5} dot={{ fill: color, r: 3 }} activeDot={{ r: 6 }} name="Failure rate %" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* BD vs TD */}
      <section className="card p-5 sm:p-6" aria-label="Bank's fault vs your situation">
        <h2 className="font-display font-bold text-lg text-ink mb-1 flex items-center gap-2">
          Whose “fault” were the failures?
          <InfoTip label="Two kinds of failure">Red = the bank broke (its fault). Amber = your situation (wrong PIN, low balance). We only judge banks on the red.</InfoTip>
        </h2>
        <p className="text-sm text-ink-soft mb-5">Red is the bank’s fault. Amber is user-side (wrong PIN, low balance). Stacked = total failures.</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3,3" stroke={c.grid} />
            <XAxis dataKey="month" tick={{ fill: c.axis, fontSize: 10 }} stroke={c.grid} />
            <YAxis tick={{ fill: c.axis, fontSize: 10 }} tickFormatter={(v) => `${v}%`} stroke={c.grid} />
            <Tooltip contentStyle={c.tooltip} formatter={(v: number) => [`${v?.toFixed(2)}%`]} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Area type="monotone" dataKey="bd" stackId="1" stroke="#E5A50A" fill="#E5A50A" fillOpacity={0.28} name="Your situation (BD)" />
            <Area type="monotone" dataKey="td" stackId="1" stroke="#DC2828" fill="#DC2828" fillOpacity={0.38} name="Bank’s fault (TD)" />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      {/* Volume */}
      <section className="card p-5 sm:p-6" aria-label="Monthly payment volume">
        <h2 className="font-display font-bold text-lg text-ink mb-1 flex items-center gap-2">
          How many payments it handles
          <InfoTip label="Why volume matters">A big bank failing 1% of the time hurts more people than a small one failing 5%. Volume is why “impact” matters.</InfoTip>
        </h2>
        <p className="text-sm text-ink-soft mb-5">Bigger bars = more payments, so the same failure rate hurts more people.</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3,3" stroke={c.grid} />
            <XAxis dataKey="month" tick={{ fill: c.axis, fontSize: 10 }} stroke={c.grid} />
            <YAxis tick={{ fill: c.axis, fontSize: 10 }} tickFormatter={(v) => `${v}M`} stroke={c.grid} />
            <Tooltip contentStyle={c.tooltip} formatter={(v: number) => [`${v?.toFixed(1)}M payments`, 'Volume']} />
            <Bar dataKey="vol" fill="#FF6A1A" fillOpacity={0.85} name="Payments (millions)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </motion.div>
  )
}
