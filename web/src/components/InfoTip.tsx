import { useState, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function InfoTip({ label, children }: { label?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const id = useId()
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleShow = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ x: r.left + r.width / 2, y: r.top })
    }
    setOpen(true)
  }

  return (
    <span className="inline-flex items-center self-center shrink-0">
      <button
        ref={btnRef}
        type="button"
        aria-label={label ?? 'More information'}
        aria-describedby={open ? id : undefined}
        onMouseEnter={handleShow}
        onMouseLeave={() => setOpen(false)}
        onFocus={handleShow}
        onBlur={() => setOpen(false)}
        onClick={() => (open ? setOpen(false) : handleShow())}
        className="inline-flex items-center justify-center rounded-full text-ink-soft hover:text-upi-orange transition-colors focus:outline-none focus:ring-2 focus:ring-upi-orange/40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <path d="M12 17h.01"></path>
        </svg>
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              id={id}
              role="tooltip"
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              // transformTemplate prepends our centering/lift offsets BEFORE framer's
              // generated "translateY(Npx) scale(N)" string, so both coexist instead
              // of framer's transform overwriting our style.transform.
              transformTemplate={(_v, generated) =>
                `translateX(-50%) translateY(calc(-100% - 8px)) ${generated}`
              }
              className="pointer-events-none fixed z-[9999] w-56 rounded-xl bg-upi-ink px-3 py-2 text-left text-xs font-normal leading-relaxed text-white/90 shadow-lift"
              style={{
                left: Math.max(128, Math.min(pos.x, window.innerWidth - 128)),
                top: pos.y,
              }}
            >
              {children}
              {/* Arrow pointing down at the button */}
              <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-upi-ink" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  )
}
