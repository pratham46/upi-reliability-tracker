import { motion } from 'framer-motion'

/**
 * Hero illustration: two phones exchanging a payment over UPI.
 * The travelling coin groups circle + ₹ text in a single motion.g so they
 * always translate together and the rupee stays perfectly centred.
 */
export default function HeroArt() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto select-none" aria-hidden="true">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 blur-3xl opacity-50"
        style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,106,26,0.22), transparent 60%)' }}
      />

      <motion.svg
        viewBox="0 0 440 320"
        className="relative w-full"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      >
        {/* Payment arc */}
        <motion.path
          d="M120 150 C 180 70, 260 70, 320 150"
          fill="none"
          stroke="#FF6A1A"
          strokeWidth="2"
          strokeDasharray="6 8"
          strokeLinecap="round"
          className="animate-dash-flow"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 0.7 } }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        {/* Left phone — payer */}
        <motion.g variants={fadeUp}>
          {/* Phone body */}
          <rect x="64" y="118" width="92" height="170" rx="18" fill="#0D1428" />
          {/* Screen */}
          <rect x="72" y="126" width="76" height="154" rx="12" fill="#EEF3FF" />
          {/* Notch */}
          <rect x="98" y="121" width="24" height="5" rx="2.5" fill="#1E2A45" />
          {/* Rupee icon on screen */}
          <circle cx="110" cy="166" r="18" fill="#FF6A1A" fillOpacity="0.14" />
          <text
            x="110" y="166"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="18"
            fontWeight="700"
            fill="#E2540B"
            fontFamily="Hanken Grotesk, sans-serif"
          >
            ₹
          </text>
          {/* Skeleton lines */}
          <rect x="84" y="198" width="52" height="6" rx="3" fill="#C8D8F0" />
          <rect x="84" y="212" width="36" height="6" rx="3" fill="#C8D8F0" />
          {/* Pay button */}
          <rect x="84" y="240" width="52" height="22" rx="11" fill="#FF6A1A" />
          <text x="110" y="251" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Hanken Grotesk, sans-serif">Pay</text>
        </motion.g>

        {/* Right phone — payee */}
        <motion.g variants={fadeUp}>
          <rect x="284" y="118" width="92" height="170" rx="18" fill="#0D1428" />
          <rect x="292" y="126" width="76" height="154" rx="12" fill="#EEF3FF" />
          <rect x="318" y="121" width="24" height="5" rx="2.5" fill="#1E2A45" />
          {/* Success tick */}
          <circle cx="330" cy="166" r="18" fill="#12A150" fillOpacity="0.16" />
          <path d="M322 166 l5 6 l11 -13" stroke="#0A7C3C" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="304" y="198" width="52" height="6" rx="3" fill="#C8D8F0" />
          <rect x="304" y="212" width="36" height="6" rx="3" fill="#C8D8F0" />
          {/* Received badge */}
          <rect x="304" y="240" width="52" height="22" rx="11" fill="#12A150" />
          <text x="330" y="251" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Hanken Grotesk, sans-serif">₹ Received</text>
        </motion.g>

        {/* ── Travelling coin ──────────────────────────────────────────────────
             Single motion.g translates the whole group so the ₹ never drifts
             from its coin. Circle stays at cx=120,cy=150 in local coords;
             the group moves x: 0→100→200, y: 0→-64→0 matching the arc.  */}
        <motion.g variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
          <motion.g
            animate={{ x: [0, 100, 200], y: [0, -64, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 0.5,
            }}
          >
            {/* Coin glow */}
            <circle cx={120} cy={150} r={22} fill="#FF6A1A" fillOpacity={0.18} />
            {/* Coin */}
            <circle
              cx={120}
              cy={150}
              r={16}
              fill="#FF6A1A"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth={2.5}
            />
            {/* Rupee — dominantBaseline="central" keeps it vertically centred */}
            <text
              x={120}
              y={150}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={15}
              fontWeight="700"
              fill="#fff"
              fontFamily="Hanken Grotesk, sans-serif"
            >
              ₹
            </text>
          </motion.g>
        </motion.g>

        {/* Floating bank chip — top left */}
        <motion.g variants={fadeUp} className="animate-float">
          <rect x="22" y="36" width="72" height="32" rx="10"
            fill="rgba(255,255,255,0.88)" stroke="#C8D8F0" strokeWidth="1" />
          <circle cx="42" cy="52" r="7" fill="#1B2A4A" />
          <rect x="54" y="48" width="28" height="4" rx="2" fill="#C8D8F0" />
          <rect x="54" y="56" width="20" height="4" rx="2" fill="#D8E8FF" />
        </motion.g>

        {/* Floating bank chip — top right */}
        <motion.g variants={fadeUp} className="animate-float-slow">
          <rect x="346" y="52" width="72" height="32" rx="10"
            fill="rgba(255,255,255,0.88)" stroke="#C8D8F0" strokeWidth="1" />
          <circle cx="366" cy="68" r="7" fill="#12A150" />
          <rect x="378" y="64" width="28" height="4" rx="2" fill="#C8D8F0" />
          <rect x="378" y="72" width="20" height="4" rx="2" fill="#D8E8FF" />
        </motion.g>
      </motion.svg>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 16 } },
}
