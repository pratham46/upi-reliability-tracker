import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Controls from '../components/Controls'
import ClassificationBadge from '../components/ClassificationBadge'
import BankAvatar from '../components/BankAvatar'
import InfoTip from '../components/InfoTip'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import { classificationColor, classificationIcon, tdLabel, tdPlain } from '../lib/data'
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
  setSelectedBank: (b: BankEntry | null) => void
}

interface WindowStats {
  mean_td: number
  std_td: number
  mean_vol: number
}

const QUADRANTS = [
  { x: 'left', y: 'top', label: 'Variable TD', sub: 'low avg, but erratic', color: '#6D4AFF' },
  { x: 'right', y: 'top', label: 'High TD', sub: 'elevated declines, erratic', color: '#DC2828' },
  { x: 'left', y: 'bottom', label: 'Rock solid', sub: 'low TD, steady', color: '#12A150' },
  { x: 'right', y: 'bottom', label: 'Elevated TD', sub: 'higher declines, consistent', color: '#F2691C' },
]

/** Compute mean TD, std TD, and mean volume from a bank's series filtered to visible months. */
function computeWindowStats(bank: BankEntry, visibleMonths: string[]): WindowStats {
  const pts = bank.series.filter((s) => visibleMonths.includes(s.month) && s.td_pct !== null)
  if (pts.length === 0) return { mean_td: 0, std_td: 0, mean_vol: 0 }
  const mean_td = pts.reduce((s, p) => s + (p.td_pct ?? 0), 0) / pts.length
  const variance = pts.reduce((s, p) => s + Math.pow((p.td_pct ?? 0) - mean_td, 2), 0) / pts.length
  const std_td = Math.sqrt(variance)
  const mean_vol = pts.reduce((s, p) => s + (p.volume_mn ?? 0), 0) / pts.length
  return { mean_td, std_td, mean_vol }
}

