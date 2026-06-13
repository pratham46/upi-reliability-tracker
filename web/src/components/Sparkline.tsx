import { tdColor } from '../lib/data'

/** Tiny inline trend line of TD% over the visible months. */
export default function Sparkline({
  values,
  width = 96,
  height = 28,
}: {
  values: (number | null)[]
  width?: number
  height?: number
}) {
  const pts = values.filter((v): v is number => v !== null)
  if (pts.length < 2) return <div style={{ width, height }} />

  const max = Math.max(...pts, 0.5)
  const min = Math.min(...pts, 0)
  const range = max - min || 1
  const stepX = width / (values.length - 1)

  let d = ''
  values.forEach((v, i) => {
    if (v === null) return
    const x = i * stepX
    const y = height - ((v - min) / range) * (height - 4) - 2
    d += `${d ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)} `
  })

  const last = pts[pts.length - 1]
  const lastIdx = values.length - 1 - [...values].reverse().findIndex((v) => v !== null)
  const lastX = lastIdx * stepX
  const lastY = height - ((last - min) / range) * (height - 4) - 2
  const color = tdColor(last)

  return (
    <svg width={width} height={height} aria-hidden="true" style={{ overflow: 'visible' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={2.6} fill={color} />
    </svg>
  )
}
