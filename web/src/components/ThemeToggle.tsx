import { motion } from 'framer-motion'
import { useTheme } from '../lib/useTheme'

/** Sun/moon switch that flips the light/dark theme. */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      title={`Switch to ${dark ? 'light' : 'dark'} mode`}
      className="relative grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-ink-soft hover:text-upi-orange hover:border-upi-orange/40 transition-colors shrink-0"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -45, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="text-base leading-none"
        aria-hidden="true"
      >
        {dark ? (
          /* moon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="currentColor" />
          </svg>
        ) : (
          /* sun */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
          </svg>
        )}
      </motion.span>
    </button>
  )
}
