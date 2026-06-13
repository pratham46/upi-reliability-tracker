import { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Accessible plain-language helper. Renders a small "?" that reveals an
 * explanation on hover or keyboard focus — used to translate finance jargon.
 */
export default function InfoTip({ label, children }: { label?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <span className="relative inline-flex items-center align-middle">
      <button
        type="button"
        aria-label={label ?? 'More information'}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="grid place-items-center w-[16px] h-[16px] rounded-full bg-ink/10 text-ink-soft text-[10px] font-bold hover:bg-upi-orange hover:text-white transition-colors"
      >
        ?
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute left-1/2 bottom-full z-50 mb-2 w-56 -translate-x-1/2 rounded-xl bg-upi-ink px-3 py-2 text-left text-xs font-normal leading-relaxed text-white/90 shadow-lift"
          >
            {children}
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-upi-ink" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
