import { useState, useEffect, useCallback } from 'react'

export type Theme = 'light' | 'dark'

function current(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(current)

  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(current()))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* ignore */
    }
  }, [])

  return { theme, toggle }
}

/** Theme-aware Recharts config matching the frost glass palette. */
export function chartTheme(theme: Theme) {
  const dark = theme === 'dark'
  return {
    grid: dark ? '#1C2E58' : '#CAD8F5',
    axis: dark ? '#506AA0' : '#7590C8',
    tooltip: {
      background: dark ? 'rgba(10,16,38,0.94)' : 'rgba(248,251,255,0.96)',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(202,218,248,0.80)'}`,
      borderRadius: '12px',
      fontSize: '12px',
      boxShadow: dark
        ? '0 2px 4px rgba(0,0,0,0.28), 0 16px 48px -12px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.06)'
        : '0 2px 4px rgba(8,16,46,0.04), 0 16px 48px -12px rgba(8,16,46,0.10), inset 0 1px 0 rgba(255,255,255,0.65)',
      backdropFilter: 'blur(16px)',
      color: dark ? '#E2EAFC' : '#08102E',
      padding: '10px 14px',
    },
  }
}
