import { classificationLabel, classificationColor, classificationIcon, classificationPlain } from '../lib/data'
import InfoTip from './InfoTip'

export default function ClassificationBadge({ c, withTip = false }: { c: string; withTip?: boolean }) {
  const color = classificationColor(c)
  const label = classificationLabel(c)
  const icon = classificationIcon(c)
  return (
    <span
      className="chip border"
      style={{ color, borderColor: color + '40', backgroundColor: color + '14' }}
      aria-label={`Classification: ${label}`}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
      {withTip && (
        <InfoTip label={`What does "${label}" mean?`}>
          <strong className="text-white">{label}.</strong> {classificationPlain(c)}
        </InfoTip>
      )}
    </span>
  )
}
