import { useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CountUp from '../components/CountUp'
import Controls from '../components/Controls'
import Heatmap from '../components/Heatmap'
import BankCard from '../components/BankCard'
import HeroArt from '../components/HeroArt'
import InfoTip from '../components/InfoTip'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
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

const CONCEPTS = [
  {
    accent: '#DC2828',
    abbr: 'TD',
    title: "Bank's fault",
    term: 'Technical Decline',
    body: "The bank's own systems broke — like an ATM that's out of order. Nothing you did. This is what we rank on.",
  },
  {
    accent: '#E5A50A',
    abbr: 'BD',
    title: 'Your situation',
    term: 'Business Decline',
    body: 'Wrong PIN, low balance, daily limit hit. Real failures, but not the bank breaking. We leave these out of the ranking.',
  },
  {
    accent: '#12A150',
    abbr: 'Σ×',
    title: 'How many people',
    term: 'Impact',
    body: 'A giant bank failing 1% of the time hurts far more people than a tiny one failing 5%. We weigh failures by size.',
  },
]

export default function Overview(props: Props) {
  const { banks, meta, loading, error, setSelectedBank } = props
  const navigate = useNavigate()

  const allMonths = meta?.months ?? []
  const [start, end] = props.monthRange
  const visibleMonths = allMonths.slice(start, end + 1)

  const weakCount = useMemo(
    () => banks.filter((b) => ['chronically_weak', 'one_off_incident'].includes(b.stats.classification)).length,
    [banks]
  )

  const totalTDShare = useMemo(() => {
    if (banks.length === 0) return 0
    const totalImpact = banks.reduce((s, b) => s + b.stats.impact_score, 0)
    const weakImpact = banks
      .filter((b) => ['chronically_weak', 'one_off_incident'].includes(b.stats.classification))
      .reduce((s, b) => s + b.stats.impact_score, 0)
    return totalImpact > 0 ? (weakImpact / totalImpact) * 100 : 0
  }, [banks])

  const worst3 = banks.slice(0, 3)
  const best3 = [...banks].sort((a, b) => a.stats.mean_td - b.stats.mean_td).slice(0, 3)

  const handleBankClick = (bank: BankEntry) => {
    setSelectedBank(bank)
    navigate(`/bank/${encodeURIComponent(bank.bank)}?role=${bank.role}`)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorBanner error={error} />

  return (
    <div>
      {/* Hero */}
      <section className="grid lg:grid-cols-2 gap-8 items-center mb-12" aria-label="Introduction">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="chip bg-upi-orange/12 text-upi-orange-deep mb-4 border border-upi-orange/20">
            <span className="h-1.5 w-1.5 rounded-full bg-upi-orange animate-pulse" /> Built from NPCI public data
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-[1.05] text-ink mb-4">
            Which banks{' '}
            <span className="text-gradient-orange">actually work</span>{' '}
            on UPI?
          </h1>
          <p className="text-ink-soft text-base leading-relaxed mb-6 max-w-lg">
            Every UPI payment runs through your bank. Some banks quietly fail far more often than
            others — and it's <strong className="text-ink">never your fault</strong>. We stacked{' '}
            {allMonths.length} months of official data to show you who's reliable, in plain English.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/map"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #FF8A3D, #E2540B)',
                boxShadow: '0 4px 16px rgba(255,106,26,0.40), 0 1px 3px rgba(226,84,11,0.30)',
              }}
            >
              See the map →
            </Link>
            <Link
              to="/about"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-ink transition-all duration-200 hover:border-upi-orange/40"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
            >
              How does this work?
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hidden sm:block"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <HeroArt />
        </motion.div>
      </section>

      {/* Headline stat */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card overflow-hidden mb-12 relative"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 110%, rgba(220,40,40,0.08), transparent 68%)' }}
        />
        <div className="relative p-8 sm:p-12 text-center">
          <p className="eyebrow mb-5">The headline finding</p>
          <div className="flex items-center justify-center gap-6 sm:gap-10 mb-5 flex-wrap">
            <div>
              <div
                className="font-display font-extrabold text-6xl sm:text-7xl text-rel-critical tabular-nums leading-none"
                style={{ textShadow: '0 0 48px rgba(220,40,40,0.32)' }}
              >
                <CountUp to={weakCount} />
              </div>
              <div className="text-sm text-ink-soft mt-2 font-medium">
                {weakCount === 1 ? 'bank' : 'banks'} with issues
              </div>
            </div>
            <div className="text-4xl sm:text-5xl text-ink-faint font-light select-none" aria-hidden="true">→</div>
            <div>
              <div
                className="font-display font-extrabold text-6xl sm:text-7xl text-rel-critical tabular-nums leading-none"
                style={{ textShadow: '0 0 48px rgba(220,40,40,0.32)' }}
              >
                <CountUp to={Math.round(totalTDShare)} suffix="%" />
              </div>
              <div className="text-sm text-ink-soft mt-2 font-medium">of all bank-fault failures</div>
            </div>
          </div>
          <p className="text-ink-soft text-sm max-w-xl mx-auto leading-relaxed">
            A handful of repeat offenders drag down the whole system. Here's the full picture, month by month.
          </p>
        </div>
      </motion.div>

      {/* How to read this */}
      <section className="mb-12" aria-label="Plain-language explainer">
        <h2 className="font-display font-bold text-xl text-ink mb-1">First, two kinds of failure</h2>
        <p className="text-ink-soft text-sm mb-5">When a UPI payment fails, it's one of two things. We only judge banks on the first.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {CONCEPTS.map((c, i) => (
            <motion.div
              key={c.term}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 relative overflow-hidden"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${c.accent}10, transparent 60%)` }}
              />
              <div className="relative flex items-center gap-3 mb-3">
                <div
                  className="grid h-10 w-10 place-items-center rounded-xl font-mono text-xs font-extrabold shrink-0"
                  style={{ background: c.accent + '18', color: c.accent, border: `1px solid ${c.accent}28` }}
                >
                  {c.abbr}
                </div>
                <div>
                  <div className="font-display font-bold text-ink text-sm">{c.title}</div>
                  <div className="text-[10px] font-mono font-semibold" style={{ color: c.accent }}>{c.term}</div>
                </div>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Controls {...props} />

      {/* Heatmap */}
      <section className="card p-5 sm:p-6 mb-10" aria-label="Reliability heatmap">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="font-display font-bold text-lg text-ink flex items-center gap-2">
            The reliability heatmap
            <InfoTip label="How to read the heatmap">
              Each square is one bank in one month. <strong className="text-white">Greener = more reliable</strong>,{' '}
              redder = failed more often. A whole red row means a bank that's always shaky; one red square is a single bad month.
            </InfoTip>
          </h2>
        </div>
        <p className="text-sm text-ink-soft mb-5">
          Banks are sorted worst → best. Hover any square for the plain-English read. Click a row for the full story.
        </p>
        <Heatmap banks={banks} months={visibleMonths} onBankClick={handleBankClick} />
      </section>

      {/* Leaderboard */}
      <div className="grid lg:grid-cols-2 gap-8">
        <section aria-label="Least reliable banks">
          <h2 className="font-display font-bold text-lg text-rel-critical mb-1 flex items-center gap-2">
            <span aria-hidden="true">▲</span> Avoid if you can
          </h2>
          <p className="text-sm text-ink-soft mb-4">Highest "bank's-fault" failure rates in your selected window.</p>
          <div className="flex flex-col gap-3">
            {worst3.map((b, i) => <BankCard key={`${b.bank}-${b.role}`} bank={b} rank={i} />)}
          </div>
        </section>
        <section aria-label="Most reliable banks">
          <h2 className="font-display font-bold text-lg text-rel-excellent mb-1 flex items-center gap-2">
            <span aria-hidden="true">◆</span> Safest bets
          </h2>
          <p className="text-sm text-ink-soft mb-4">These banks' systems rarely let you down.</p>
          <div className="flex flex-col gap-3">
            {best3.map((b, i) => <BankCard key={`${b.bank}-${b.role}`} bank={b} rank={i} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
