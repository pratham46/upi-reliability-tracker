import { motion } from 'framer-motion'

const ARC = 'M 136 155 C 180 55, 260 55, 304 155'

// 5-point keyframes sampling the cubic bezier more accurately
// P0=(136,155) P1=(180,55) P2=(260,55) P3=(304,155), extended to land at ✓ (346,163)
const CX = [0, 39, 84, 129, 210]
const CY = [0, -57, -75, -57, 8]
const CT = [0, 0.25, 0.5, 0.75, 1]

const COIN_DELAY = 1.1
const COIN_DUR   = 2.0
const COIN_PAUSE = 0.7
const ARRIVE     = COIN_DELAY + COIN_DUR  // 3.1s — when coin first lands
const PERIOD     = COIN_DUR + COIN_PAUSE  // 2.7s — full loop cycle

// 6-element gradient trail: orange → fading white-orange
const TRAIL = [
  { lag: 0.07, r: 17,  maxOp: 0.62, color: '#FF6A1A' },
  { lag: 0.14, r: 12,  maxOp: 0.40, color: '#FF8040' },
  { lag: 0.22, r: 8.5, maxOp: 0.24, color: '#FFA060' },
  { lag: 0.30, r: 5.5, maxOp: 0.13, color: '#FFB870' },
  { lag: 0.38, r: 3.5, maxOp: 0.07, color: '#FFC890' },
  { lag: 0.46, r: 2,   maxOp: 0.03, color: '#FFD8B0' },
]

// 12 sparkle particles — varied distances, 3 size tiers
const SPARKS = [
  { deg: 0,   dist: 38 }, { deg: 30,  dist: 28 }, { deg: 60,  dist: 42 },
  { deg: 90,  dist: 24 }, { deg: 120, dist: 36 }, { deg: 150, dist: 30 },
  { deg: 180, dist: 40 }, { deg: 210, dist: 26 }, { deg: 240, dist: 34 },
  { deg: 270, dist: 22 }, { deg: 300, dist: 38 }, { deg: 330, dist: 28 },
]
const SPARK_COLORS = ['#12A150', '#4CD980', '#70E89A', '#12A150', '#4CD980', '#A8F0C0']