export default function ReliabilityMap(props: Props) {
  const { banks, loading, error, setSelectedBank } = props
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<BankEntry | null>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  // Visible months from current slider position — all hooks before early returns
  const visibleMonths = useMemo(
    () => props.allMonths.slice(props.monthRange[0], props.monthRange[1] + 1),
    [props.allMonths, props.monthRange],
  )

  // Re-compute scatter stats per bank for the selected window
  const windowStatsMap = useMemo(() => {
    const m = new Map<string, WindowStats>()
    banks.forEach((bank) => {
      m.set(`${bank.bank}|${bank.role}`, computeWindowStats(bank, visibleMonths))
    })
    return m
  }, [banks, visibleMonths])

  const getWS = (bank: BankEntry) =>
    windowStatsMap.get(`${bank.bank}|${bank.role}`) ?? { mean_td: 0, std_td: 0, mean_vol: 0 }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorBanner error={error} />

  const maxTD  = Math.max(...banks.map((b) => getWS(b).mean_td), 4)
  const maxStd = Math.max(...banks.map((b) => getWS(b).std_td), 2)
  const maxVol = Math.max(...banks.map((b) => getWS(b).mean_vol), 1)

  const W = 640, H = 440
  const PAD = { top: 36, right: 24, bottom: 56, left: 64 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const toSvgX = (td: number)  => PAD.left + (td / maxTD)  * innerW
  const toSvgY = (std: number) => PAD.top + innerH - (std / maxStd) * innerH
  const bubbleR = (vol: number) => 8 + (vol / maxVol) * 26

  const handleClick = (bank: BankEntry) => {
    setSelectedBank(bank)
    navigate(`/bank/${encodeURIComponent(bank.bank)}?role=${bank.role}`)
  }

  const hoveredWS = hovered ? getWS(hovered) : null

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-3xl text-ink mb-2 flex items-center gap-2">
          The reliability map
          <InfoTip label="How to read this chart">
            Every bubble is a bank. <strong className="text-white">Further left = lower TD rate.</strong>{' '}
            Lower down = more consistent. Bigger bubble = higher volume. Positions update when you change the time window.
          </InfoTip>
        </h1>
        <p className="text-ink-soft text-sm max-w-2xl">
          Every bubble is a bank. The <strong className="text-ink">bottom-left</strong> corner represents banks with
          both low and stable TD rates. Bubble size reflects transaction volume. Positions reflect the selected time window.
        </p>
      </div>

      <Controls {...props} />

      <div className="card p-5 sm:p-6">
        <p className="sm:hidden text-xs text-ink-faint mb-3 flex items-center gap-1">
          <span aria-hidden="true">←</span> Scroll to see all banks · Tap a bubble for details
        </p>
        <div className="overflow-x-auto scrollbar-thin">
          <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            style={{ display: 'block', margin: '0 auto', minWidth: 560 }}
            aria-label="Scatter plot: horizontal axis is average TD rate, vertical axis is how erratic the bank is"
            role="img"
          >
            {/* Quadrant backgrounds */}
            <rect x={PAD.left} y={PAD.top} width={innerW / 2} height={innerH / 2} fill="#6D4AFF" fillOpacity="0.05" />
            <rect x={PAD.left + innerW / 2} y={PAD.top} width={innerW / 2} height={innerH / 2} fill="#DC2828" fillOpacity="0.05" />
            <rect x={PAD.left} y={PAD.top + innerH / 2} width={innerW / 2} height={innerH / 2} fill="#12A150" fillOpacity="0.06" />
            <rect x={PAD.left + innerW / 2} y={PAD.top + innerH / 2} width={innerW / 2} height={innerH / 2} fill="#F2691C" fillOpacity="0.05" />

            {/* Quadrant labels */}
            {QUADRANTS.map((q) => (
              <g key={q.label}>
                <text
                  x={q.x === 'left' ? PAD.left + 8 : PAD.left + innerW - 8}
                  y={q.y === 'top' ? PAD.top + 16 : PAD.top + innerH - 18}
                  textAnchor={q.x === 'left' ? 'start' : 'end'}
                  fontSize={12}
                  fill={q.color}
                  fontFamily="Bricolage Grotesque, sans-serif"
                  fontWeight="700"
                >
                  {q.label}
                </text>
                <text
                  x={q.x === 'left' ? PAD.left + 8 : PAD.left + innerW - 8}
                  y={q.y === 'top' ? PAD.top + 30 : PAD.top + innerH - 5}
                  textAnchor={q.x === 'left' ? 'start' : 'end'}
                  fontSize={9.5}
                  className="fill-ink-faint"
                  fontFamily="Hanken Grotesk, sans-serif"
                >
                  {q.sub}
                </text>
              </g>
            ))}

            {/* Mid grid lines */}
            <line x1={PAD.left + innerW / 2} y1={PAD.top} x2={PAD.left + innerW / 2} y2={PAD.top + innerH} className="stroke-line-strong" strokeWidth={1} strokeDasharray="4,5" />
            <line x1={PAD.left} y1={PAD.top + innerH / 2} x2={PAD.left + innerW} y2={PAD.top + innerH / 2} className="stroke-line-strong" strokeWidth={1} strokeDasharray="4,5" />

            {/* Axes */}
            <line x1={PAD.left} y1={PAD.top + innerH} x2={PAD.left + innerW} y2={PAD.top + innerH} className="stroke-line-strong" strokeWidth={1.5} />
            <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + innerH} className="stroke-line-strong" strokeWidth={1.5} />

            {[0, 1, 2, 3, 4].filter((v) => v <= maxTD).map((v) => (
              <text key={v} x={toSvgX(v)} y={PAD.top + innerH + 18} textAnchor="middle" fontSize={10} className="fill-ink-faint" fontFamily="JetBrains Mono, monospace">{v}%</text>
            ))}
            {[0, 0.5, 1.0, 1.5].filter((v) => v <= maxStd).map((v) => (
              <text key={v} x={PAD.left - 8} y={toSvgY(v) + 4} textAnchor="end" fontSize={10} className="fill-ink-faint" fontFamily="JetBrains Mono, monospace">{v.toFixed(1)}</text>
            ))}

            <text x={PAD.left + innerW / 2} y={H - 6} textAnchor="middle" fontSize={11} className="fill-ink-soft" fontWeight="600">← fails less often · fails more often →</text>
            <text x={18} y={PAD.top + innerH / 2} textAnchor="middle" fontSize={11} className="fill-ink-soft" fontWeight="600" transform={`rotate(-90,18,${PAD.top + innerH / 2})`}>← steady · erratic →</text>

            {/* Bubbles — positioned from window-computed stats */}
            {banks.map((bank) => {
              const ws    = getWS(bank)
              const cx    = toSvgX(ws.mean_td)
              const cy    = toSvgY(ws.std_td)
              const r     = bubbleR(ws.mean_vol)
              const color = classificationColor(bank.stats.classification)
              const icon  = classificationIcon(bank.stats.classification)
              return (
                <motion.g
                  key={`${bank.bank}-${bank.role}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  style={{ cursor: 'pointer', transformOrigin: `${cx}px ${cy}px` }}
                  onClick={() => handleClick(bank)}
                  onMouseEnter={() => setHovered(bank)}
                  onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setHovered(null)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleClick(bank) }}
                  role="button"
                  aria-label={`${bank.bank}: avg TD ${ws.mean_td.toFixed(2)}% in selected window, ${tdLabel(ws.mean_td)}`}
                >
                  <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={hovered === bank ? 0.4 : 0.22} stroke={color} strokeWidth={hovered === bank ? 2.5 : 1.5} />
                  <text x={cx} y={cy + 4} textAnchor="middle" fontSize={12} fill={color} fontWeight="bold" pointerEvents="none">{icon}</text>
                </motion.g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-ink-soft justify-center" aria-label="Chart legend">
          {['rock_solid', 'chronically_weak', 'one_off_incident', 'volatile'].map((c) => (
            <span key={c} className="flex items-center gap-1.5" style={{ color: classificationColor(c) }}>
              <span aria-hidden="true">{classificationIcon(c)}</span>
              <span className="font-medium">{({ rock_solid: 'Rock solid', chronically_weak: 'Recurring Declines', one_off_incident: 'Isolated Incident', volatile: 'Variable Pattern' } as Record<string, string>)[c]}</span>
            </span>
          ))}
          <span className="text-ink-faint">Bubble size = payment volume</span>
        </div>
      </div>

      {/* Viewport-anchored tooltip */}
      <AnimatePresence>
        {hovered && hoveredWS && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.14 }}
            className="fixed z-50 pointer-events-none w-60 card p-3.5 shadow-lift"
            style={{
              left: Math.min(cursor.x + 16, window.innerWidth - 256),
              top: Math.min(cursor.y + 16, window.innerHeight - 180),
            }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <BankAvatar name={hovered.bank} size={32} />
              <div className="font-semibold text-sm text-ink leading-tight">{hovered.bank}</div>
            </div>
            <ClassificationBadge c={hovered.stats.classification} />
            <p className="text-xs text-ink-soft mt-2 leading-snug">{tdPlain(hoveredWS.mean_td)}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-ink-faint">
              <div>Avg TD: <span className="text-ink font-mono">{hoveredWS.mean_td.toFixed(2)}%</span></div>
              <div>Volume: <span className="text-ink font-mono">{hoveredWS.mean_vol.toFixed(0)}M</span></div>
            </div>
            <p className="text-[10px] text-upi-orange-deep mt-2 font-semibold">Click for the full story →</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
