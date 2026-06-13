import { avatarColor, initials } from '../lib/data'

/** Colored monogram chip standing in for a bank logo. */
export default function BankAvatar({
  name,
  size = 40,
  className = '',
}: {
  name: string
  size?: number
  className?: string
}) {
  const color = avatarColor(name)
  return (
    <span
      className={`inline-grid place-items-center rounded-xl font-display font-bold text-white shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        boxShadow: `0 4px 14px -4px ${color}88`,
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
