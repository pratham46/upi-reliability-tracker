import { motion } from 'framer-motion'
import type { Meta } from '../lib/types'

export default function About({ meta }: { meta: Meta | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-7 py-2"
    >
      <div>
        <h1 className="font-display font-extrabold text-3xl text-ink mb-2">How this works</h1>
        <p className="text-ink-soft">No jargon. Here’s exactly what the numbers mean, how we rank banks, and what to take with a pinch of salt.</p>
      </div>

      {/* TD vs BD */}
      <section className="card p-6 space-y-4">
        <h2 className="font-display font-bold text-xl text-ink">Two reasons a UPI payment fails</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-rel-critical/25 bg-rel-critical/8 p-5">
            <div className="text-rel-critical font-display font-bold mb-2">▲ The bank’s fault</div>
            <p className="text-ink-soft text-sm leading-relaxed">
              The bank’s (or NPCI’s) own systems failed to process your payment. <strong className="text-ink">Nothing to do with you.</strong> This
              is the number we rank banks on. Pros call it <em>Technical Decline (TD)</em>.
            </p>
            <p className="text-ink-faint text-xs mt-2">Like an ATM being out of order: server timeouts, systems down, switch failures.</p>
          </div>
          <div className="rounded-2xl border border-rel-fair/30 bg-rel-fair/10 p-5">
            <div className="text-[#B8810A] font-display font-bold mb-2">● Your situation</div>
            <p className="text-ink-soft text-sm leading-relaxed">
              The payment failed because of something on your side. <strong className="text-ink">Not the bank breaking.</strong> We deliberately
              leave this out of the ranking. Pros call it <em>Business Decline (BD)</em>.
            </p>
            <p className="text-ink-faint text-xs mt-2">Wrong PIN, wrong UPI ID, low balance, daily limit reached.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="card p-6 space-y-3">
        <h2 className="font-display font-bold text-xl text-ink">How we sort banks into groups</h2>
        <p className="text-ink-soft text-sm">We look at each bank’s history and put it in one of four buckets:</p>
        <ul className="space-y-3 text-sm">
          {[
            { icon: '◆', color: '#12A150', label: 'Rock Solid', note: 'Low failures, and consistent. The boring, dependable kind.' },
            { icon: '▲', color: '#DC2828', label: 'Always Shaky', note: 'Fails often, month after month. A pattern, not bad luck.' },
            { icon: '●', color: '#E5A50A', label: 'One Bad Month', note: 'Usually fine, but had one big outage that stands out.' },
            { icon: '◇', color: '#6D4AFF', label: 'Unpredictable', note: 'All over the place — great one month, rough the next.' },
          ].map((r) => (
            <li key={r.label} className="flex gap-3 items-start">
              <span style={{ color: r.color }} className="text-lg shrink-0 leading-none mt-0.5" aria-hidden="true">{r.icon}</span>
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
        <h2 className="font-display font-bold text-xl text-ink">“People affected” — why size matters</h2>
        <p className="text-ink-soft text-sm leading-relaxed">
          A tiny bank failing 5% of the time annoys a few thousand people. A giant like SBI failing just 1% of the time
          can break <strong className="text-ink">millions</strong> of payments. So we multiply failure rate by how many payments a
          bank handles to estimate real-world impact.
        </p>
        <p className="text-sm bg-surface-sunken rounded-xl px-4 py-3 text-ink">
          <span className="font-mono text-upi-orange-deep">people affected ≈ failure rate × payments handled</span>
        </p>
      </section>

      {/* Caveats */}
      <section className="card p-6 space-y-3">
        <h2 className="font-display font-bold text-xl text-ink">Worth keeping in mind</h2>
        <ul className="space-y-2 text-sm text-ink-soft list-disc list-inside marker:text-upi-orange">
          <li><strong className="text-ink">Monthly snapshots.</strong> A 6-hour outage can look small once averaged over a whole month.</li>
          <li><strong className="text-ink">Volume is estimated.</strong> NPCI publishes totals; per-bank volume is approximate.</li>
          <li><strong className="text-ink">Sending vs receiving differ.</strong> A bank can be great at one and poor at the other — use the toggle.</li>
          <li><strong className="text-ink">It’s NPCI’s data.</strong> We only show what NPCI publishes; recent months may shift slightly.</li>
          <li><strong className="text-ink">Demo data for now.</strong> The numbers here are realistic but synthetic until real NPCI files are loaded.</li>
        </ul>
      </section>

      {/* Source */}
      <section className="card-sunken p-6 space-y-2">
        <h2 className="font-display font-bold text-lg text-ink">Where the data comes from</h2>
        <p className="text-ink-soft text-sm">{meta?.source ?? 'NPCI UPI Ecosystem Statistics'} — published monthly by the National Payments Corporation of India.</p>
        <p className="text-ink-faint text-xs">Last updated: <span className="font-mono">{meta?.last_updated ?? 'unknown'}</span></p>
        {meta?.notes && <p className="text-ink-faint text-sm mt-2">{meta.notes}</p>}
      </section>
    </motion.div>
  )
}
