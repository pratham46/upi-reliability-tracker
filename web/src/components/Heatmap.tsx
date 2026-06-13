import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { tdColor, tdLabel, tdPlain, formatMonth, classificationColor, classificationIcon } from '../lib/data'
import type { BankEntry } from '../lib/types'

interface HeatmapProps {
  banks: BankEntry[]
  months: string[]
  onBankClick: (bank: BankEntry) => void
}

const CELL_W = 46
const CELL_H = 38
const LABEL_W = 186
const HEADER_H = 34
const PAD = 6

interface Hover {
  bank: string
  month: string
  td: number | null
}

export default function Heatmap({ banks, months, onBankClick }: HeatmapProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<Hover | null>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  if (banks.length === 0 || months.length === 0) {
    return <p className="text-ink-faint text-sm py-10 text-center">No data to display for this filter.</p>
  }

  const totalW = LABEL_W + months.length * CELL_W + PAD * 2
  const totalH = HEADER_H + banks.length * CELL_H + PAD

  return (
    <div className="relative">
      {/* Mobile scroll hint */}
      <p className="sm:hidden text-xs text-ink-faint mb-2 flex items-center gap-1">
        <span aria-hidden="true">←</span> Scroll to see all months · Tap a row for details
      </p>

      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-thin rounded-xl"
        onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
        tabIndex={0}
        aria-label="Bank reliability heatmap — rows are banks, columns are months, color shows how often the bank's own systems failed"
      >
        <svg
          width={totalW}
          height={totalH}
          style={{ display: 'block', minWidth: totalW }}
          role="img"
          aria-label="Heatmap of UPI technical failures per bank per month"
        >
          {/* Month header */}
          {months.map((m, mi) => (
            <text
              key={m}
              x={LABEL_W + mi * CELL_W + CELL_W / 2}
              y={HEADER_H - 8}
              textAnchor="middle"
              fontSize={9}
              className="fill-ink-faint"
              fontFamily="JetBrains Mono, monospace"
            >
              {formatMonth(m)}
            </text>
          ))}

          {/* Rows */}
          {banks.map((bank, bi) => {
            const y = HEADER_H + bi * CELL_H
            const tdByMonth: Record<string, number | null> = {}
            bank.series.forEach((s) => { tdByMonth[s.month] = s.td_pct })
            const cColor = classificationColor(bank.stats.classification)

            return (
              <g
                key={`${bank.bank}-${bank.role}`}
                role="row"
                aria-label={`${bank.bank}: click for details`}
                style={{ cursor: 'pointer' }}
                onClick={() => onBankClick(bank)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onBankClick(bank) }}
              >
                {/* row hover background */}
                <rect x={0} y={y} width={totalW} height={CELL_H} fill="transparent" className="hover:fill-surface-sunken" />
                {/* classification marker */}
                <text x={10} y={y + CELL_H / 2 + 4} fontSize={12} fill={cColor}>{classificationIcon(bank.stats.classification)}</text>
                {/* Bank label */}
                <text
                  x={28}
                  y={y + CELL_H / 2 + 4}
                  fontSize={12}
                  className="fill-ink"
                  fontFamily="Hanken Grotesk, sans-serif"
                  fontWeight={500}
                >
                  {bank.bank.length > 23 ? bank.bank.slice(0, 21) + '…' : bank.bank}
                </text>

                {/* Cells */}
                {months.map((m, mi) => {
                  const td = tdByMonth[m] ?? null
                  const color = tdColor(td)
                  const cx = LABEL_W + mi * CELL_W
                  return (
                    <motion.g
                      key={m}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (bi * months.length + mi) * 0.004, duration: 0.3 }}
                      style={{ transformOrigin: `${cx + CELL_W / 2}px ${y + CELL_H / 2}px` }}
                      onMouseEnter={() => setHover({ bank: bank.bank, month: m, td })}
                      onMouseLeave={() => setHover(null)}
                    >
                      <rect
                        x={cx + 2}
                        y={y + 3}
                        width={CELL_W - 4}
                        height={CELL_H - 6}
                        rx={6}
                        fill={color}
                        fillOpacity={td === null ? 0.18 : 0.92}
                        role="cell"
                        aria-label={`${bank.bank}, ${m}: ${td !== null ? td.toFixed(2) + '% failures' : 'no data'} (${tdLabel(td)})`}
                      />
                      {td !== null && (
                        <text
                          x={cx + CELL_W / 2}
                          y={y + CELL_H / 2 + 4}
                          textAnchor="middle"
                          fontSize={9.5}
                          fill={td >= 1.5 ? '#fff' : '#143018'}
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight={600}
                          pointerEvents="none"
                        >
                          {td.toFixed(1)}
                        </text>
                      )}
                    </motion.g>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Viewport-fixed tooltip — works even when SVG is scrolled horizontally */}
      {hover && (
        <div
          className="pointer-events-none fixed z-50 w-52 rounded-xl bg-upi-ink px-3 py-2 text-white shadow-lift"
          style={{
            left: Math.min(cursor.x + 16, window.innerWidth - 224),
            top: Math.min(cursor.y + 16, window.innerHeight - 120),
          }}
        >
          <div className="text-xs font-semibold">{hover.bank}</div>
          <div className="text-[11px] text-white/60">{formatMonth(hover.month)}</div>
          <div className="mt-1 text-sm font-mono" style={{ color: tdColor(hover.td) }}>
            {hover.td !== null ? `${hover.td.toFixed(2)}% failed` : 'No data'}
          </div>
          <div className="mt-1 text-[11px] leading-snug text-white/80">{tdPlain(hover.td)}</div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-ink-soft" aria-label="Color legend">
        <span className="eyebrow normal-case tracking-normal">Failure rate:</span>
        {[
          { color: '#12A150', label: 'Under 0.5% · Excellent' },
          { color: '#62B95C', label: 'Under 1% · Good' },
          { color: '#E5A50A', label: 'Under 1.5% · Fair' },
          { color: '#F2691C', label: 'Under 3% · Poor' },
          { color: '#DC2828', label: '3%+ · Critical' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded" style={{ background: color }} aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
