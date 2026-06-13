import InfoTip from './InfoTip'
import { formatMonth } from '../lib/data'
import type { SortKey } from '../lib/types'

interface ControlsProps {
  role: string
  setRole: (r: string) => void
  sortKey: SortKey
  setSortKey: (s: SortKey) => void
  search: string
  setSearch: (s: string) => void
  monthRange: [number, number]
  setMonthRange: (r: [number, number]) => void
  allMonths: string[]
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'worst_sustained', label: 'Worst on average' },
  { value: 'worst_single', label: 'Worst single month' },
  { value: 'biggest_impact', label: 'Most people affected' },
]

export default function Controls({
  role, setRole, sortKey, setSortKey, search, setSearch,
  monthRange, setMonthRange, allMonths,
}: ControlsProps) {
  const [start, end] = monthRange
  const totalMonths = allMonths.length

  return (
    <div
      className="card p-4 sm:p-5 flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-5 sm:items-end mb-6"
      role="group"
      aria-label="Dashboard filters"
    >
      {/* Role toggle */}
      <fieldset className="w-full sm:w-auto">
        <legend className="eyebrow mb-2 flex items-center gap-1.5">
          Direction
          <InfoTip label="Remitter vs Beneficiary">
            <strong className="text-white">Sending</strong> = the bank of the person paying.{' '}
            <strong className="text-white">Receiving</strong> = the bank getting the money. A bank can be great at one
            and poor at the other.
          </InfoTip>
        </legend>
        <div className="flex rounded-xl bg-surface-sunken p-1 border border-line">
          {[
            { key: 'remitter', label: 'Sending money' },
            { key: 'beneficiary', label: 'Receiving money' },
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                role === r.key ? 'bg-surface text-upi-orange shadow-card' : 'text-ink-soft hover:text-ink'
              }`}
              aria-pressed={role === r.key}
            >
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Sort */}
      <div className="w-full sm:w-auto">
        <label htmlFor="sort-key" className="eyebrow mb-2 block">Rank by</label>
        <select
          id="sort-key"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="w-full sm:w-auto bg-surface border border-line text-ink text-sm font-medium rounded-xl px-3 py-2 focus:border-upi-orange outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="w-full sm:w-auto">
        <label htmlFor="bank-search" className="eyebrow mb-2 block">Find a bank</label>
        <input
          id="bank-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. SBI, HDFC…"
          className="w-full sm:w-44 bg-surface border border-line text-ink text-sm rounded-xl px-3 py-2 focus:border-upi-orange outline-none placeholder:text-ink-faint"
          aria-label="Search bank by name"
        />
      </div>

      {/* Month range */}
      {totalMonths > 1 && (
        <div className="w-full sm:flex-1">
          <div className="eyebrow mb-2 flex justify-between items-center">
            <span>Time window</span>
            <span className="text-ink-soft font-mono normal-case tracking-normal text-xs">
              {formatMonth(allMonths[start])} → {formatMonth(allMonths[end])}
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <input
              type="range"
              min={0}
              max={totalMonths - 1}
              value={start}
              onChange={(e) => { const v = Number(e.target.value); if (v < end) setMonthRange([v, end]) }}
              className="w-full"
              aria-label="Start month"
            />
            <input
              type="range"
              min={0}
              max={totalMonths - 1}
              value={end}
              onChange={(e) => { const v = Number(e.target.value); if (v > start) setMonthRange([start, v]) }}
              className="w-full"
              aria-label="End month"
            />
          </div>
        </div>
      )}
    </div>
  )
}
