import { motion } from 'framer-motion'

/**
 * UPI-inspired brand mark: two interlocking arrows — orange (money out)
 * and green (money in) — the two-way payment exchange motif.
 */
export default function Logo({ size = 32, animated = true }: { size?: number; animated?: boolean }) {
  const Wrap = animated ? motion.svg : 'svg'
  const wrapProps = animated
    ? {
        initial: { rotate: -8, scale: 0.9, opacity: 0 },
        animate: { rotate: 0, scale: 1, opacity: 1 },
        transition: { type: 'spring' as const, stiffness: 220, damping: 16 },
        whileHover: { rotate: 6, scale: 1.06 },
      }
    : {}

  return (
    <Wrap
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      {...(wrapProps as object)}
    >
      <rect x="2" y="2" width="44" height="44" rx="13" fill="#161A23" />
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#lg-sheen)" fillOpacity="0.5" />
      {/* Orange arrow — pointing up-right (sending) */}
      <path
        d="M14 30 L28 16 M28 16 L28 25 M28 16 L19 16"
        stroke="#FF6A1A"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Green arrow — pointing down-left (receiving) */}
      <path
        d="M34 18 L20 32 M20 32 L20 23 M20 32 L29 32"
        stroke="#16B85A"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="lg-sheen" x1="2" y1="2" x2="46" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2A3142" />
          <stop offset="1" stopColor="#161A23" />
        </linearGradient>
      </defs>
    </Wrap>
  )
}