export default function HeroArt() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto select-none" aria-hidden="true">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 blur-3xl opacity-40"
        style={{ background: 'radial-gradient(circle at 50% 42%, rgba(255,106,26,0.26), transparent 58%)' }}
      />

      <motion.svg
        viewBox="0 0 440 290"
        className="relative w-full"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.11 } } }}
      >
        <defs>
          {/* Arc gradient: orange → fade → green */}
          <linearGradient id="heroArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FF6A1A" stopOpacity="0.95" />
            <stop offset="42%"  stopColor="#FFAA70" stopOpacity="0.40" />
            <stop offset="58%"  stopColor="#70C898" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#12A150" stopOpacity="0.95" />
          </linearGradient>

          {/* Coin: 3-layer glow — tight core + mid bloom + wide halo */}
          <filter id="coinGlow" x="-160%" y="-160%" width="420%" height="420%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2"  result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="7"  result="b2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="b3" />
            <feMerge>
              <feMergeNode in="b3" />
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Trail: soft wide blur */}
          <filter id="trailGlow" x="-160%" y="-160%" width="420%" height="420%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Checkmark area: green glow bloom */}
          <filter id="checkGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="9"   result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Sparkle particle glow */}
          <filter id="particleGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Left phone — payer ──────────────────────────────── */}
        <motion.g variants={fadeUp}>
          <rect x="52"  y="110" width="84" height="152" rx="18" fill="#0D1428" />
          <rect x="60"  y="118" width="68" height="136" rx="13" fill="#EEF3FF" />
          <rect x="82"  y="113" width="20" height="5"   rx="2.5" fill="#1E2A45" />
          {/* ₹ icon on screen */}
          <circle cx="94" cy="163" r="17" fill="#FF6A1A" fillOpacity="0.13" />
          <text x="94" y="163" textAnchor="middle" dominantBaseline="central"
            fontSize="16" fontWeight="700" fill="#E2540B" fontFamily="Hanken Grotesk, sans-serif">₹</text>
          <rect x="68" y="191" width="52" height="5" rx="2.5" fill="#C8D8F0" />
          <rect x="68" y="202" width="36" height="5" rx="2.5" fill="#C8D8F0" />
          <rect x="68" y="226" width="52" height="20" rx="10" fill="#FF6A1A" />
          <text x="94" y="236" textAnchor="middle" dominantBaseline="central"
            fontSize="8.5" fontWeight="700" fill="#fff" fontFamily="Hanken Grotesk, sans-serif">Pay</text>
          {/* Departure pulse rings */}
          <motion.circle cx="136" cy="155" fill="none" stroke="#FF6A1A" strokeWidth="1.5"
            initial={{ r: 5, opacity: 0.85 }}
            animate={{ r: [5, 26], opacity: [0.85, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut', delay: 0.9, repeatDelay: 0.3 }} />
          <motion.circle cx="136" cy="155" fill="none" stroke="#FF6A1A" strokeWidth="1"
            initial={{ r: 5, opacity: 0.45 }}
            animate={{ r: [5, 26], opacity: [0.45, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut', delay: 1.85, repeatDelay: 0.3 }} />
        </motion.g>

        {/* ── Right phone — payee ─────────────────────────────── */}
        <motion.g variants={fadeUp}>
          <rect x="304" y="110" width="84" height="152" rx="18" fill="#0D1428" />
          <rect x="312" y="118" width="68" height="136" rx="13" fill="#EEF3FF" />
          <rect x="334" y="113" width="20" height="5"   rx="2.5" fill="#1E2A45" />

          {/* Screen flash green on arrival */}
          <motion.rect x="312" y="118" width="68" height="136" rx="13"
            fill="#12A150" fillOpacity="0"
            animate={{ fillOpacity: [0, 0, 0.13, 0.13, 0] }}
            transition={{ duration: PERIOD, times: [0, 0.01, 0.06, 0.50, 1],
              repeat: Infinity, delay: ARRIVE, repeatDelay: 0 }} />

          {/* ✓ circle — pulses and blooms on coin arrival */}
          <motion.circle cx="346" cy="163" r="17" fill="#12A150"
            style={{ filter: 'url(#checkGlow)' }}
            animate={{ fillOpacity: [0.12, 0.12, 0.58, 0.58, 0.12] }}
            transition={{ duration: PERIOD, times: [0, 0.01, 0.08, 0.55, 1],
              repeat: Infinity, delay: ARRIVE, repeatDelay: 0 }} />

          {/* ✓ path — draws in on arrival, holds, fades before next coin */}
          <motion.path
            d="M338 163 l5 6 l10-12"
            stroke="#0A7C3C" strokeWidth="3" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: 'url(#checkGlow)' }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: PERIOD, times: [0, 0.15, 0.80, 1],
              repeat: Infinity, ease: 'easeOut', delay: ARRIVE, repeatDelay: 0 }} />

          {/* Arrival burst — 3 staggered expanding rings */}
          <motion.circle cx="346" cy="163" fill="none" stroke="#12A150" strokeWidth="2.5"
            initial={{ r: 17, opacity: 0 }}
            animate={{ r: [17, 46], opacity: [0.90, 0] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: 'easeOut',
              delay: ARRIVE, repeatDelay: PERIOD - 0.65 }} />
          <motion.circle cx="346" cy="163" fill="none" stroke="#12A150" strokeWidth="1.5"
            initial={{ r: 17, opacity: 0 }}
            animate={{ r: [17, 46], opacity: [0.55, 0] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: 'easeOut',
              delay: ARRIVE + 0.14, repeatDelay: PERIOD - 0.65 }} />
          <motion.circle cx="346" cy="163" fill="none" stroke="#4CD980" strokeWidth="1"
            initial={{ r: 17, opacity: 0 }}
            animate={{ r: [17, 52], opacity: [0.30, 0] }}
            transition={{ duration: 0.80, repeat: Infinity, ease: 'easeOut',
              delay: ARRIVE + 0.28, repeatDelay: PERIOD - 0.80 }} />

          {/* 12-particle sparkle burst */}
          {SPARKS.map(({ deg, dist }, i) => {
            const rad = (deg * Math.PI) / 180
            const tx = Math.round(Math.cos(rad) * dist)
            const ty = Math.round(Math.sin(rad) * dist)
            const r  = i % 3 === 0 ? 3.5 : i % 3 === 1 ? 2.5 : 2
            return (
              <motion.circle key={i}
                cx={346} cy={163} r={r}
                fill={SPARK_COLORS[i % SPARK_COLORS.length]}
                style={{ filter: 'url(#particleGlow)' }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ x: [0, tx * 0.4, tx], y: [0, ty * 0.4, ty], opacity: [0, 1, 0] }}
                transition={{ duration: 0.60, repeat: Infinity, ease: 'easeOut',
                  delay: ARRIVE + 0.04 + (i % 3) * 0.04, repeatDelay: PERIOD - 0.60 }}
              />
            )
          })}

          <rect x="320" y="191" width="52" height="5" rx="2.5" fill="#C8D8F0" />
          <rect x="320" y="202" width="36" height="5" rx="2.5" fill="#C8D8F0" />
          <rect x="312" y="226" width="68" height="20" rx="10" fill="#12A150" />
          <text x="346" y="236" textAnchor="middle" dominantBaseline="central"
            fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="Hanken Grotesk, sans-serif">₹ Received</text>

          {/* Arrival-side pulse ring */}
          <motion.circle cx="304" cy="155" fill="none" stroke="#12A150" strokeWidth="1.5"
            initial={{ r: 5, opacity: 0.85 }}
            animate={{ r: [5, 26], opacity: [0.85, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut', delay: 1.4, repeatDelay: 0.3 }} />
        </motion.g>

        {/* ── Arc — halo + gradient line ───────────────────────── */}
        <motion.path d={ARC} fill="none" stroke="#FF8A3D" strokeWidth="12"
          strokeLinecap="round" strokeOpacity="0.08"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1 } }}
          transition={{ duration: 0.9, ease: 'easeOut' }} />
        <motion.path d={ARC} fill="none" stroke="url(#heroArcGrad)" strokeWidth="2.2"
          strokeLinecap="round"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1 } }}
          transition={{ duration: 0.9, ease: 'easeOut' }} />

        {/* Flowing dash — rides along arc during transit */}
        <motion.path d={ARC} fill="none" stroke="#FFBE80" strokeWidth="2"
          strokeLinecap="round" strokeDasharray="8 20"
          animate={{
            strokeDashoffset: [200, 0],
            opacity: [0, 0, 0.55, 0.55, 0],
          }}
          transition={{
            strokeDashoffset: { duration: COIN_DUR, repeat: Infinity, ease: 'linear', repeatDelay: COIN_PAUSE, delay: COIN_DELAY },
            opacity: { duration: COIN_DUR, times: [0, 0.04, 0.12, 0.88, 1], repeat: Infinity, ease: 'linear', repeatDelay: COIN_PAUSE, delay: COIN_DELAY },
          }}
        />

        {/* ── Trail elements (behind coin) ─────────────────────── */}
        {TRAIL.map(({ lag, r, maxOp, color }) => (
          <motion.g
            key={lag}
            style={{ filter: 'url(#trailGlow)' }}
            animate={{
              opacity: [0, maxOp, maxOp, maxOp, 0],
              x: CX,
              y: CY,
            }}
            transition={{
              opacity: { duration: COIN_DUR, repeat: Infinity, times: [0, 0.06, 0.5, 0.94, 1], delay: COIN_DELAY + lag, repeatDelay: COIN_PAUSE, ease: 'linear' },
              x: { duration: COIN_DUR, repeat: Infinity, ease: [0.4, 0, 0.2, 1], times: CT, repeatDelay: COIN_PAUSE, delay: COIN_DELAY + lag },
              y: { duration: COIN_DUR, repeat: Infinity, ease: [0.4, 0, 0.2, 1], times: CT, repeatDelay: COIN_PAUSE, delay: COIN_DELAY + lag },
            }}
          >
            <circle cx={136} cy={155} r={r} fill={color} />
          </motion.g>
        ))}

        {/* ── Main rupee coin ─────────────────────────────────── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: CX, y: CY }}
          style={{ filter: 'url(#coinGlow)' }}
          transition={{
            opacity: { duration: 0.4, delay: 0.9 },
            x: { duration: COIN_DUR, repeat: Infinity, ease: [0.4, 0, 0.2, 1], times: CT, repeatDelay: COIN_PAUSE, delay: COIN_DELAY },
            y: { duration: COIN_DUR, repeat: Infinity, ease: [0.4, 0, 0.2, 1], times: CT, repeatDelay: COIN_PAUSE, delay: COIN_DELAY },
          }}
        >
          {/* Wide outer halo */}
          <circle cx={136} cy={155} r={30} fill="#FF6A1A" fillOpacity={0.12} />
          {/* Mid bloom */}
          <circle cx={136} cy={155} r={22} fill="#FF6A1A" fillOpacity={0.18} />
          {/* Coin body */}
          <circle cx={136} cy={155} r={16} fill="#FF6A1A" stroke="rgba(255,255,255,0.90)" strokeWidth={2.5} />
          {/* ₹ symbol */}
          <text x={136} y={155} textAnchor="middle" dominantBaseline="central"
            fontSize={15} fontWeight="700" fill="#fff"
            fontFamily="Hanken Grotesk, sans-serif">₹</text>
        </motion.g>

        {/* ── Floating bank chips ─────────────────────────────── */}
        <motion.g variants={fadeUp} className="animate-float">
          <rect x="14"  y="30" width="76" height="34" rx="11"
            fill="rgba(255,255,255,0.90)" stroke="#C8D8F0" strokeWidth="1" />
          <circle cx="36" cy="47" r="7" fill="#1B2A4A" />
          <rect x="48" y="42" width="30" height="5" rx="2.5" fill="#C8D8F0" />
          <rect x="48" y="51" width="22" height="5" rx="2.5" fill="#D8E8FF" />
        </motion.g>
        <motion.g variants={fadeUp} className="animate-float-slow">
          <rect x="350" y="30" width="76" height="34" rx="11"
            fill="rgba(255,255,255,0.90)" stroke="#C8D8F0" strokeWidth="1" />
          <circle cx="372" cy="47" r="7" fill="#12A150" />
          <rect x="384" y="42" width="30" height="5" rx="2.5" fill="#C8D8F0" />
          <rect x="384" y="51" width="22" height="5" rx="2.5" fill="#D8E8FF" />
        </motion.g>
      </motion.svg>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 118, damping: 18 } },
}
