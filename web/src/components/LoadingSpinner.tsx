export default function LoadingSpinner({ message = 'Loading the latest numbers…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-5" role="status" aria-live="polite">
      <svg className="animate-spin-slow" width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r="21" fill="none" className="stroke-line" strokeWidth="4" />
        <path d="M26 5 a21 21 0 0 1 21 21" fill="none" stroke="#FF6A1A" strokeWidth="4" strokeLinecap="round" />
        <path d="M26 47 a21 21 0 0 1 -21 -21" fill="none" stroke="#12A150" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <p className="text-ink-soft text-sm">{message}</p>
    </div>
  )
}
