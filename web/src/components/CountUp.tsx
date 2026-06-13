import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  to: number
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
}

export default function CountUp({ to, duration = 1200, decimals = 0, suffix = '', prefix = '' }: CountUpProps) {
  const [value, setValue] = useState(0)
  const startTime = useRef<number | null>(null)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    startTime.current = null
    const animate = (ts: number) => {
      if (!startTime.current) startTime.current = ts
      const progress = Math.min((ts - startTime.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * to)
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate)
      }
    }
    raf.current = requestAnimationFrame(animate)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [to, duration])

  return <>{prefix}{value.toFixed(decimals)}{suffix}</>
}
