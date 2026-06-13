import { useState, useEffect, useCallback } from 'react'

export type Theme = 'light' | 'dark'

function current(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Theme hook backed by the `dark` class on <html>. Toggling flips the class
 * and persists to localStorage; a MutationObserver keeps every consumer
 * (charts in different pages) in sync without a context provider.
 */
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
      /* ignore storage errors */
    }
  }, [])

  return { theme, toggle }
}

/** Theme-aware colors for Recharts (which take props, not Tailwind classes). */
export function chartTheme(theme: Theme) {
  const dark = theme === 'dark'
  return {
    grid: dark ? '#2A303C' : '#EBE6DA',
    axis: dark ? '#6E7480' : '#9A9DA7',
    tooltip: {
      background: dark ? '#161B22' : '#FFFFFF',
      border: `1px solid ${dark ? '#2A303C' : '#EAE4D7'}`,
      borderRadius: '12px',
      fontSize: '12px',
      boxShadow: '0 10px 30px -16px rgba(0,0,0,0.35)',
      color: dark ? '#E9EDF3' : '#181B24',
    },
  }
}
