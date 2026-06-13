import { motion } from 'framer-motion'

/**
 * Illustrative hero: two phones exchanging money over UPI, a rupee coin
 * travelling the connection arc, a success tick, and floating bank chips.
 * Pure SVG + Framer Motion — no external images.
 */
export default function HeroArt() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto select-none" aria-hidden="true">
      {/* Soft glow backdrop */}
      <div className="absolute inset-0 blur-3xl opacity-60"
        style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,106,26,0.25), transparent 60%)' }} />

      <motion.svg
        viewBox="0 0 440 320"
        className="relative w-full"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      >
        {/* connection arc */}
        <motion.path
          d="M120 150 C 180 70, 260 70, 320 150"
          fill="none"
          stroke="#FF6A1A"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
          className="animate-dash-flow"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1 } }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        {/* Left phone (payer) */}
        <motion.g variants={fadeUp}>
          <rect x="64" y="118" width="92" height="170" rx="18" fill="#161A23" />
          <rect x="72" y="126" width="76" height="154" rx="12" fill="#FBF8F2" />
          <rect x="98" y="121" width="24" height="5" rx="2.5" fill="#2A3142" />
          <circle cx="110" cy="166" r="18" fill="#FF6A1A" fillOpacity="0.14" />
          <text x="110" y="173" textAnchor="middle" fontSize="20" fontWeight="700" fill="#E2540B" fontFamily="Hanken Grotesk, sans-serif">₹</text>
          <rect x="84" y="198" width="52" height="7" rx="3.5" fill="#EAE4D7" />
          <rect x="84" y="214" width="36" height="7" rx="3.5" fill="#EAE4D7" />
          <rect x="84" y="244" width="52" height="20" rx="10" fill="#FF6A1A" />
        </motion.g>

        {/* Right phone (payee) */}
        <motion.g variants={fadeUp}>
          <rect x="284" y="118" width="92" height="170" rx="18" fill="#161A23" />
          <rect x="292" y="126" width="76" height="154" rx="12" fill="#FBF8F2" />
          <rect x="318" y="121" width="24" height="5" rx="2.5" fill="#2A3142" />
          <circle cx="330" cy="166" r="18" fill="#12A150" fillOpacity="0.16" />
          <path d="M322 166 l5 6 l11 -13" stroke="#0A7C3C" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="304" y="198" width="52" height="7" rx="3.5" fill="#EAE4D7" />
          <rect x="304" y="214" width="36" height="7" rx="3.5" fill="#EAE4D7" />
          <rect x="304" y="244" width="52" height="20" rx="10" fill="#12A150" />
        </motion.g>

        {/* Travelling coin */}
        <motion.g variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
          <motion.circle
            cx={120}
            cy={150}
            initial={{ cx: 120, cy: 150 }}
            r={15}
            fill="#FF6A1A"
            stroke="#fff"
            strokeWidth={2.5}
            animate={{
              cx: [120, 220, 320],
              cy: [150, 86, 150],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
          />
          <motion.text
            x={120}
            y={155}
            initial={{ x: 120, y: 155 }}
            fontSize={15}
            fontWeight="700"
            fill="#fff"
            textAnchor="middle"
            fontFamily="Hanken Grotesk, sans-serif"
            animate={{ x: [120, 220, 320], y: [155, 91, 155] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
          >
            ₹
          </motion.text>
        </motion.g>

        {/* Floating bank chips */}
        <motion.g variants={fadeUp} className="animate-float">
          <rect x="26" y="40" width="64" height="30" rx="10" fill="#fff" stroke="#EAE4D7" />
          <circle cx="44" cy="55" r="7" fill="#1B2A4A" />
          <rect x="56" y="51" width="26" height="4" rx="2" fill="#D9D2C2" />
          <rect x="56" y="59" width="18" height="4" rx="2" fill="#EAE4D7" />
        </motion.g>
        <motion.g variants={fadeUp} className="animate-float-slow">
          <rect x="350" y="56" width="64" height="30" rx="10" fill="#fff" stroke="#EAE4D7" />
          <circle cx="368" cy="71" r="7" fill="#12A150" />
          <rect x="380" y="67" width="26" height="4" rx="2" fill="#D9D2C2" />
          <rect x="380" y="75" width="18" height="4" rx="2" fill="#EAE4D7" />
        </motion.g>
      </motion.svg>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 16 } },
}
