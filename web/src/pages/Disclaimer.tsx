import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    title: 'Purpose of this site',
    body: `UPI Reliability Tracker is an independent, non-commercial research and information tool. It presents
    statistical patterns derived exclusively from data published by the National Payments Corporation of India (NPCI)
    in its publicly available UPI Ecosystem Statistics reports. The site has no affiliation with NPCI, the Reserve
    Bank of India (RBI), or any bank or payment service provider.`,
  },
  {
    title: 'No defamation or malicious intent',
    body: `Nothing on this site is intended to defame, malign, disparage, or damage the reputation of any bank,
    financial institution, or individual. All data presented is sourced verbatim from NPCI's public monthly reports.
    We make no independent claims about any bank's internal operations, management, technology, or competence.
    Any patterns observed in the data reflect official published statistics, not editorial opinion.`,
  },
  {
    title: 'Not financial advice',
    body: `This site is strictly informational. Nothing on this site constitutes financial, investment, legal, or
    regulatory advice. The TD (Technical Decline) rate is one statistical metric derived from aggregate public data;
    it does not represent a comprehensive assessment of any bank's overall performance, safety, soundness, or
    suitability for any purpose. Do not make financial decisions based solely on this data.`,
  },
  {
    title: 'Data accuracy and limitations',
    body: `All figures are drawn from NPCI's publicly released reports and are presented as-is. We do not independently
    verify, audit, or certify the underlying data. Monthly aggregate figures may not capture intra-month events,
    short-duration outages, or factors specific to individual geographies or customer segments. Per-bank transaction
    volumes are estimates. Data may be subject to revision by NPCI after initial publication.`,
  },
  {
    title: 'No guarantee of accuracy',
    body: `While we strive to present data accurately, we make no warranties — express or implied — regarding the
    completeness, correctness, timeliness, or fitness for purpose of any information on this site. You use this
    information entirely at your own risk.`,
  },
  {
    title: 'Third-party data and intellectual property',
    body: `NPCI UPI Ecosystem Statistics are published by NPCI under their own terms. All trademarks, bank names,
    and logos referenced belong to their respective owners. This site does not claim ownership of any third-party
    data, brand, or intellectual property. Bank names are used solely to identify the entities to which NPCI has
    attributed published statistics.`,
  },
  {
    title: 'No liability',
    body: `To the maximum extent permitted by applicable law, the creators of this site disclaim all liability for
    any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or reliance on,
    any information presented here. This includes but is not limited to errors in data, interpretation of statistics,
    or decisions made based on this information.`,
  },
  {
    title: 'Changes and availability',
    body: `We reserve the right to modify, update, or discontinue this site or any part of its content at any time
    without notice. We make no commitment to keep data current or to maintain availability of the service.`,
  },
]

export default function Disclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-7 py-2"
    >
      {/* Header */}
      <div>
        <span className="chip bg-upi-orange/12 text-upi-orange-deep mb-4 border border-upi-orange/20 inline-flex">
          Legal &amp; Transparency
        </span>
        <h1 className="font-display font-extrabold text-3xl text-ink mb-2">
          Disclaimer &amp; Terms of Use
        </h1>
        <p className="text-ink-soft text-sm leading-relaxed">
          Please read this page before using or sharing data from this site. By accessing UPI Reliability Tracker
          you agree to the terms described below.
        </p>
        <p className="text-ink-faint text-xs mt-2 font-mono">Last updated: June 2026</p>
      </div>

      {/* Banner */}
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: 'linear-gradient(135deg, rgba(255,106,26,0.06), rgba(18,161,80,0.04))',
          borderColor: 'rgba(255,106,26,0.22)',
        }}
      >
        <p className="text-sm text-ink leading-relaxed">
          <strong>In short:</strong> This site displays publicly available NPCI statistics to help people understand
          UPI payment reliability trends. It is <strong>not</strong> intended to defame any bank, does not constitute
          financial advice, and carries no guarantee of accuracy. All data is sourced from NPCI's own published reports.
        </p>
      </div>

      {/* Sections */}
      {SECTIONS.map((s, i) => (
        <motion.section
          key={s.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
          className="card p-6 space-y-2"
        >
          <h2 className="font-display font-bold text-base text-ink flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-lg grid place-items-center text-xs font-bold shrink-0"
              style={{ background: 'rgba(255,106,26,0.12)', color: '#FF6A1A' }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            {s.title}
          </h2>
          <p className="text-sm text-ink-soft leading-relaxed pl-8">{s.body}</p>
        </motion.section>
      ))}

      {/* NPCI attribution */}
      <section className="card-sunken p-6 space-y-2">
        <h2 className="font-display font-bold text-base text-ink">Data source attribution</h2>
        <p className="text-ink-soft text-sm">
          All statistical data displayed on this site is sourced from{' '}
          <strong className="text-ink">NPCI UPI Ecosystem Statistics</strong> — published monthly by the
          National Payments Corporation of India (NPCI). NPCI is the authoritative source and we make no
          modifications to the underlying figures.
        </p>
        <p className="text-ink-faint text-xs mt-1">
          This site is independent and is not endorsed by, affiliated with, or sponsored by NPCI, RBI, or any bank.
        </p>
      </section>

      {/* Contact / Report */}
      <div className="card-sunken p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink mb-1">Found an error or have a concern?</p>
          <p className="text-xs text-ink-soft">
            If you believe any data displayed here is incorrect or that content needs to be updated or removed,
            please review the original NPCI source report and raise the matter with NPCI directly, as we are
            bound by their published figures.
          </p>
        </div>
        <Link
          to="/about"
          className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-ink-soft transition-colors hover:text-upi-orange-deep whitespace-nowrap"
          style={{ border: '1px solid var(--glass-border)' }}
        >
          ← How it works
        </Link>
      </div>
    </motion.div>
  )
}
