import { Routes, Route, NavLink, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Overview from './pages/Overview'
import ReliabilityMap from './pages/ReliabilityMap'
import BankDetail from './pages/BankDetail'
import Compare from './pages/Compare'
import About from './pages/About'
import Logo from './components/Logo'
import ThemeToggle from './components/ThemeToggle'
import { useData } from './lib/useData'
import type { BankEntry, SortKey } from './lib/types'

const NAV = [
  { to: '/', label: 'Overview', exact: true },
  { to: '/map', label: 'Reliability Map' },
  { to: '/compare', label: 'Compare' },
  { to: '/about', label: 'How it works' },
]

export default function App() {
  const { banks, meta, loading, error } = useData()
  const location = useLocation()
  const [role, setRole] = useState<string>('remitter')
  const [sortKey, setSortKey] = useState<SortKey>('worst_sustained')
  const [search, setSearch] = useState('')
  const [monthRange, setMonthRange] = useState<[number, number]>([0, 17])
  const [selectedBank, setSelectedBank] = useState<BankEntry | null>(null)
  const [compareList, setCompareList] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  const allMonths = meta?.months ?? []
  const filteredBanks = banks
    .filter((b) => b.role === role)
    .filter((b) => search === '' || b.bank.toLowerCase().includes(search.toLowerCase()))
    .filter((b) => {
      const [start, end] = monthRange
      const availMonths = allMonths.slice(start, end + 1)
      return b.series.some((s) => availMonths.includes(s.month))
    })
    .sort((a, b) => {
      if (sortKey === 'worst_sustained') return b.stats.mean_td - a.stats.mean_td
      if (sortKey === 'worst_single') return b.stats.max_td - a.stats.max_td
      return b.stats.impact_score - a.stats.impact_score
    })

  const sharedProps = {
    banks: filteredBanks,
    allBanks: banks,
    meta,
    loading,
    error,
    role,
    setRole,
    sortKey,
    setSortKey,
    search,
    setSearch,
    monthRange,
    setMonthRange,
    allMonths,
    selectedBank,
    setSelectedBank,
    compareList,
    setCompareList,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass-nav">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-2.5 shrink-0 group"
            onClick={() => setMenuOpen(false)}
          >
            <Logo size={30} />
            <div className="leading-none">
              <div className="font-display font-bold text-[14px] sm:text-[15px] text-ink tracking-tight">
                UPI Reliability
              </div>
              <div className="text-[10px] text-ink-faint font-medium hidden sm:block tracking-wide">
                NPCI public data · bank-by-bank
              </div>
            </div>
          </Link>

          <ul className="hidden sm:flex gap-0.5" role="list">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.exact}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-upi-orange/12 text-upi-orange-deep'
                        : 'text-ink-soft hover:text-ink hover:bg-surface-sunken/60'
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeToggle />

            <button
              className="sm:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-xl hover:bg-surface-sunken/60 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.18 }}
                className="block h-0.5 w-5 bg-ink-soft rounded-full"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.14 }}
                className="block h-0.5 w-5 bg-ink-soft rounded-full"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.18 }}
                className="block h-0.5 w-5 bg-ink-soft rounded-full"
              />
            </button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              id="mobile-nav"
              key="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="sm:hidden overflow-hidden"
              style={{ borderTop: '1px solid var(--glass-border)', background: 'rgb(var(--paper) / 0.96)' }}
            >
              <ul className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1" role="list">
                {NAV.map((n) => (
                  <li key={n.to}>
                    <NavLink
                      to={n.to}
                      end={n.exact}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-upi-orange/12 text-upi-orange-deep'
                            : 'text-ink-soft hover:text-ink hover:bg-surface-sunken/60'
                        }`
                      }
                    >
                      {n.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes>
            <Route path="/" element={<Overview {...sharedProps} />} />
            <Route path="/map" element={<ReliabilityMap {...sharedProps} />} />
            <Route path="/bank/:bankName" element={<BankDetail {...sharedProps} />} />
            <Route path="/compare" element={<Compare {...sharedProps} />} />
            <Route path="/about" element={<About meta={meta} />} />
          </Routes>
        </motion.div>
      </main>

      <footer style={{ borderTop: '1px solid var(--glass-border)' }} className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint">
          <div className="flex items-center gap-2">
            <Logo size={22} animated={false} />
            <span>Data: {meta?.source ?? 'NPCI UPI Ecosystem Statistics'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Updated {meta?.last_updated ?? '—'}</span>
            <span className="hidden sm:inline">·</span>
            <span>Static site · no tracking · ₹0 to run</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
