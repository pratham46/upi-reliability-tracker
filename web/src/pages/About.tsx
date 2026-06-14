import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Meta } from '../lib/types'

const CATEGORIES = [
  { icon: '◆', color: '#12A150', label: 'Rock Solid', note: 'Low TD rate, and consistent across months. Stable performance in the data.' },
  { icon: '▲', color: '#DC2828', label: 'Recurring Declines', note: 'Elevated TD rate recorded consistently across multiple months in the dataset.' },
  { icon: '●', color: '#E5A50A', label: 'Isolated Incident', note: 'Generally low TD rate, with one month showing a notable spike in the data.' },
  { icon: '◇', color: '#6D4AFF', label: 'Variable Pattern', note: 'TD rate varies significantly month-to-month with no clear stable trend.' },
]

export default function About({ meta }: { meta: Meta | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-7 py-2"
    >
      <div>
        <h1 className="font-display font-extrabold text-3xl text-ink mb-2">How this works</h1>
        <p className="text-ink-soft">
          No jargon. Here is exactly what the numbers mean, how we categorise banks, and important
          context to keep in mind.
        </p>
      </div>

      {/* TD vs BD */}
      <section className="card p-6 space-y-4">
        <h2 className="font-display font-bold text-xl text-ink">Two types of UPI payment decline</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-rel-critical/25 bg-rel-critical/8 p-5">
            <div className="text-rel-critical font-display font-bold mb-2">
              {'▲'} Technical Decline (TD)
            </div>
            <p className="text-ink-soft text-sm leading-relaxed">
              The payment system returned a technical error during processing. NPCI classifies this
              as a <em>Technical Decline</em>. Your inputs (PIN, UPI ID, balance) were not the cause.
            </p>
            <p className="text-ink-faint text-xs mt-2">
              Examples: server timeouts, switch failures, system unavailability during processing.
            </p>
          </div>
          <div className="rounded-2xl border border-rel-fair/30 bg-rel-fair/10 p-5">
            <div className="text-[#B8810A] font-display font-bold mb-2">
              {'●'} Business Decline (BD)
            </div>
            <p className="text-ink-soft text-sm leading-relaxed">
              The payment was declined due to a user-side condition. NPCI classifies this as a{' '}
              <em>Business Decline</em>. We exclude these from our analysis entirely.
            </p>
            <p className="text-ink-faint text-xs mt-2">
              Examples: wrong PIN, wrong UPI ID, insufficient balance, daily limit reached.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="card p-6 space-y-3">
        <h2 className="font-display font-bold text-xl text-ink">How we categorise banks</h2>
        <p className="text-ink-soft text-sm">
          Based on TD rate history, each bank is placed into one of four pattern groups:
        </p>
        <ul className="space-y-3 text-sm">
          {CATEGORIES.map((r) => (
            <li key={r.label} className="flex gap-3 items-start">
              <span style={{ color: r.color }} className="text-lg shrink-0 leading-none mt-0.5" aria-hidden="true">
                {r.icon}
              </span>
              <div>
                <span style={{ color: r.color }} className="font-semibold">{r.label}: </span>
                <span className="text-ink-soft">{r.note}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Impact */}
      <section className="card p-6 space-y-3">
        <h2 className="font-display font-bold text-xl text-ink">Estimated impact &mdash; why volume matters</h2>
        <p className="text-ink-soft text-sm leading-relaxed">
          A bank processing a small volume at 5% TD affects fewer transactions in absolute terms
          than a large-volume bank at 1% TD. To reflect this, we weight TD rates by transaction
          volume to estimate the number of transactions affected each month.
        </p>
        <p className="text-sm bg-surface-sunken rounded-xl px-4 py-3 text-ink">
          <span className="font-mono text-upi-orange-deep">
            estimated impact &asymp; TD rate &times; transaction volume
          </span>
        </p>
      </section>

      {/* Caveats */}
      <section className="card p-6 space-y-3">
        <h2 className="font-display font-bold text-xl text-ink">Important context</h2>
        <ul className="space-y-2 text-sm text-ink-soft list-disc list-inside marker:text-upi-orange">
          <li>
            <strong className="text-ink">Monthly aggregates.</strong>{' '}
            A brief outage may appear small once averaged over a full month of data.
          </li>
          <li>
            <strong className="text-ink">Volume is estimated.</strong>{' '}
            NPCI publishes aggregate totals; per-bank volumes are approximate.
          </li>
          <li>
            <strong className="text-ink">Remitter vs beneficiary differ.</strong>{' '}
            TD rates can vary by role &mdash; use the toggle to view each separately.
          </li>
          <li>
            <strong className="text-ink">Source is NPCI public data.</strong>{' '}
            We only display what NPCI publishes; figures may be revised as new reports are released.
          </li>
          <li>
            <strong className="text-ink">This is informational only.</strong>{' '}
            These patterns are drawn from publicly available statistics and do not constitute
            financial advice or a professional assessment of any bank.
          </li>
        </ul>
      </section>

      {/* Source */}
      <section className="card-sunken p-6 space-y-2">
        <h2 className="font-display font-bold text-lg text-ink">Where the data comes from</h2>
        <p className="text-ink-soft text-sm">
          {meta?.source ?? 'NPCI UPI Ecosystem Statistics'} &mdash; published monthly by the
          National Payments Corporation of India.
        </p>
        <p className="text-ink-faint text-xs">
          Last updated: <span className="font-mono">{meta?.last_updated ?? 'unknown'}</span>
        </p>
        {meta?.notes && <p className="text-ink-faint text-sm mt-2">{meta.notes}</p>}
      </section>

      {/* Disclaimer link */}
      <div className="flex items-center justify-center">
        <Link
          to="/disclaimer"
          className="text-sm text-ink-soft hover:text-upi-orange-deep transition-colors font-medium underline underline-offset-2"
        >
          Read the full Disclaimer &amp; Terms of Use &rarr;
        </Link>
      </div>
    </motion.div>
  )
}
